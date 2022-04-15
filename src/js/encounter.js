import * as lib from "./lib.js";
import CONST from "./constants.js";

const encounter = {

    groups: [],

    get totalExp() {
        return this.groups.reduce((acc, group) => {
            return acc + (group.monster.cr.exp * group.count);
        }, 0);
    },

    get totalMonsters() {
        return this.groups.reduce((acc, group) => acc + group.count, 0);
    },

    get adjustedExp() {
        const multiplier = this.getMultiplier(this.totalMonsters);
        return Math.floor(this.totalExp * multiplier);
    },

    get actualDifficulty() {

        const exp = this.adjustedExp;
        const levels = this.app.party.experience;

        if (exp === 0){
            return "None";
        }else if (exp < (levels.easy)) {
            return 'Nuisance';
        } else if (exp < (levels.medium)) {
            return "Easy";
        } else if (exp < (levels.hard)) {
            return "Medium";
        } else if (exp < (levels.deadly)) {
            return "Hard";
        }

        return "Deadly";
    },

    get difficultyFeel() {
        const exp = this.adjustedExp;
        if(exp === 0) return "";

        const levels = Object.entries(this.app.party.experience);
        for(let i = 1; i < levels.length; i++){
            const [lowerKey, lowerValue] = levels[i-1];
            const [upperKey, upperValue] = levels[i];
            const ratio = lib.ratio(lowerValue, upperValue, exp);
            if(ratio >= 0.0 && ratio <= 1.0){
                if(upperKey === "daily"){
                    return ratio > 0.5 ? 'extremely deadly' : "really deadly";
                }
                if(ratio > 0.8){
                    return upperKey;
                }
                return lowerKey;
            }
        }
        return "really deadly";
    },

    get threat() {

        const totalPlayers = this.app.party.totalPlayers;
        const experience = this.app.party.experience;
        const mediumExp = experience.medium;
        let singleMultiplier = 1;
        let pairMultiplier = 1.5;
        let groupMultiplier = 2;
        let trivialMultiplier = 2.5;

        if (totalPlayers < 3) {
            // For small groups, increase multiplier
            singleMultiplier = 1.5;
            pairMultiplier = 2;
            groupMultiplier = 2.5;
            trivialMultiplier = 3;
        } else if (totalPlayers > 5) {
            // For large groups, reduce multiplier
            singleMultiplier = 0.5;
            pairMultiplier = 1;
            groupMultiplier = 1.5;
            trivialMultiplier = 2;
        }

        return {
            deadly: Math.floor(experience.deadly / singleMultiplier),
            hard: Math.floor(experience.hard / singleMultiplier),
            medium: Math.floor(mediumExp / singleMultiplier),
            easy: Math.floor(experience.easy / singleMultiplier),
            pair: Math.floor(mediumExp / (2 * pairMultiplier)),
            group: Math.floor(mediumExp / (4 * groupMultiplier)),
            trivial: Math.floor(mediumExp / (8 * trivialMultiplier)),
        };

    },

    generateRandom() {
        const totalExperienceTarget = this.app.party.experience[this.app.difficulty];
        let fudgeFactor = 1.1; // The algorithm is conservative in spending exp; so this tries to get it closer to the actual medium value
        let baseExpBudget = totalExperienceTarget * fudgeFactor;
        let encounterTemplate = this.getEncounterTemplate();
        let multiplier = this.getMultiplier(encounterTemplate.total) / encounterTemplate.multiplier;
        let totalAvailableXP = baseExpBudget / multiplier;

        let targetExp;
        const encounter = []
        for (const group of encounterTemplate.groups) {

            targetExp = encounterTemplate.subtractive ? (totalAvailableXP / encounterTemplate.groups.length) : (totalAvailableXP * group.ratio);

            targetExp /= group.count;

            const monster = this.getBestMonster(targetExp, encounter);
            if (!monster) {
                return false;
            }

            encounter.push({
                monster, count: group.count
            })

            if (encounterTemplate.subtractive) {
                targetExp -= group.count * monster.cr.exp;
            }
        }

        this.groups = encounter;

    },

    getBestMonster(targetExp, encounter) {

        let monsterCRIndex;
        for (let i = 0; i < CONST.CR.LIST.length; i++) {
            const lowerBound = CONST.CR[CONST.CR.LIST[i]];
            const upperBound = CONST.CR[CONST.CR.LIST[i + 1]];
            if (upperBound.exp > targetExp) {
                monsterCRIndex = (targetExp - lowerBound.exp) < (upperBound.exp - targetExp) ? i : i + 1;
                break;
            }
        }

        let monsterTargetCR = CONST.CR[CONST.CR.LIST[monsterCRIndex]];
        let monsterList = this.app.filterMonsters(monsterTargetCR.string, (monster) => {
            return !encounter.some(group => group.monster === monster);
        });

        let monsterCRNewIndex = monsterCRIndex;
        let down = true;
        while (!monsterList.length) {

            if (down) {
                monsterCRNewIndex--;
                if (monsterCRNewIndex === 0) {
                    monsterCRNewIndex = monsterCRIndex;
                    down = false;
                }
            } else {
                monsterCRNewIndex++;
                if (monsterCRNewIndex === CONST.CR.LIST.length - 1) {
                    return false;
                }
            }

            let monsterTargetCR = CONST.CR[CONST.CR.LIST[monsterCRNewIndex]];
            monsterList = this.app.filterMonsters(monsterTargetCR.string, (monster) => {
                return !encounter.some(group => group.monster === monster);
            });

        }

        return lib.randomArrayElement(monsterList);

    },

    getEncounterTemplate() {

        const templateString = "horde";

        let template = {
            "boss": {
                groups: [
                    { count: 1, ratio: 1.0 }
                ],
                multiplier: 1.5
            },
            "boss_minions": {
                groups: [
                    { count: 1, ratio: 0.8 },
                    { count: lib.randomIntBetween(this.app.party.totalPlayers, this.app.party.totalPlayers*2), ratio: 0.2 }
                ], multiplier: 3
            },
            "duo": {
                groups: [
                    { count: 1, ratio: 0.5 },
                    { count: 1, ratio: 0.5 }
                ]
            },
            "trio": {
                groups: [
                    { count: 1, ratio: 0.33 },
                    { count: 1, ratio: 0.33 },
                    { count: 1, ratio: 0.33 }
                ]
            },
            "horde": {
                groups: [
                    { count: lib.randomIntBetween(1, 3), ratio: 0.5 },
                    { count: lib.randomIntBetween(this.app.party.totalPlayers, this.app.party.totalPlayers*2), ratio: 0.2 },
                    { count: lib.randomIntBetween(this.app.party.totalPlayers, this.app.party.totalPlayers*2), ratio: 0.3 }
                ]
            },
            "random": [
                [1],
                [1, 1],
                [1, 2],
                [1, 5],
                [1, 1, 1],
                [1, 1, 2],
                [1, 2, 3],
                [2, 2],
                [2, 4],
                [8]
            ]
        }[templateString];

        if (templateString === "random") {
            template = lib.randomArrayElement(template);
            template = {
                subtractive: true, groups: template.map(num => {
                    return { count: num }
                })
            };
        }

        template.total = template.groups.reduce((acc, group) => acc + group.count, 0);

        if (templateString === "random") {
            template.overallRatio = template.groups.reduce((acc, group) => acc + (group.ratio || 1), 0);
            template.groups.forEach(group => {
                group.ratio = (group.ratio || 1) / template.overallRatio;
            });
        }

        template.multiplier = template.multiplier || 1;

        return template;

    },

    getMultiplier(numMonsters) {

        let multiplierCategory;
        const multipliers = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];

        if (numMonsters <= 3) {
            multiplierCategory = Math.max(1, numMonsters);
        } else if (numMonsters < 7) {
            multiplierCategory = 3;
        } else if (numMonsters < 11) {
            multiplierCategory = 4;
        } else if (numMonsters < 15) {
            multiplierCategory = 5;
        } else {
            multiplierCategory = 6;
        }

        if (this.app.party.totalPlayers < 3) {
            multiplierCategory++;
        } else if (this.app.party.totalPlayers > 5) {
            multiplierCategory--;
        }

        return multipliers[multiplierCategory];

    },

    getNewMonster(group) {
        const monsterList = this.app.filterMonsters(group.monster.cr.string, (monster) => {
            return !this.groups.some(group => group.monster === monster);
        });
        if (!monsterList.length) return;
        group.monster = lib.randomArrayElement(monsterList);
    }

}

export default encounter;

/*
		function getBestMonster(targetExp, filters) {

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