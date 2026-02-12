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

import SortableStepItem from "./SortableStepItem"; // auxiliar abajo
import styles from "../AbilitiesEditor/abilities.module.css";

type Step = {
	action: string;
	[key: string]: any; // campos dinámicos
};

type Props = {
	value: Step[];
	onChange: (steps: Step[]) => void;
};

export default function StepsEditor({ value, onChange }: Props) {
	const [expanded, setExpanded] = useState<Set<number>>(new Set());

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (active.id !== over?.id) {
			const oldIndex = value.findIndex((s) => s.id === active.id);
			const newIndex = value.findIndex((s) => s.id === over.id);
			onChange(arrayMove(value, oldIndex, newIndex));
		}
	};

	const toggleExpand = (index: number) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(index)) next.delete(index);
			else next.add(index);
			return next;
		});
	};

	const addStep = () => {
		const newStep: Step & { id: string } = {
			id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
			action: "",
		};

		onChange([...value, newStep]);
	};

	const updateStep = (index: number, updates: Step) => {
		onChange(
			value.map((step, i) =>
				i === index ? { id: step.id, ...updates } : step,
			),
		);
	};

	const removeStep = (index: number) => {
		onChange(value.filter((_, i) => i !== index));
	};

	return (
		<div className={styles.stepsContainer}>
			<DndContext
				id="stepsDnDContext"
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={value.map((s) => s.id)}
					strategy={verticalListSortingStrategy}
				>
					{value.map((step, index) => (
						<SortableStepItem
							key={step.id}
							id={step.id}
							index={index}
							step={step}
							isExpanded={expanded.has(index)}
							onToggleExpand={() => toggleExpand(index)}
							onUpdate={(updates) => {
								console.log(updates);
								return updateStep(index, updates);
							}}
							onRemove={() => removeStep(index)}
						/>
					))}
				</SortableContext>
			</DndContext>

			<button onClick={addStep} className={styles.addButton}>
				+ Add Step
			</button>
		</div>
	);
}
