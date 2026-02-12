const fs = require("fs");
const path = require("path");

const INPUT = path.resolve(__dirname, "./cardDB.json");
const OUT_DIR = path.resolve(__dirname, "./generated");
const OUT = path.join(OUT_DIR, "cardModelSimple.json");

if (!fs.existsSync(INPUT)) {
	console.error("Input not found:", INPUT);
	process.exit(1);
}

const db = JSON.parse(fs.readFileSync(INPUT, "utf8"));

const fields = {}; // name -> { types:Set, examples:Set, distinctValues:Set, arrayElementTypes:Set }
const abilityStructure = {
	triggers: new Set(),
	events: new Set(),
	actions: new Set(),
	actionProperties: {}, // action -> { prop: Set(types) }
};

function ensure(name) {
	if (!fields[name]) {
		fields[name] = {
			types: new Set(),
			examples: new Set(),
			distinctValues: new Set(),
			arrayElementTypes: new Set(),
		};
	}
}

function record(name, val) {
	ensure(name);
	let t;
	if (Array.isArray(val)) t = "array";
	else if (val === null) t = "null";
	else t = typeof val;
	fields[name].types.add(t);

	// examples (limit small)
	try {
		const ex =
			typeof val === "object"
				? JSON.stringify(val).slice(0, 200)
				: String(val).slice(0, 200);
		if (fields[name].examples.size < 5 && ex !== "undefined")
			fields[name].examples.add(ex);
	} catch (e) {}

	// collect distinct string-like values / enum candidates
	if (typeof val === "string") {
		fields[name].distinctValues.add(val);
	} else if (Array.isArray(val)) {
		for (const el of val) {
			const et = Array.isArray(el) ? "array" : el === null ? "null" : typeof el;
			fields[name].arrayElementTypes.add(et);
			if (typeof el === "string") fields[name].distinctValues.add(el);
		}
	}
}

function extractAbilityInfo(ability) {
	if (!ability || typeof ability !== "object") return;

	// collect trigger type
	if (ability.trigger) abilityStructure.triggers.add(ability.trigger);
	if (ability.event) abilityStructure.events.add(ability.event);

	// walk steps
	if (Array.isArray(ability.steps)) {
		for (const step of ability.steps) {
			if (step && typeof step === "object") {
				if (step.action) {
					abilityStructure.actions.add(step.action);
					// collect all property names + types per action
					if (!abilityStructure.actionProperties[step.action]) {
						abilityStructure.actionProperties[step.action] = {};
					}
					for (const k of Object.keys(step)) {
						if (k !== "action") {
							if (!abilityStructure.actionProperties[step.action][k]) {
								abilityStructure.actionProperties[step.action][k] = new Set();
							}

							const v = step[k];
							let t;
							if (Array.isArray(v)) t = "array";
							else if (v === null) t = "null";
							else t = typeof v;
							abilityStructure.actionProperties[step.action][k].add(t);
						}
					}
				}
			}
		}
	}
}

for (const card of Object.values(db)) {
	if (card && typeof card === "object") {
		for (const [k, v] of Object.entries(card)) {
			record(k, v);

			// parse abilities structure
			if (k === "abilities" && Array.isArray(v)) {
				for (const ability of v) {
					extractAbilityInfo(ability);
				}
			}
		}
	}
}

// Build output
const model = {
	generatedAt: new Date().toISOString(),
	fields: {},
	abilities: {
		triggers: Array.from(abilityStructure.triggers).sort(),
		events: Array.from(abilityStructure.events).sort(),
		actions: Array.from(abilityStructure.actions).sort(),
		actionProperties: {},
	},
};

for (const action of Array.from(abilityStructure.actions).sort()) {
	const props = abilityStructure.actionProperties[action] || {};
	const out = {};
	for (const prop of Object.keys(props).sort()) {
		const types = Array.from(props[prop]).sort();
		out[prop] = types.length === 1 ? types[0] : types;
	}
	model.abilities.actionProperties[action] = out;
}

for (const [k, meta] of Object.entries(fields)) {
	const types = Array.from(meta.types).sort();
	const examples = Array.from(meta.examples);
	let enumValues = undefined;
	const distinct = Array.from(meta.distinctValues);
	if (distinct.length > 0 && distinct.length <= 200) {
		enumValues = distinct.sort();
	}
	const arrayElementTypes = Array.from(meta.arrayElementTypes).sort();
	model.fields[k] = { types, examples };
	if (arrayElementTypes.length)
		model.fields[k].arrayElementTypes = arrayElementTypes;
	if (enumValues) model.fields[k].enum = enumValues;
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(model, null, 2), "utf8");
console.log("Generated simple model:", OUT);
