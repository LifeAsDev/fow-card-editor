import { AbilityStep } from "@/src/types/types";
const Operators = {
	">": (a: number, b: number) => a > b,
	">=": (a: number, b: number) => a >= b,
	"<": (a: number, b: number) => a < b,
	"<=": (a: number, b: number) => a <= b,
	"==": (a: any, b: any) => a == b,
	"===": (a: any, b: any) => a === b,
	"!=": (a: any, b: any) => a != b,
	"+": (a: any, b: any) => a + b,
	"-": (a: number, b: number) => a - b,
	"*": (a: number, b: number) => a * b,
	"/": (a: number, b: number) => a / b,
};
type Operator = keyof typeof Operators;
type Resolvable<T = number> = T | string;
interface Condition {
	left: Resolvable;
	op: Operator;
	right: Resolvable;
}
interface BaseStep {
	action: string;
	isCost?: 1;
	who?: 0 | 1; // relativo
}
interface MathStep extends BaseStep {
	action: "math";
	op: Operator;
	a: Resolvable;
	b: Resolvable;
	result: string;
}
interface ConditionStep extends BaseStep {
	action: "condition";
	value?: string;
	conditions: Condition[];
}

interface AddCounterStep extends BaseStep {
	action: "addCounter";
	target: string;
	counterType?: string;
	amount: Resolvable;
}
interface SimpleTargetStep extends BaseStep {
	target: string;
}

interface RestStep extends SimpleTargetStep {
	action: "rest";
}

interface RecoverStep extends SimpleTargetStep {
	action: "recover";
}
interface InputStep extends BaseStep {
	value?: string;
	optional?: 0 | 1;
}
interface ChooseCardStep extends InputStep {
	action: "chooseCard";
	from?: string;
	count?: Resolvable<number>;
	type?: string | string[];
	subtype?: string | string[];
	owner?: 0 | 1;
	state?: string;
	name?: string | string[];
	att?: string | string[];
	excludeSelf?: 1;
	flagRequirements?: any[];
}
interface DealDividedDamageStep extends InputStep {
	action: "dealDividedDamage";
	from?: string;
	amount: Resolvable<number>;
	type?: string;
	subtype?: string;
	owner?: 0 | 1;
	target: string[];
}

interface BranchStep extends BaseStep {
	action: "branch";
	conditions: Condition[];
	steps: AbilityStep[];
}

interface RequireChaseEffectStep extends BaseStep {
	action: "requireChaseEffect";
	value: string;
	type: string;
	sourceType?: string;
	owner?: 0 | 1;
}
interface ChooseChaseEffectStep extends BaseStep {
	action: "chooseChaseEffect";
	effectValue: string;
	value: string;
	type: string;
	sourceType?: string;
	owner?: 0 | 1;
	count?: Resolvable<number>;
}
interface CancelAbilityStep extends BaseStep {
	action: "cancelAbility";
	target?: string;
}

interface RequireEventSourceStep extends BaseStep {
	action: "requireEventSource";
	source?: "self" | "me";
	value?: string;
}

interface RequireEventStep extends BaseStep {
	action: "requireEvent";
	from?: string;
	to?: string;
	value?: string;
}

interface GetTotalCounterCountStep extends BaseStep {
	action: "getTotalCounterCount";
	target: string;
	type?: string;
	value?: string;
}

interface TotalAtkStep extends BaseStep {
	action: "totalAtk";
	target: string;
	value?: string;
}

interface SetKeywordStep extends BaseStep {
	action: "setKeyword";
	keyword: string;
	target: string;
	value?: Resolvable;
	enable?: Resolvable;
	untilEndOfTurn?: 0 | 1;
}

interface AdjustStatsStep extends BaseStep {
	action: "adjustStats";
	target: string;
	stats: Resolvable[];
	enable?: Resolvable;
	toggleable?: 0 | 1;
}

interface FilterCardsStep extends BaseStep {
	action: "filterCards";
	from?: string;
	value: string;
	type?: string | string[];
	subtype?: string | string[];
	owner?: 0 | 1;
	state?: string;
	name?: string | string[];
	produce?: string;
	flagRequirements?: any[];
	att?: string | string[];
	count?: number;
	excludeSelf?: 1;
}

interface CalculateTotalCostStep extends BaseStep {
	action: "calculateTotalCost";
	from: string;
	value: string;
}

interface SendToDeckStep extends BaseStep {
	action: "sendToDeck";
	target: string;
	from: string;
	owner?: 0 | 1;
	top?: 0 | 1;
}

interface ApplyContinuousKeywordStep extends BaseStep {
	action: "applyContinuousKeyword";
	keyword: string;
	target: string;
	source?: string;
	enable?: Resolvable;
}

