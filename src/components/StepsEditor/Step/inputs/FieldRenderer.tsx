import { FieldProps } from "@/src/components/StepsEditor/Step/inputs/StringField";
import {
	StringField,
	SelectField,
	ObjectField,
	ArrayObjectField,
} from "./index";
import AbilitiesEditor from "@/src/components/AbilitiesEditor/AbilitiesEditor";
import StepsEditor from "@/src/components/StepsEditor/StepsEditor";

export function FieldRenderer(props: FieldProps) {
	const { schema } = props;

	switch (schema.type) {
		case "string":
			return <StringField {...props} />;

		case "select":
			return <SelectField {...props} />;

		case "object":
			return <ObjectField {...props} />;

		case "array":
			return <ArrayObjectField {...props} />;

		case "abilities":
			return <AbilitiesEditor {...props} />;

		case "steps":
			return <StepsEditor {...props} />;

		default:
			return null;
	}
}
