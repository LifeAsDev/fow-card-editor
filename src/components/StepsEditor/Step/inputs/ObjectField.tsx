import { FieldProps } from "@/src/components/StepsEditor/Step/inputs/StringField";
import { FieldRenderer } from "@/src/components/StepsEditor/Step/inputs/FieldRenderer";
import styles from "./styles.module.css";
export function ObjectField({
	schema,
	value = {},
	onChange,
}: FieldProps<Record<string, any>>) {
	return (
		<fieldset className={styles.fieldSet}>
			{schema.fields &&
				Object.entries(schema.fields).map(([key, fieldSchema]) => (
					<FieldRenderer
						key={key}
						schema={fieldSchema}
						value={value[key]}
						onChange={(v: any) => onChange({ ...value, [key]: v })}
					/>
				))}
		</fieldset>
	);
}
