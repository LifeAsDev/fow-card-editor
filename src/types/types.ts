import {
	AddCounterStep,
	BranchStep,
	ChooseCardStep,
	ConditionStep,
	DealDividedDamageStep,
	MathStep,
	RecoverStep,
	RestStep,
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
} from "@/src/types/actionsTypes";

export type AbilityTrigger =
	| "activate"
	| "automatic"
	| "continuous"
	| "payCost";

export type AbilityStep =
	| MathStep
	| ConditionStep
	| AddCounterStep
	| RestStep
	| RecoverStep
	| ChooseCardStep
	| DealDividedDamageStep
	| BranchStep
	| RequireChaseEffectStep
	| ChooseChaseEffectStep
	| CancelAbilityStep
	| RequireEventSourceStep
	| RequireEventStep
	| GetTotalCounterCountStep
	| TotalAtkStep
	| SetKeywordStep
	| AdjustStatsStep
	| FilterCardsStep
	| CalculateTotalCostStep
	| SendToDeckStep
	| ApplyContinuousKeywordStep
	| GetHighestCounterCountStep
	| CheckActivateCostStep
	| CheckConditionAndAbortStep
	| CanPayCostStep
	| PayCostStep
	| ChooseOneStep
	| ReduceCostStep
	| AddCostStep
	| PayCustomCostStep
	| DrawStep
	| DestroyStep
	| FindDeckCardStep
	| PeekDeckCardsStep
	| ToOwnerHandStep
	| SendStepStep
	| PlayCardStep
	| PlayTokenStep
	| OncePerTurnStep
	| LogStep
	| ShuffleStep
	| PushToEndStep
	| CardCountStep
	| AddAbilitiesStep
	| RemoveAbilitiesStep
	| ModifyLPStep
	| RequireMyTurnStep;

export interface Step {
	action: string;
	[key: string]: any; // los campos dinámicos
}

interface BaseAbility {
	id: string;
	trigger: AbilityTrigger;
	steps: Step[];
	skillId?: string;
}

interface ActivateAbility extends BaseAbility {
	trigger: "activate";
}

interface AutomaticAbility extends BaseAbility {
	trigger: "automatic";
	event: string;
}

interface ContinuousAbility extends BaseAbility {
	trigger: "continuous";
}
interface PayCostAbility extends BaseAbility {
	trigger: "payCost";
}
export type Ability =
	| ActivateAbility
	| AutomaticAbility
	| ContinuousAbility
	| PayCostAbility;
