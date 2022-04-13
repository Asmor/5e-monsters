import * as lib from "./lib.js";
import CONST from "./constants.js";

const encounter = {

    difficulty: "medium",
    monsters: [],

    get totalExp(){
        return this.monsters.reduce((acc, monster) => {
            return acc + monster.xp;
        }, 0);
    },

    getMultiplier(numMonsters){

        let multiplierCategory;
        const multipliers = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];

        if ( numMonsters <= 3 ) {
            multiplierCategory = Math.max(1, numMonsters);
        } else if ( numMonsters < 7 ) {
            multiplierCategory = 3;
        } else if ( numMonsters < 11 ) {
            multiplierCategory = 4;
        } else if ( numMonsters < 15 ) {
            multiplierCategory = 5;
        } else {
            multiplierCategory = 6;
        }

        if ( this.app.party.totalPlayers < 3 ) {
            multiplierCategory++;
        } else if ( this.app.party.totalPlayers > 5 ) {
            multiplierCategory--;
        }

        return multipliers[multiplierCategory];

    },

    get adjustedExp(){

        const multiplier = this.getMultiplier(this.monsters.length);

        return Math.floor(this.totalExp * multiplier);

    },

    get actualDifficulty(){

        let exp = this.adjustedExp;
        let levels = this.app.party.experience;

        if ( exp < ( levels.easy ) ) {
            return 'None';
        } else if ( exp < ( levels.medium ) ) {
            return "Easy";
        } else if ( exp < ( levels.hard ) ) {
            return "Medium";
        } else if ( exp < ( levels.deadly ) ) {
            return "Hard";
        }

        return "Deadly";
    },

    get threat(){

        const totalPlayers = this.app.party.totalPlayers;
        const experience = this.app.party.experience;
        let mediumExp = experience.medium;
        let singleMultiplier  = 1;
        let pairMultiplier    = 1.5;
        let groupMultiplier   = 2;
        let trivialMultiplier = 2.5;

        if ( totalPlayers < 3 ) {
            // For small groups, increase multiplier
            singleMultiplier  = 1.5;
            pairMultiplier    = 2;
            groupMultiplier   = 2.5;
            trivialMultiplier = 3;
        } else if ( totalPlayers > 5 ) {
            // For large groups, reduce multiplier
            singleMultiplier  = 0.5;
            pairMultiplier    = 1;
            groupMultiplier   = 1.5;
            trivialMultiplier = 2;
        }

        return {
            deadly: totalPlayers.deadly / singleMultiplier,
            hard: totalPlayers.hard / singleMultiplier,
            medium: mediumExp / singleMultiplier,
            easy: totalPlayers.easy / singleMultiplier,
            pair: mediumExp / ( 2 * pairMultiplier ),
            group: mediumExp / ( 4 * groupMultiplier ),
            trivial: mediumExp / ( 8 * trivialMultiplier ),
        };

    },

    generateRandom(){
        const totalExperienceTarget = this.app.party.experience[this.difficulty];

        let fudgeFactor = 1.1; // The algorithm is conservative in spending exp; so this tries to get it closer to the actual medium value
        let baseExpBudget = totalExperienceTarget * fudgeFactor;
        let encounterTemplate = this.getEncounterTemplate();
        let multiplier = this.getMultiplier(encounterTemplate.total) / encounterTemplate.multiplier;
        let totalAvailableXP = baseExpBudget / multiplier;

        for(const group of encounterTemplate.groups){

            let targetExp = (totalAvailableXP * group.ratio) / group.count;

            const monster = this.getBestMonster(targetExp)

        }
        this.app.$ref

    },

    getEncounterTemplate(){

        const templates = {
            "boss": {
                groups: [
                    { count: 1 }
                ]
            },
            "boss_minions": {
                groups: [
                    { count: 1, ratio: 0.8 },
                    { count: lib.random_int_between(4, 8), ratio: 0.2 }
                ],
                multiplier: 3
            }
            /*"duo": [],
            "trio": [],
            "pack": [],
            "horde": [],
            "random": []*/
        }

        const template = lib.clone(templates['boss_minions']);

        template.total = template.groups.reduce((acc, group) => acc + group.count, 0);

        template.overallRatio = template.groups.reduce((acc, group) => acc + (group.ratio || 1), 0);

        template.groups.forEach(group => {
            group.ratio = (group.ratio || 1) / template.overallRatio;
        });

        template.multiplier = template.multiplier || 1;

        return template;

    },

    filterMonsters(crString){
        return lib.shuffle_array(this.app.allMonsters.filter(monster => {
            return monster.cr.toString() === crString;
        }));
    },

    getBestMonster(targetExp){

        let monsterCr;
        for ( let i = 0; i < CONST.CR.LIST.length; i++ ) {
            const lowerBound = CONST.CR[CONST.CR.LIST[i]];
            const upperBound = CONST.CR[CONST.CR.LIST[i+1]];
            if (upperBound.exp > targetExp) {
                monsterCr = (targetExp - lowerBound.exp) < (upperBound.exp - targetExp) ? lowerBound : upperBound;
                break;
            }
        }

        const monsterList = this.filterMonsters(monsterCr.string, true);

        console.log(monsterList)

    }

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