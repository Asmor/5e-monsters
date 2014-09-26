/* global crList */
/* global getMultiplier */
/* exported generateRandomEncounter */
"use strict";

function generateRandomEncounter(playerCount, partyLevel) {
	var fudgeFactor = 1.1, // The algorithm is conservative in spending exp, so this tries to get it closer to the actual medium value
		baseExpBudget = playerCount * partyLevel.medium * fudgeFactor,
		encounterTemplate = getEncounterTemplate(),
		multiplier = getMultiplier(playerCount, encounterTemplate.total),
		availableExp = baseExpBudget / multiplier,
		monster,
		monsters = [],
		currentGroup, targetExp;

	while ( encounterTemplate.groups[0] ) {
		// Exp should be shared as equally as possible between groups
		targetExp = availableExp / encounterTemplate.groups.length;
		currentGroup = encounterTemplate.groups.shift();

		// We need to find a monster who, in the correct number, is close to the target exp
		targetExp /= currentGroup;

		monster = getBestMonster(targetExp);

		monsters.push({
			monster: monster,
			qty: currentGroup,
		});

		// Finally, subtract the actual exp value
		availableExp -= currentGroup * monster.cr.exp;
	}

	return monsters;
}

function getEncounterTemplate() {
	var templates = [
			[ 1 ],
			[ 1, 2 ],
			[ 1, 5 ],
			[ 1, 1, 1 ],
			[ 1, 1, 2 ],
			[ 1, 2, 3 ],
			[ 2, 2 ],
			[ 2, 4 ],
			[ 8 ],
		],
		groups = JSON.parse(JSON.stringify(templates[Math.floor(Math.random() * templates.length)])),
		total = groups.reduce(function (a, b) { return a+b; });

	// Silly hack to clone object
	return {
		total: total,
		groups: groups,
	};
}

function getBestMonster(targetExp) {
	var bestBelow = crList[0],
		bestAbove,
		cr,
		i;

	for ( i = 1; i < crList.length; i++ ) {
		if ( crList[i].exp < targetExp ) {
			bestBelow = crList[i];
		} else {
			bestAbove = crList[i];
			break;
		}
	}

	if ( (targetExp - bestBelow.exp) < (bestAbove.exp - targetExp) ) {
		cr = bestBelow;
	} else {
		cr = bestAbove;
	}

	return cr.monsters[Math.floor(Math.random() * cr.monsters.length)];
}
