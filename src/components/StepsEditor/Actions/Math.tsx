import styles from "../steps.module.css";
import { MathStep } from "@/src/types/actionsTypes";
import { Operators } from "@/src/types/actionsTypes";
export default function MathStepFields({
	step,
	onChange,
}: {
	step: MathStep;
	onChange: (s: MathStep) => void;
}) {
	const update = (patch: Partial<MathStep>) => onChange({ ...step, ...patch });

	return (
		<>
			<label>
				Operator:
				<select
					value={step.op}
					onChange={(e) => update({ op: e.target.value as any })}
				>
					{Object.keys(Operators).map((op) => (
						<option key={op} value={op}>
							{op}
						</option>
					))}
				</select>
			</label>
			<label>
				Operand A:
				<input value={step.a} onChange={(e) => update({ a: e.target.value })} />
			</label>
			<label>
				Operand B:
				<input value={step.b} onChange={(e) => update({ b: e.target.value })} />
			</label>
			<label>
				Result Variable:
				<input
					placeholder="result variable"
					value={step.result}
					onChange={(e) => update({ result: e.target.value })}
				/>
			</label>
		</>
	);
}
