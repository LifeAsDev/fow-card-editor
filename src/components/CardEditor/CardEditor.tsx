"use client";

import { act, useEffect, useState } from "react";
import styles from "./styles.module.css";
import EditableTags from "@/src/components/EditableTags/EditableTags";
import { Ability } from "@/src/types/types";
import AbilitiesEditor from "@/src/components/AbilitiesEditor/AbilitiesEditor";
import { removeIdsFromArrays } from "@/src/components/CardEditor/formatCard";

type costs = "Water" | "Wind" | "Fire" | "Light" | "Darkness" | "Void";

type CardData = {
	id: string;
	name: string;
	type: string[];
	subtype: string[];
	atk: string;
	def: string;
	text: string;
	image: string;
	att: string[];
	abilities: Ability[];
	cost: costs[];
};

export default function CardEditor() {
	const initialData: CardData = {
		id: "",
		name: "",
		type: [],
		subtype: [],
		atk: "",
		def: "",
		text: "",
		att: [],
		image: "",
		abilities: [],
		cost: [],
	};

	const [card, setCard] = useState<CardData>(initialData);
	useEffect(() => {
		const savedCard = localStorage.getItem("card-editor-cache");
		if (savedCard) {
			try {
				setCard(JSON.parse(savedCard));
			} catch (e) {
				console.error("Error", e);
			}
		} else {
			setCard((prev) => {
				return {
					...prev,
					image: "https://fowsim.s3.amazonaws.com/media/cards/CMB-068.jpg",
				};
			});
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("card-editor-cache", JSON.stringify(card));
	}, [card]);

	// Opcional: Función para limpiar el cache al terminar o resetear
	const clearCache = () => {
		localStorage.removeItem("card-editor-cache");
	};

	const update = (key: keyof CardData, value: any) => {
		setCard((prev) => ({ ...prev, [key]: value }));
	};
	const [copied, setCopied] = useState(false);

	const formatCard = () => {
		const parseCard = { ...card };

		(Object.keys(parseCard) as (keyof typeof parseCard)[]).forEach((key) => {
			if (parseCard[key] === "") {
				delete parseCard[key];
			}
		});

		return parseCard;
	};

	return (
		<div className={styles.container}>
			<div className={styles.panel}>
				<h2 className={styles.title}>FoW Card Editor</h2>
				<label className={styles.label}>
					Card ID
					<input
						className={styles.input}
						value={card.id}
						onChange={(e) => update("id", e.target.value)}
					/>
				</label>
				<label className={styles.label}>
					Name
					<input
						className={styles.input}
						value={card.name}
						onChange={(e) => update("name", e.target.value)}
					/>
				</label>
				<label className={styles.label}>
					Image URL
					<input
						className={styles.input}
						value={card.image}
						onChange={(e) => update("image", e.target.value)}
					/>
				</label>
				<div className={styles.label}>
					<EditableTags
						label="Type"
						value={card.type}
						onChange={(tags) => update("type", tags)}
					/>
				</div>
				<div className={styles.label}>
					<EditableTags
						label="Subtype"
						value={card.subtype}
						onChange={(tags) => update("subtype", tags)}
					/>
				</div>

				<div className={styles.label}>
					<EditableTags
						label="Attribute"
						value={card.att}
						onChange={(tags) => update("att", tags)}
					/>
				</div>
				<div className={styles.label}>
					<EditableTags
						label="Cost"
						value={card.cost}
						onChange={(tags) => update("cost", tags)}
					/>
				</div>
				<label className={styles.label}>
					ATK
					<input
						className={styles.input}
						type="string"
						value={card.atk}
						onChange={(e) => update("atk", e.target.value)}
					/>
				</label>
				<label className={styles.label}>
					DEF
					<input
						className={styles.input}
						type="string"
						value={card.def}
						onChange={(e) => update("def", e.target.value)}
					/>
				</label>
				<label className={styles.label}>
					Text
					<textarea
						className={styles.textarea}
						rows={4}
						value={card.text}
						onChange={(e) => update("text", e.target.value)}
					/>
				</label>

				<div className={styles.label}>
					<h3>Abilities</h3>
					<AbilitiesEditor
						value={card.abilities}
						onChange={(abilities) => update("abilities", abilities)}
					/>
				</div>
			</div>

			{/* PREVIEW */}
			<div className={styles.panel}>
				<div className={styles.cardImage}>
					{card.image && <img src={card.image} alt={card.name} />}
				</div>
				<div style={{ position: "relative" }}>
					<button
						onClick={() => {
							navigator.clipboard.writeText(
								JSON.stringify(formatCard(), null, 2),
							);
							setCopied(true);
							setTimeout(() => setCopied(false), 1200);
						}}
						style={{
							position: "absolute",
							top: 8,
							right: 8,
							background: copied ? "#16a34a" : "#020617",
							color: "#e5e7eb",
							border: "1px solid #334155",
							borderRadius: 6,
							padding: "4px 8px",
							fontSize: 12,
							cursor: "pointer",
							zIndex: 1,
							transition: "background 0.15s ease",
						}}
					>
						{copied ? "Copied ✓" : "Copy"}
					</button>

					<pre
						style={{
							background: "#020617",
							color: "#e5e7eb",
							padding: 12,
							borderRadius: 8,
							fontFamily: "monospace",
							fontSize: 13,
							whiteSpace: "pre-wrap",
							overflow: "auto",
							minHeight: "50px",
						}}
					>
						{JSON.stringify(formatCard(), null, 2)}
					</pre>
				</div>
			</div>
		</div>
	);
}
