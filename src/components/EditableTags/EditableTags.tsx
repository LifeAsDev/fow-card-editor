import { useRef, useState, useEffect } from "react";
import styles from "./styles.module.css";

type EditableTagsProps = {
	label: string;
	value: string[];
	onChange: (tags: string[]) => void;
};

export default function EditableTags({
	label,
	value,
	onChange,
}: EditableTagsProps) {
	const updateTag = (index: number, text: string) => {
		const next = [...value];
		next[index] = text;
		onChange(next);
	};

	const addTag = () => {
		onChange([...value, ""]);
	};

	const removeTag = (index: number) => {
		onChange(value.filter((_, i) => i !== index));
	};
	const [tagWidths, setTagWidths] = useState<number[]>(value.map(() => 1)); // ancho inicial
	const measureRefs = useRef<(HTMLSpanElement | null)[]>([]); // refs de los spans

	useEffect(() => {
		// mide cada span y actualiza tagWidths
		setTagWidths(
			measureRefs.current.map((span) => (span ? span.offsetWidth + 2 : 1)),
		);
	}, [value]);

	return (
		<>
			{" "}
			<label className={styles.tagsLabel}>{label}</label>
			<div className={styles.tagsContainer}>
				{value.map((tag, i) => (
					<div key={i} className={styles.tag}>
						<span
							ref={(el): void => {
								measureRefs.current[i] = el;
							}}
							className={styles.measure}
						>
							{tag || " "}
						</span>
						<input
							style={{ width: tagWidths[i] || 1 }}
							className={styles.tagInput}
							value={tag}
							placeholder="..."
							onChange={(e) => updateTag(i, e.target.value)}
						/>
						<button
							type="button"
							className={styles.removeTag}
							onClick={() => removeTag(i)}
						>
							×
						</button>
					</div>
				))}

				<button type="button" className={styles.addTag} onClick={addTag}>
					+ Add
				</button>
			</div>
		</>
	);
}