interface GetHighestCounterCountStep extends BaseStep {
	action: "getHighestCounterCount";
	target: string;
	type?: string;
	value?: string;
}

interface CheckActivateCostStep extends BaseStep {
	action: "checkActivateCost";
	conditions: Condition[];
}

interface CheckConditionAndAbortStep extends BaseStep {
	action: "checkConditionAndAbort";
	conditions: Condition[];
}

interface CanPayCostStep extends BaseStep {
	action: "canPayCost";
	type?: string;
	cost?: string[];
	result: string;
}

interface PayCostStep extends BaseStep {
	action: "payCost";
	cost?: string[];
	type?: string;
	result?: string;
	optional?: 0 | 1;
}

interface ChooseOneStep extends BaseStep {
	action: "chooseOne";
	options: string[];
	result?: string;
}

interface ReduceCostStep extends BaseStep {
	action: "reduceCost";
	reduce?: string[];
}

interface AddCostStep extends BaseStep {
	action: "addCost";
	reduce?: string[];
}

interface PayCustomCostStep extends BaseStep {
	action: "payCustomCost";
	value?: string;
	type?: string;
}

interface DrawStep extends BaseStep {
	action: "draw";
	count?: Resolvable<number>;
	deck?: string;
	owner?: 0 | 1;
}

interface DestroyStep extends BaseStep {
	action: "destroy";
	target: string;
	value?: string;
}

interface FindDeckCardStep extends BaseStep {
	action: "findDeckCard";
	from: string;
	value: string;
	count?: number;
	owner?: 0 | 1;
	filters?: any;
}

interface PeekDeckCardsStep extends BaseStep {
	action: "peekDeckCards";
	from: string;
	value: string;
	count?: Resolvable<number>;
	owner?: 0 | 1;
}

interface ToOwnerHandStep extends BaseStep {
	action: "toOwnerHand";
	target: string;
}

interface SendStepStep extends BaseStep {
	action: "sendStep";
}

interface PlayCardStep extends BaseStep {
	action: "playCard";
	target: string;
	from?: string;
	owner?: 0 | 1;
}

interface PlayTokenStep extends BaseStep {
	action: "playToken";
	dataCard: any;
	owner?: 0 | 1;
}

interface OncePerTurnStep extends BaseStep {
	action: "oncePerTurn";
	key?: string;
	result: string;
}

interface LogStep extends BaseStep {
	action: "log";
	value: string;
}

interface ShuffleStep extends BaseStep {
	action: "shuffle";
	target: string;
	owner?: 0 | 1;
}

interface PushToEndStep extends BaseStep {
	action: "pushToEnd";
	target: string;
	steps: AbilityStep[];
}

interface CardCountStep extends BaseStep {
	action: "cardCount";
	from: string;
	value?: string;
}

interface AddAbilitiesStep extends BaseStep {
	action: "addAbilities";
	target: string;
	abilities: any[];
}

interface RemoveAbilitiesStep extends BaseStep {
	action: "removeAbilities";
	target: string;
	id: string;
}

interface ModifyLPStep extends BaseStep {
	action: "modifyLP";
	amount: Resolvable<number>;
	player?: 0 | 1;
}

interface RequireMyTurnStep extends BaseStep {
	action: "requireMyTurn";
	value?: string;
}

export type {
	Condition,
	MathStep,
	ConditionStep,
	AddCounterStep,
	RestStep,
	RecoverStep,
	ChooseCardStep,
	DealDividedDamageStep,
	BranchStep,
	RequireChaseEffectStep,
	ChooseChaseEffectStep,
	CancelAbilityStep,
	RequireEventSourceStep,
	RequireEventStep,
	GetTotalCounterCountStep,
	TotalAtkStep,
	SetKeywordStep,
	AdjustStatsStep,
	FilterCardsStep,
	CalculateTotalCostStep,
	SendToDeckStep,
	ApplyContinuousKeywordStep,
	GetHighestCounterCountStep,
	CheckActivateCostStep,
	CheckConditionAndAbortStep,
	CanPayCostStep,
	PayCostStep,
	ChooseOneStep,
	ReduceCostStep,
	AddCostStep,
	PayCustomCostStep,
	DrawStep,
	DestroyStep,
	FindDeckCardStep,
	PeekDeckCardsStep,
	ToOwnerHandStep,
	SendStepStep,
	PlayCardStep,
	PlayTokenStep,
	OncePerTurnStep,
	LogStep,
	ShuffleStep,
	PushToEndStep,
	CardCountStep,
	AddAbilitiesStep,
	RemoveAbilitiesStep,
	ModifyLPStep,
	RequireMyTurnStep,
};
export { Operators };
