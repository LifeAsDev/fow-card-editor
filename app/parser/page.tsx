"use client";

import { useState } from "react";
import { parseTextWithLLMInBrowser } from "@/src/utils/textToAbility";
import styles from "./styles.module.css";

export default function AIAbilityParserPage() {
	const [cardName, setCardName] = useState("");
	const [cardText, setCardText] = useState("");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>(null);
	const [apiKey, setApiKey] = useState("");

	const handleParse = async () => {
		if (!apiKey) {
			alert("Please enter your Anthropic API key");
			return;
		}

		setLoading(true);
		setResult(null);

		const parseResult = await parseTextWithLLMInBrowser(
			cardText,
			cardName,
			apiKey,
		);
		setResult(parseResult);
		setLoading(false);
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		alert("Copied to clipboard!");
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>🤖 AI Ability Parser</h1>
				<p>Convert card text to ability JSON using Claude</p>
			</div>

			<div className={styles.inputSection}>
				<div className={styles.formGroup}>
					<label>Anthropic API Key</label>
					<input
						type="password"
						placeholder="sk-ant-..."
						value={apiKey}
						onChange={(e) => setApiKey(e.target.value)}
						className={styles.input}
					/>
					<small>
						Your API key is never stored, only used for this request
					</small>
				</div>

				<div className={styles.formGroup}>
					<label>Card Name</label>
					<input
						type="text"
						placeholder="e.g., Odin, Supreme God"
						value={cardName}
						onChange={(e) => setCardName(e.target.value)}
						className={styles.input}
					/>
				</div>

				<div className={styles.formGroup}>
					<label>Card Text / Ability</label>
					<textarea
						placeholder="Paste the full card text here..."
						value={cardText}
						onChange={(e) => setCardText(e.target.value)}
						className={styles.textarea}
						rows={8}
					/>
				</div>

				<button
					onClick={handleParse}
					disabled={loading || !cardName || !cardText}
					className={styles.button}
				>
					{loading ? "🔄 Parsing..." : "✨ Parse Ability"}
				</button>
			</div>

			{result && (
				<div className={styles.resultSection}>
					{result.errors.length > 0 && (
						<div className={styles.errorBox}>
							<h3>❌ Errors ({result.errors.length})</h3>
							<ul>
								{result.errors.map((err: string, i: number) => (
									<li key={i}>{err}</li>
								))}
							</ul>
						</div>
					)}

					{result.warnings.length > 0 && (
						<div className={styles.warningBox}>
							<h3>⚠️ Warnings ({result.warnings.length})</h3>
							<ul>
								{result.warnings.map((warn: string, i: number) => (
									<li key={i}>{warn}</li>
								))}
							</ul>
						</div>
					)}

					{result.success && result.ability && (
						<div className={styles.successBox}>
							<h3>✅ Generated Ability</h3>
							<div className={styles.jsonOutput}>
								<pre>{JSON.stringify(result.ability, null, 2)}</pre>
								<button
									onClick={() =>
										copyToClipboard(JSON.stringify(result.ability, null, 2))
									}
									className={styles.copyButton}
								>
									📋 Copy JSON
								</button>
							</div>
						</div>
					)}

					{result.rawResponse && (
						<details className={styles.details}>
							<summary>View Raw LLM Response</summary>
							<pre className={styles.rawResponse}>{result.rawResponse}</pre>
						</details>
					)}
				</div>
			)}
		</div>
	);
}
