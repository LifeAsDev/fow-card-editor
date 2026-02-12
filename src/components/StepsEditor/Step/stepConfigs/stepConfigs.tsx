type FieldType =
	| "string"
	| "object"
	| "array"
	| "select"
	| "abilities"
	| "steps";

export interface FieldSchema {
	label: string;
	type: FieldType;
	options?: string[];
	fields?: Record<string, FieldSchema>;
}

export interface ActionSchema {
	[key: string]: FieldSchema;
}
export const actionConfigs: Record<string, ActionSchema> = {
	condition: {
		conditions: {
			label: "Conditions",
			type: "array",
			fields: {
				left: { label: "Left", type: "string" },
				op: {
					label: "Operator",
					type: "select",
					options: ["==", "!=", ">", "<"],
				},
				right: { label: "Right", type: "string" },
			},
		},
		value: { label: "Value", type: "string" },
	},

	addAbilities: {
		abilities: { label: "Abilities", type: "abilities" },
		target: { label: "Target", type: "string" },
	},

	addCost: {
		reduce: {
			label: "Reduce",
			type: "array",
			fields: {
				costType: {
					label: "Cost Type",
					type: "string",
				},
			},
		},
	},

	addCounter: {
		amount: { label: "Amount", type: "string" },
		counterType: { label: "Counter Type", type: "string" },
		target: { label: "Target", type: "string" },
	},

	adjustStats: {
		enable: { label: "Enable", type: "string" },
		atk: { label: "Attack", type: "string" },
		def: { label: "Defense", type: "string" },
		target: { label: "Target", type: "string" },
		toggleable: { label: "Toggleable", type: "string" },
	},

	applyContinuousKeyword: {
		enable: { label: "Enable", type: "string" },
		keyword: { label: "Keyword", type: "string" },
		source: { label: "Source", type: "string" },
		target: { label: "Target", type: "string" },
	},

	branch: {
		condition: {
			label: "Condition",
			type: "object",
			fields: {
				left: { label: "Left", type: "string" },
				op: {
					label: "Operator",
					type: "select",
					options: ["==", "!=", ">", "<"],
				},
				right: { label: "Right", type: "string" },
			},
		},
		steps: { label: "Steps", type: "steps" },
	},

	calculateTotalCost: {
		from: { label: "From", type: "string" },
		value: { label: "Value", type: "string" },
	},

	canPayCost: {
		cost: {
			label: "Cost",
			type: "array",
			fields: {
				costType: {
					label: "Cost Type",
					type: "string",
				},
			},
		},
		result: { label: "Result", type: "string" },
	},

	cancelAbility: {
		target: { label: "Target", type: "string" },
	},

	cardCount: {
		from: { label: "From", type: "string" },
		value: { label: "Value", type: "string" },
	},

	checkActivateCost: {
		conditions: {
			label: "Conditions",
			type: "array",
			fields: {
				left: { label: "Left", type: "string" },
				op: {
					label: "Operator",
					type: "select",
					options: ["==", "!=", ">", "<"],
				},
				right: { label: "Right", type: "string" },
			},
		},
	},

	checkConditionAndAbort: {
		conditions: {
			label: "Conditions",
			type: "array",
			fields: {
				left: { label: "Left", type: "string" },
				op: {
					label: "Operator",
					type: "select",
					options: ["==", "!=", ">", "<"],
				},
				right: { label: "Right", type: "string" },
			},
		},
	},

	chooseCard: {
		count: { label: "Count", type: "string" },
		excludeSelf: { label: "Exclude Self", type: "string" },
		flagRequirements: {
			label: "Flags",
			type: "array",
			fields: {
				key: { label: "key", type: "string" },
				min: { label: "min", type: "string" },
				max: { label: "max", type: "string" },
				mustExists: { label: "mustExists", type: "string" },
			},
		},
		from: { label: "From", type: "string" },
		name: { label: "Name", type: "string" },
		optional: { label: "Optional", type: "string" },
		owner: { label: "Owner", type: "string" },
		recovered: { label: "Recovered", type: "string" },
		state: { label: "State", type: "string" },
		subtype: { label: "Subtype", type: "string" },
		type: { label: "Type", type: "string" },
		att: { label: "Attribute", type: "string" },
		value: { label: "Value", type: "string" },
	},
	chooseCardFrom: {
		count: { label: "Count", type: "string" },
		excludeSelf: { label: "Exclude Self", type: "string" },
		flagRequirements: {
			label: "Flags",
			type: "array",
			fields: {
				key: { label: "key", type: "string" },
				min: { label: "min", type: "string" },
				max: { label: "max", type: "string" },
				mustExists: { label: "mustExists", type: "string" },
			},
		},
		from: { label: "From", type: "string" },
		name: { label: "Name", type: "string" },
		optional: { label: "Optional", type: "string" },
		owner: { label: "Owner", type: "string" },
		recovered: { label: "Recovered", type: "string" },
		state: { label: "State", type: "string" },
		subtype: { label: "Subtype", type: "string" },
		type: { label: "Type", type: "string" },
		att: { label: "Attribute", type: "string" },
		value: { label: "Value", type: "string" },
	},
	chooseChaseEffect: {
		count: { label: "count", type: "string" },
		effectValue: { label: "effectValue", type: "string" },
		owner: { label: "owner", type: "string" },
		sourceType: { label: "sourceType", type: "string" },
		type: { label: "type", type: "string" },
		value: { label: "value", type: "string" },
	},

	chooseOne: {
		options: {
			label: "Options",
			type: "array",
			fields: {
				key: { label: "option", type: "string" },
			},
		},
		result: { label: "Result", type: "string" },
	},
	chooseRemoveCounters: {
		count: { label: "Count", type: "string" },
		excludeSelf: { label: "Exclude Self", type: "string" },
		flagRequirements: {
			label: "Flags",
			type: "array",
			fields: {
				key: { label: "key", type: "string" },
				min: { label: "min", type: "string" },
				max: { label: "max", type: "string" },
				mustExists: { label: "mustExists", type: "string" },
			},
		},
		from: { label: "From", type: "string" },
		name: { label: "Name", type: "string" },
		optional: { label: "Optional", type: "string" },
		owner: { label: "Owner", type: "string" },
		recovered: { label: "Recovered", type: "string" },
		state: { label: "State", type: "string" },
		subtype: { label: "Subtype", type: "string" },
		type: { label: "Type", type: "string" },
		att: { label: "Attribute", type: "string" },
		value: { label: "Value", type: "string" },
	},
	chooseTwoPiles: {
		excludeSelf: { label: "Exclude Self", type: "string" },
		flagRequirements: {
			label: "Flags",
			type: "array",
			fields: {
				key: { label: "key", type: "string" },
				min: { label: "min", type: "string" },
				max: { label: "max", type: "string" },
				mustExists: { label: "mustExists", type: "string" },
			},
		},
		from: { label: "From", type: "string" },
		name: { label: "Name", type: "string" },
		optional: { label: "Optional", type: "string" },
		owner: { label: "Owner", type: "string" },
		recovered: { label: "Recovered", type: "string" },
		state: { label: "State", type: "string" },
		subtype: { label: "Subtype", type: "string" },
		type: { label: "Type", type: "string" },
		att: { label: "Attribute", type: "string" },
		value1: { label: "Value 1", type: "string" },
		value2: { label: "Value 2", type: "string" },
	},
	dealDividedDamage: {
		damage: { label: "Damage", type: "string" },
		owner: { label: "Owner", type: "string" },
		count: { label: "Count", type: "string" },
		excludeSelf: { label: "Exclude Self", type: "string" },
		flagRequirements: {
			label: "Flags",
			type: "array",
			fields: {
				key: { label: "key", type: "string" },
				min: { label: "min", type: "string" },
				max: { label: "max", type: "string" },
				mustExists: { label: "mustExists", type: "string" },
			},
		},
		from: { label: "From", type: "string" },
		name: { label: "Name", type: "string" },
		optional: { label: "Optional", type: "string" },
		recovered: { label: "Recovered", type: "string" },
		state: { label: "State", type: "string" },
		subtype: { label: "Subtype", type: "string" },
		att: { label: "Attribute", type: "string" },
		type: { label: "Type", type: "string" },
	},
	destroy: {
		target: { label: "Target", type: "string" },
		value: { label: "Value", type: "string" },
	},

	draw: {
		count: { label: "Count", type: "string" },
		deck: { label: "Deck", type: "string" },
		owner: { label: "Owner", type: "string" },
	},

	filterCards: {
		from: { label: "From", type: "string" },
		owner: { label: "Owner", type: "string" },
		count: { label: "Count", type: "string" },
		excludeSelf: { label: "Exclude Self", type: "string" },
		flagRequirements: {
			label: "Flags",
			type: "array",
			fields: {
				key: { label: "key", type: "string" },
				min: { label: "min", type: "string" },
				max: { label: "max", type: "string" },
				mustExists: { label: "mustExists", type: "string" },
			},
		},
		name: { label: "Name", type: "string" },
		optional: { label: "Optional", type: "string" },
		recovered: { label: "Recovered", type: "string" },
		state: { label: "State", type: "string" },
		subtype: { label: "Subtype", type: "string" },
		type: { label: "Type", type: "string" },
		att: { label: "Attribute", type: "string" },
		value: { label: "Value", type: "string" },
	},

	findDeckCard: {
		from: { label: "From", type: "string" },
		owner: { label: "Owner", type: "string" },
		count: { label: "Count", type: "string" },
		filters: {
			type: "object",
			label: "Filters",
			fields: {
				excludeSelf: { label: "Exclude Self", type: "string" },
				flagRequirements: {
					label: "Flags",
					type: "array",
					fields: {
						key: { label: "key", type: "string" },
						min: { label: "min", type: "string" },
						max: { label: "max", type: "string" },
						mustExists: { label: "mustExists", type: "string" },
					},
				},
				name: { label: "Name", type: "string" },
				optional: { label: "Optional", type: "string" },
				recovered: { label: "Recovered", type: "string" },
				state: { label: "State", type: "string" },
				subtype: { label: "Subtype", type: "string" },
				type: { label: "Type", type: "string" },
				att: { label: "Attribute", type: "string" },
			},
		},

		value: { label: "Value", type: "string" },
	},
	getHighestCounterCount: {
		target: { label: "Target", type: "string" },
		type: { label: "Type", type: "string" },
		value: { label: "Value", type: "string" },
	},
	getTotalCounterCount: {
		target: { label: "Target", type: "string" },
		type: { label: "Type", type: "string" },
		value: { label: "Value", type: "string" },
	},
	log: {
		value: { label: "Value", type: "string" },
	},

	math: {
		a: { label: "A", type: "string" },
		b: { label: "B", type: "string" },
		op: {
			label: "Operator",
			type: "select",
			options: ["+", "-", "*", "/"],
		},
		result: { label: "Result", type: "string" },
	},

	modifyLP: {
		amount: { label: "Amount", type: "string" },
		player: { label: "Player", type: "string" },
	},

	oncePerTurn: {
		key: { label: "Key", type: "string" },
		result: { label: "Result", type: "string" },
	},

	payCost: {
		cost: {
			label: "Cost",
			type: "array",
			fields: {
				costType: {
					label: "Cost Type",
					type: "string",
				},
			},
		},
		optional: { label: "Optional", type: "string" },
		result: { label: "Result", type: "string" },
		type: { label: "Type", type: "string" },
	},
	payCustomCost: {
		cost: { label: "Cost", type: "array" },

		type: { label: "Type", type: "string" },
	},
	removeAbilities: {
		target: {
			label: "Target",
			type: "string",
		},
		targetId: {
			label: "Target Ability ID",
			type: "string",
		},
	},
	peekDeckCards: {
		count: { label: "Count", type: "array" },
		from: { label: "From", type: "string" },
		owner: { label: "Owner", type: "string" },
		value: { label: "Value", type: "string" },
	},
	playCard: {
		from: { label: "From", type: "string" },
	},
	playToken: {
		owner: { label: "Owner", type: "string" },
		dataCard: {
			label: "Card Data",
			type: "object",
			fields: {
				name: { label: "Name", type: "string" },
				owner: { label: "Owner", type: "string" },
				type: { label: "Type", type: "string" },
				subtype: { label: "Subtype", type: "string" },
				atk: { label: "Attack", type: "string" },
				def: { label: "Defense", type: "string" },
				att: { label: "Attribute", type: "string" },
				cost: {
					label: "Cost",
					type: "array",
					fields: {
						costType: { label: "Cost Type", type: "string" },
					},
				},
			},
		},
	},
	recover: {
		target: { label: "Target", type: "string" },
	},

	reduceCost: {
		reduce: {
			label: "Reduce",
			type: "array",
			fields: {
				costType: {
					label: "Cost Type",
					type: "string",
				},
			},
		},
	},
	rest: {
		target: { label: "Target", type: "string" },
	},

	requireChaseEffect: {
		owner: { label: "owner", type: "string" },
		sourceType: { label: "sourceType", type: "string" },
		type: { label: "type", type: "string" },
		value: { label: "value", type: "string" },
	},
	requireEvent: {
		from: { label: "from", type: "string" },
		sourtoceType: { label: "to", type: "string" },
		value: { label: "value", type: "string" },
	},
	requireEventSource: {
		value: { label: "value", type: "string" },
	},
	requireMyTurn: {
		value: { label: "value", type: "string" },
	},
	sendToDeck: {
		from: { label: "from", type: "string" },
		owner: { label: "owner", type: "string" },
		target: { label: "target", type: "string" },
		top: { label: "top", type: "string" },
	},
	setKeyword: {
		enable: { label: "enable", type: "string" },
		keyword: { label: "keyword", type: "string" },
		target: { label: "target", type: "string" },
		untilEndOfTurn: { label: "untilEndOfTurn", type: "string" },
		value: { label: "value", type: "string" },
	},
	shuffle: {
		owner: { label: "Owner", type: "string" },
		target: { label: "Target", type: "string" },
	},

	toOwnerHand: {
		target: { label: "Target", type: "string" },
	},

	totalAtk: {
		target: { label: "Target", type: "string" },
		value: { label: "Value", type: "string" },
	},
};
