const encounter = {

    difficulty: "medium",
    monsters: [],

    get totalExp(){
        return this.monsters.reduce((acc, monster) => {
            return acc + monster.xp;
        }, 0);
    },

    get adjustedExp(){

        let multiplierCategory;
        const multipliers = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5];

        if ( this.monsters.length < 3 ) {
            multiplierCategory = this.monsters.length;
        } else if ( this.monsters.length < 7 ) {
            multiplierCategory = 3;
        } else if ( this.monsters.length < 11 ) {
            multiplierCategory = 4;
        } else if ( this.monsters.length < 15 ) {
            multiplierCategory = 5;
        } else {
            multiplierCategory = 6;
        }

        if ( this.app.party.totalPlayers < 3 ) {
            multiplierCategory++;
        } else if ( this.app.party.totalPlayers > 5 ) {
            multiplierCategory--;
        }

        return multipliers[Math.max(0, multiplierCategory)];

    },

    get actualDifficulty(){

        let exp = this.adjustedExp;
        let levels = this.app.party.experience;

        if ( exp === 0 ) {
            return 'None';
        }

        if ( exp < ( levels.easy ) ) {
            return '';
        } else if ( exp < ( levels.medium ) ) {
            return "Easy";
        } else if ( exp < ( levels.hard ) ) {
            return "Medium";
        } else if ( exp < ( levels.deadly ) ) {
            return "Hard";
        }

        return "Deadly";
    },

    generateRandom(){
        const totalExperienceTarget = this.party.experience[this.difficulty];
        console.log(totalExperienceTarget)
    },

}

export default encounter;

/*

(function() {
	"use strict";

	angular.module("app")
		.factory("randomEncounter", RandomEncounterService);

	RandomEncounterService.$inject = ["monsterFactory", "misc", "shuffle", "metaInfo", "monsters"];

	function RandomEncounterService(monsterLib, miscLib, shuffle, metaInfo, monsters) {
		var randomEncounter = {
			//
			//	getRandomEncounter
			//		playerCount: Count of total number of players in party
			//		targetTotalExp: The experience target value. Takes into account player count, player level, and target difficulty already.
			//		filters: Any filters that should be applied when making the encounter
			//
			getRandomEncounter: function (playerCount, targetTotalExp, filters, maxMonsters) {
				var fudgeFactor = 1.1, // The algorithm is conservative in spending exp, so this tries to get it closer to the actual medium value
					baseExpBudget = targetTotalExp * fudgeFactor,
					encounterTemplate = getEncounterTemplate(maxMonsters),
					multiplier = miscLib.getMultiplier(playerCount, encounterTemplate.total),
					availableExp = baseExpBudget / multiplier,
					monster,
					monsterGroups = [],
					currentGroup, targetExp;

				while ( encounterTemplate.groups[0] ) {
					// Exp should be shared as equally as possible between groups
					targetExp = availableExp / encounterTemplate.groups.length;
					currentGroup = encounterTemplate.groups.shift();

					// We need to find a monster who, in the correct number, is close to the target exp
					targetExp /= currentGroup;

					monster = getBestMonster(targetExp, filters);

					monsterGroups.push({
						monster: monster,
						qty: currentGroup,
					});

					// Finally, subtract the actual exp value
					availableExp -= currentGroup * monster.cr.exp;
				}

				return monsterGroups;
			},
			getShuffledMonsterList: function (crString) {
				var list = monsters.byCr[crString].slice(0);

				return shuffle(list);
			},
		};

		return randomEncounter;

		function getEncounterTemplate(maxMonsters) {
			var templates = [
					[ 1 ],
					[ 1, 1 ],
					[ 1, 2 ],
					[ 1, 5 ],
					[ 1, 1, 1 ],
					[ 1, 1, 2 ],
					[ 1, 2, 3 ],
					[ 2, 2 ],
					[ 2, 4 ],
					[ 8 ],
				];
			if (maxMonsters) {
				templates = templates.filter(function(t) {
					let sum = t.reduce(function (a, b) { return a+b; });
					return sum <= maxMonsters;
				});
			}
			var groups = JSON.parse(JSON.stringify(templates[Math.floor(Math.random() * templates.length)])),
				total = groups.reduce(function (a, b) { return a+b; });

			// Silly hack to clone object
			return {
				total: total,
				groups: groups,
			};
		}

		function getBestMonster(targetExp, filters) {
			var bestBelow = 0,
				bestAbove,
				crIndex,
				currentIndex,
				step = -1,
				monsterList,
				i;

			for ( i = 1; i < metaInfo.crList.length; i++ ) {
				if ( metaInfo.crList[i].exp < targetExp ) {
					bestBelow = i;
				} else {
					bestAbove = i;
					break;
				}
			}

			if ( (targetExp - metaInfo.crList[bestBelow].exp) < (metaInfo.crList[bestAbove].exp - targetExp) ) {
				crIndex = bestBelow;
			} else {
				crIndex = bestAbove;
			}

			currentIndex = crIndex;

			monsterList = randomEncounter.getShuffledMonsterList(metaInfo.crList[crIndex].string);

			while ( true ) {
				if ( monsterLib.checkMonster(monsterList[0], filters, { skipCrCheck: true, nonUnique: true }) ) {
					return monsterList[0];
				} else {
					monsterList.shift();
				}

				// If we run through all the monsters from this level, check a different level
				if ( monsterList.length === 0 ) {
					// there were no monsters found lower than target exp, so we have to start checking higher
					if ( currentIndex === 0 ) {
						// Reset currentIndex
						currentIndex = crIndex;
						// Start looking up instead of down
						step = 1;
					}

					currentIndex += step;
					monsterList = randomEncounter.getShuffledMonsterList(metaInfo.crList[currentIndex].string);
				}
			}
		}
	}
})();




 */