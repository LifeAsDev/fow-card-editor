"use client";

import { useState } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Ability } from "@/src/types/types";
import StepsEditor from "@/src/components/StepsEditor/StepsEditor"; // lo haremos después
import SortableAbilityItem from "./SortableAbilityItem"; // componente auxiliar abajo

import styles from "./abilities.module.css";

type Props = {
	value: Ability[];
	onChange: (abilities: Ability[]) => void;
};

export default function AbilitiesEditor({ value = [], onChange }: Props) {
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: { active: any; over: any }) => {
		const { active, over } = event;
		if (active.id !== over.id) {
			const oldIndex = value.findIndex((ab) => ab.id === active.id);
			const newIndex = value.findIndex((ab) => ab.id === over.id);
			onChange(arrayMove(value, oldIndex, newIndex));
		}
	};

	const toggleExpand = (id: string) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const addAbility = () => {
		const newAbility: Ability = {
			id: `ability-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
			trigger: "automatic",
			event: "endTUrn",
			steps: [],
		};

		onChange([...value, newAbility]);
	};
	const updateAbility = (id: string, updates: Partial<Ability>) => {
		onChange(
			value.map((ability) => {
				if (ability.id !== id) return ability;

				// Creamos una copia explícita y preservamos el discriminante
				const updated = { ...ability, ...updates };

				// Si updates intenta cambiar el trigger, TypeScript lo detectará como error aquí
				// (o puedes forzar el tipo si estás seguro)
				return updated as Ability;
			}),
		);
	};

	const removeAbility = (id: string) => {
		onChange(value.filter((ab) => ab.id !== id));
	};

	return (
		<div className={styles.abilitiesContainer}>
			<DndContext
				id="abilitiesDnDContext"
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={value.map((ab) => ab.id)}
					strategy={verticalListSortingStrategy}
				>
					{value.map((ability) => (
						<SortableAbilityItem
							key={ability.id}
							id={ability.id}
							ability={ability}
							isExpanded={expanded.has(ability.id)}
							onToggleExpand={() => toggleExpand(ability.id)}
							onUpdate={(updates) => updateAbility(ability.id, updates)}
							onRemove={() => removeAbility(ability.id)}
						/>
					))}
				</SortableContext>
			</DndContext>

			<button onClick={addAbility} className={styles.addButton}>
				+ Add Ability
			</button>
		</div>
	);
}
