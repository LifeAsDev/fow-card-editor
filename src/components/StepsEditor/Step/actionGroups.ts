export const actionGroups: Record<string, string[]> = {
	Misc: ["dealDividedDamage", "removeAbilities"],
	Conditions: [
		"condition",
		"checkActivateCost",
		"checkConditionAndAbort",
		"requireEventSource",
		"requireEvent",
		"requireMyTurn",
	],

	"Control / Choose": [
		"addAbilities",
		"chooseCard",
		"chooseCardFrom",
		"chooseOne",
		"chooseTwoGroups",
		"chooseTwoPiles",
		"branch",
	],

	"Stats / Counters": [
		"adjustStats",
		"addCounter",
		"applyContinuousKeyword",
		"setKeyword",
	],

	Costs: [
		"addCost",
		"reduceCost",
		"payCost",
		"payCustomCost",
		"canPayCost",
		"calculateTotalCost",
	],

	"Move / Game": [
		"draw",
		"modifyLP",
		"destroy",
		"recover",
		"rest",
		"playCard",
		"playToken",
		"sendToDeck",
		"toOwnerHand",
		"shuffle",
	],

	Utils: ["log", "math", "oncePerTurn", "cardCount", "totalAtk"],
};
