import cardModel from "@/src/utils/generated/cardModelSimple.json";
import OpenAI from "openai";

export interface TextToAbilityResult {
	success: boolean;
	ability?: any;
	warnings: string[];
	errors: string[];
	rawResponse?: string;
}

export function buildSystemPrompt(): string {
	const triggers = cardModel.abilities.triggers.join(", ");
	const events = cardModel.abilities.events.join(", ");
	const actions = cardModel.abilities.actions.join(", ");

	const actionPropsStr = Object.entries(cardModel.abilities.actionProperties)
		.map(([action, props]) => {
			const entries = Object.entries(props as Record<string, string | string[]>)
				.map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join("|") : v}`)
				.join(", ");
			return `  ${action}: { ${entries} }`;
		})
		.join("\n");

	const enums = {
		type: cardModel.fields.type.enum.slice(0, 20).join(", "),
		subtype: cardModel.fields.subtype.enum.slice(0, 20).join(", "),
		cost: cardModel.fields.cost.enum.join(", "),
		att: cardModel.fields.att.enum.join(", "),
		keywords: cardModel.fields.keywords.enum.slice(0, 20).join(", "),
	};

	return `You are a Flesh and Blood card game ability parser. Your job is to convert card text into valid ability JSON structures using ONLY the available actions and properties.

CRITICAL RULES:
1. Return ONLY valid JSON (no markdown, no explanation unless IMPOSSIBLE)
2. If an ability CANNOT be represented with existing actions, respond with: {"IMPOSSIBLE": true, "reason": "specific reason"}
3. Each step must have an "action" property that exists in the action list
4. Properties must match exactly what's allowed for each action
5. Use "value" to store results for later steps
6. Variables created in one step can be referenced in later steps
7. If text says "choose one" use chooseOne action
8. For conditions, use "condition" action with "conditions" array using operators: ==, !=, >, <, >=, <=

VALID TRIGGERS: ${triggers}
VALID EVENTS: ${events}

VALID ACTIONS (${cardModel.abilities.actions.length} total):
${actions}

ACTION PROPERTIES:
${actionPropsStr}

VALID ENUMS:
- type: ${enums.type}...
- subtype: ${enums.subtype}...
- cost: ${enums.cost}
- att: ${enums.att}
- keywords: ${enums.keywords}...
- state: field, hand, deck, graveyard, removed
- owner: 1 (me), 0 (opponent)
- who: me, opponent

EXAMPLE OUTPUT:
{
  "trigger": "activate",
  "steps": [
	{"action": "filterCards", "state": "field", "type": "Resonator", "count": 1, "value": "target"},
	{"action": "destroy", "target": "target"}
  ]
}

IMPOSSIBLE EXAMPLES (return these exactly):
- If text requires custom actions not in the list: {"IMPOSSIBLE": true, "reason": "Requires custom action 'X' not available"}
- If text uses game mechanics not representable: {"IMPOSSIBLE": true, "reason": "Mechanic 'X' not supported yet"}`;
}

export function buildUserPrompt(cardText: string, cardName: string): string {
	return `Parse this Flesh and Blood card ability text into valid ability JSON:

Card Name: ${cardName}
Text: ${cardText}

Return ONLY the JSON ability object with "trigger" and "steps" array, or {"IMPOSSIBLE": true, "reason": "..."} if it cannot be represented.
Do NOT include markdown code blocks or any explanation.`;
}

export async function parseTextWithLLMInBrowser(
	cardText: string,
	cardName: string,
	apiKey: string,
): Promise<TextToAbilityResult> {
	try {
		// Crear cliente sin dangerouslyAllowBrowser (no recomendado en prod)
		const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

		const systemContent = buildSystemPrompt();
		const userContent = buildUserPrompt(cardText, cardName);

		// Usar Responses API para pedir JSON estructurado
		const response = await client.responses.create({
			model: "gpt-4o-mini",
			input: [
				{
					role: "system",
					content: `
Return ONLY the JSON ability object with "trigger" and "steps" array, or {"IMPOSSIBLE": true, "reason": "..."} if it cannot be represented.
Do NOT include markdown code blocks or any explanation.`,
				},
				{ role: "user", content: userContent },
			],
			// Puedes solicitar la salida estructurada para mejorar parseo (si está soportado)
			// outputFormat: "json" // (depende de la versión SDK / API)
		});

		const rawText = response.choices[0]?.message?.content ?? "";

		// Intentar parsear respuesta JSON robustamente
		let parsed;
		try {
			parsed = JSON.parse(rawText);
		} catch {
			const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
			if (jsonMatch) {
				parsed = JSON.parse(jsonMatch[1]);
			} else {
				return {
					success: false,
					errors: ["Failed to parse LLM response as JSON"],
					warnings: [],
					rawResponse: rawText,
				};
			}
		}

		if (parsed.IMPOSSIBLE) {
			return {
				success: false,
				errors: [
					parsed.reason ||
						"Ability cannot be represented with available actions",
				],
				warnings: [],
				rawResponse: rawText,
			};
		}

		const validation = validateAbility(parsed);
		if (!validation.valid) {
			return {
				success: false,
				errors: validation.errors,
				warnings: validation.warnings,
				rawResponse: rawText,
			};
		}

		return {
			success: true,
			ability: parsed,
			warnings: validation.warnings,
			errors: [],
			rawResponse: rawText,
		};
	} catch (err: any) {
		return {
			success: false,
			errors: [err.message || "Unknown error calling OpenAI"],
			warnings: [],
		};
	}
}
function validateAbility(ability: any): {
	valid: boolean;
	errors: string[];
	warnings: string[];
} {
	const errors: string[] = [];
	const warnings: string[] = [];

	if (!ability.trigger) errors.push("Missing 'trigger' field");
	else if (!cardModel.abilities.triggers.includes(ability.trigger)) {
		errors.push(
			`Invalid trigger: '${ability.trigger}'. Must be one of: ${cardModel.abilities.triggers.join(", ")}`,
		);
	}

	if (ability.event && !cardModel.abilities.events.includes(ability.event)) {
		errors.push(
			`Invalid event: '${ability.event}'. Must be one of: ${cardModel.abilities.events.join(", ")}`,
		);
	}

	if (!Array.isArray(ability.steps)) {
		errors.push("'steps' must be an array");
		return { valid: false, errors, warnings };
	}

	if (ability.steps.length === 0) {
		warnings.push("Ability has no steps");
	}

	for (let i = 0; i < ability.steps.length; i++) {
		const step = ability.steps[i];
		if (!step.action) {
			errors.push(`Step ${i}: missing 'action' field`);
			continue;
		}

		if (!cardModel.abilities.actions.includes(step.action)) {
			errors.push(
				`Step ${i}: invalid action '${step.action}'. Must be one of: ${cardModel.abilities.actions.join(", ")}`,
			);
			continue;
		}

		const actionProperties = cardModel.abilities.actionProperties as Record<
			string,
			Record<string, string | string[]>
		>;
		const validProps = Object.keys(actionProperties[step.action] || {});
		for (const prop of Object.keys(step)) {
			if (prop !== "action" && !validProps.includes(prop)) {
				warnings.push(
					`Step ${i} (${step.action}): unexpected property '${prop}'. Valid: [${validProps.join(", ")}]`,
				);
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}
