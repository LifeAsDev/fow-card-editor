import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Ability } from "@/src/types/types";
import StepsEditor from "@/src/components/StepsEditor/StepsEditor";

import styles from "./abilities.module.css";

type Props = {
	id: string;
	ability: Ability;
	isExpanded: boolean;
	onToggleExpand: () => void;
	onUpdate: (updates: Partial<Ability>) => void;
	onRemove: () => void;
};

export default function SortableAbilityItem({
	id,
	ability,
	isExpanded,
	onToggleExpand,
	onUpdate,
	onRemove,
}: Props) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });
	const style = {
		transform: transform
			? CSS.Transform.toString({
					x: transform.x ?? 0,
					y: transform.y ?? 0,
					scaleX: 1,
					scaleY: 1,
				})
			: undefined,
		transition,
	};

	return (
		<div key={id} ref={setNodeRef} style={style} className={styles.abilityCard}>
			<div className={styles.abilityHeader}>
				<div {...attributes} {...listeners} className={styles.dragHandle}>
					☰
				</div>

				<select
					value={ability.trigger}
					onChange={(e) =>
						onUpdate({ trigger: e.target.value as Ability["trigger"] })
					}
					className={styles.triggerSelect}
				>
					<option value="activate">Activate</option>
					<option value="automatic">Automatic</option>
					<option value="continuous">Continuous</option>
					<option value="payCost">Pay Cost</option>
				</select>

				{ability.trigger === "automatic" && (
					<select
						value={(ability as any).event || ""}
						onChange={(e) => onUpdate({ event: e.target.value })}
						className={styles.triggerSelect}
					>
						<option value="endTurn">endTurn</option>
						<option value="enter">enter</option>
						<option value="zoneChange">zoneChange</option>
					</select>
				)}
				<input
					value={ability.skillId || ""}
					onChange={(e) => onUpdate({ skillId: e.target.value })}
					placeholder="ability id(optional)"
				></input>
				<button onClick={onToggleExpand} className={styles.toggleButton}>
					{!isExpanded ? "▸" : "▾"}
				</button>

				<button onClick={onRemove} className={styles.removeButton}>
					✕
				</button>
			</div>
			<strong>Steps</strong>
			<div
				className={`${styles.abilityContent} ${!isExpanded ? styles.open : ""}`}
			>
				<StepsEditor
					value={ability.steps}
					onChange={(newSteps) => onUpdate({ steps: newSteps })}
				/>
			</div>
		</div>
	);
}
