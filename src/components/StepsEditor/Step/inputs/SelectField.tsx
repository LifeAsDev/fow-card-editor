import { FieldProps } from "@/src/components/StepsEditor/Step/inputs/StringField";
import styles from "./styles.module.css";
export function SelectField({ schema, value, onChange }: FieldProps<string>) {
	return (
		<label className={styles.input}>
			{schema.label}
			<select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
				<option value="" disabled>
					Select...
				</option>
				{schema.options?.map((opt) => (
					<option key={opt} value={opt}>
						{opt}
					</option>
				))}
			</select>
		</label>
	);
}
