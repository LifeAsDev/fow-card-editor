import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import styles from "../AbilitiesEditor/abilities.module.css";
import { FieldRenderer } from "@/src/components/StepsEditor/Step/inputs/FieldRenderer";
import {
	actionConfigs,
	ActionSchema,
} from "@/src/components/StepsEditor/Step/stepConfigs/stepConfigs";
import { actionGroups } from "@/src/components/StepsEditor/Step/actionGroups";

type Props = {
	id: string;
	index: number;
	step: any; // Step & { id: string }
	isExpanded: boolean;
	onToggleExpand: () => void;
	onUpdate: (updates: any) => void;
	onRemove: () => void;
};

export default function SortableStepItem({
	id,
	index,
	step,
	isExpanded,
	onToggleExpand,
	onUpdate,
	onRemove,
}: Props) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		setActivatorNodeRef,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const action = step.action;

	return (
		<div key={id} ref={setNodeRef} style={style} className={styles.stepCard}>
			<div className={styles.stepHeader}>
				<div
					ref={setActivatorNodeRef}
					{...attributes}
					{...listeners}
					className={styles.dragHandle}
				>
					☰
				</div>
				<select
					value={action || ""}
					onChange={(e) => {
						function sanitizeBySchema(
							oldValue: any,
							schema: ActionSchema,
						): any {
							const result: any = {};

							for (const [key, field] of Object.entries(schema)) {
								const prev = oldValue?.[key];

								switch (field.type) {
									case "string":
									case "select":
										result[key] = typeof prev === "string" ? prev : "";
										break;

									case "array":
									case "abilities":
									case "steps":
										result[key] = Array.isArray(prev) ? prev : [];
										break;

									case "object":
										result[key] =
											field.fields && typeof prev === "object"
												? sanitizeBySchema(prev, field.fields)
												: field.fields
													? sanitizeBySchema({}, field.fields)
													: {};
										break;

									default:
										result[key] = null;
								}
							}

							return result;
						}
						function buildStepForAction(action: string) {
							const schema = actionConfigs[action];
							if (!schema) return { action };

							return {
								id: step.id,
								action,
								...sanitizeBySchema(step, schema),
							};
						}

						const newAction = e.target.value;
						onUpdate(buildStepForAction(newAction));
					}}
					className={styles.actionSelect}
				>
					<option disabled value="">
						Select action...
					</option>

					{Object.entries(actionGroups).map(([groupName, actions]) => (
						<optgroup key={groupName} label={groupName}>
							{actions
								.filter((a) => a in actionConfigs)
								.map((a) => (
									<option key={a} value={a}>
										{a}
									</option>
								))}
						</optgroup>
					))}
				</select>

				<button onClick={onToggleExpand} className={styles.toggleButton}>
					{!isExpanded ? "▸" : "▾"}
				</button>

				<button onClick={onRemove} className={styles.removeButton}>
					✕
				</button>
			</div>

			{!isExpanded && (
				<div className={styles.stepContent}>
					{/* 		{action === "addAbilities" && (
						<AbilitiesEditor
							value={step.abilities || []}
							onChange={(abilities) => onUpdate({ abilities })}
						/>
					)}
 */}
					{action &&
						actionConfigs[action] &&
						Object.entries(actionConfigs[action]).map(([key, fieldSchema]) => {
							return (
								<div
									key={step.id + fieldSchema.label}
									id={step.id + fieldSchema.label}
								>
									<FieldRenderer
										schema={fieldSchema}
										value={step[key]}
										onChange={(next) => {
											onUpdate({
												...step,
												[key]: next,
											});
										}}
									/>
								</div>
							);
						})}
					{action && !actionConfigs[action] && <p>config missing</p>}
					{!action && <p>Select action</p>}
				</div>
			)}
		</div>
	);
}
