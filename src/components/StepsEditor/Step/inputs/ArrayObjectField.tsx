import { ObjectField } from "@/src/components/StepsEditor/Step/inputs";
import { FieldProps } from "@/src/components/StepsEditor/Step/inputs/StringField";
import styles from "./styles.module.css";
import { FieldRenderer } from "@/src/components/StepsEditor/Step/inputs/FieldRenderer";

export function ArrayObjectField({
	schema,
	value = [],
	onChange,
}: FieldProps<Record<string, any>[]>) {
	return (
		<div className={styles.objectContainer}>
			<h4>{schema.label}</h4>
			<div className={styles.objectList}>
				{value &&
					Array.isArray(value) &&
					value.map((obj, i) => (
						<div key={obj.id} className={styles.objectItem}>
							<button
								className={`${styles.button} ${styles.leftM}`}
								onClick={() => onChange(value.filter((_, idx) => idx !== i))}
							>
								Remove
							</button>
							<ObjectField
								schema={schema}
								value={obj}
								onChange={(v) => {
									const copy = [...value];
									copy[i] = v;
									onChange(copy);
								}}
							/>
						</div>
					))}
				<button
					className={styles.button}
					onClick={() => onChange([...value, { id: crypto.randomUUID() }])}
				>
					+ Add
				</button>
			</div>
		</div>
	);
}
