import * as lib from "./lib.js";
import CONST from "./constants.js";

const encounter = {

    difficulty: "medium",
    monsters: [],

    get totalExp(){
        return this.monsters.reduce((acc, monster) => {
            return acc + monster.exp;
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

        const encounter = []
        for(const group of encounterTemplate.groups){
            let targetExp = (totalAvailableXP * group.ratio) / group.count;
            const monster = this.getBestMonster(targetExp);
            if(!monster){
                return false;
            }
            encounter.push({
                ...monster,
                exp: CONST.CR[monster.cr].exp,
                count: group.count
            })
        }

        console.log(encounter.map(group => `${group.count} ${group.name}`).join(", and "))

        this.monsters = encounter;

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

    getBestMonster(targetExp){

        let monsterCRIndex;
        for ( let i = 0; i < CONST.CR.LIST.length; i++ ) {
            const lowerBound = CONST.CR[CONST.CR.LIST[i]];
            const upperBound = CONST.CR[CONST.CR.LIST[i+1]];
            if (upperBound.exp > targetExp) {
                monsterCRIndex = (targetExp - lowerBound.exp) < (upperBound.exp - targetExp) ? i : i+1;
                break;
            }
        }

        let monsterTargetCR = CONST.CR[CONST.CR.LIST[monsterCRIndex]];
        let monsterList = this.app.filterMonsters(monsterTargetCR.string, true);

        let monsterCRNewIndex = monsterCRIndex;
        let down = true;
        while(!monsterList.length){

            if(down){
                monsterCRNewIndex--;
                if(monsterCRNewIndex === 0){
                    monsterCRNewIndex = monsterCRIndex;
                    down = false;
                }
            }else{
                monsterCRNewIndex++;
                if(monsterCRNewIndex === CONST.CR.LIST.length-1){
                    return false;
                }
            }

            let monsterTargetCR = CONST.CR[CONST.CR.LIST[monsterCRNewIndex]];
            monsterList = this.app.filterMonsters(monsterTargetCR.string, true);

        }

        return lib.clone(lib.shuffle_array(monsterList)[0]);

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