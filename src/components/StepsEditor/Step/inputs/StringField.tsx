import { FieldSchema } from "../stepConfigs/stepConfigs";
import styles from "./styles.module.css";
export interface FieldProps<T = any> {
	schema: FieldSchema;
	value: T;
	onChange: (value: T) => void;
}

export function StringField({ schema, value, onChange }: FieldProps<string>) {
	return (
		<label className={styles.input}>
			{schema.label}
			<input
				type="text"
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={schema.label}
			/>
		</label>
	);
}
