(function () {
	"use strict";

	angular.module("app")
		.factory("encounter", EncounterService);

	EncounterService.$inject = ['$rootScope', 'randomEncounter', 'store', 'monsters', 'players', 'misc', 'playerLevels', 'partyInfo'];

	function EncounterService($rootScope, randomEncounter, store, monsters, players, misc, playerLevels, partyInfo) {
		var encounter = {
				groups: {},
				reference: null,

				// Methods
				add: add,
				generateRandom: generateRandom,
				initialize: initialize,
				randomize: randomize,
				remove: remove,
				reset: reset,
				thaw: thaw,
				freeze: freeze,

				// Properties
				get adjustedExp() {			
					var qty = encounter.qty,
					exp = encounter.exp,
					multiplier = misc.getMultiplier(partyInfo.totalPlayerCount, qty);

					if (!_.isNumber(exp)) return 0;

					return Math.floor(exp * multiplier);
				},

				get difficulty() {
					var exp = encounter.adjustedExp,
						levels = partyInfo.totalPartyExpLevels;

					if ( exp === 0 ) {
						return false;
					}

					if ( exp < ( levels.easy ) ) {
						return '';
					} else if ( exp < ( levels.medium ) ) {
						return "Easy";
					} else if ( exp < ( levels.hard ) ) {
						return "Medium";
					} else if ( exp < ( levels.deadly ) ) {
						return "Hard";
					} else {
						return "Deadly";
					}
				},

				get exp() {
					if (_.isEmpty(encounter.groups)) return undefined;

					var exp = 0;

					_.forEach(encounter.groups, function(group) {
						exp += (group.monster.cr.exp * group.qty);
					});

					return exp;
				},

				get qty() {
					var qty = 0;

					_.forEach(encounter.groups, function(group) {
						qty += group.qty;
					});

					return qty;
				},

				get threat() {
					var count = partyInfo.totalPlayerCount,
						levels = partyInfo.totalPartyExpLevels,
						mediumExp = levels.medium,
						singleMultiplier  = 1,
						pairMultiplier    = 1.5,
						groupMultiplier   = 2,
						trivialMultiplier = 2.5;
					
					if ( count < 3 ) {
						// For small groups, increase multiplier
						singleMultiplier  = 1.5;
						pairMultiplier    = 2;
						groupMultiplier   = 2.5;
						trivialMultiplier = 3;
					} else if ( count > 5 ) {
						// For large groups, reduce multiplier
						singleMultiplier  = 0.5;
						pairMultiplier    = 1;
						groupMultiplier   = 1.5;
						trivialMultiplier = 2;
					}

					return {
						deadly : levels.deadly / singleMultiplier,
						hard   : levels.hard / singleMultiplier,
						medium : mediumExp / singleMultiplier,
						easy   : levels.easy / singleMultiplier,
						pair   : mediumExp / ( 2 * pairMultiplier ),
						group  : mediumExp / ( 4 * groupMultiplier ),
						trivial: mediumExp / ( 8 * trivialMultiplier ),
					};
				}
		};

		return encounter;
		
		function initialize() {
			thaw();
		}

		function add(monster, qty) {
			if ( typeof qty === "undefined" ) {
				qty = 1;
			}

			encounter.groups[monster.id] = encounter.groups[monster.id] || {
				qty: 0,
				monster: monster,
			};

			encounter.groups[monster.id].qty += qty;

			encounter.reference = null;
		}

		function generateRandom(filters, targetDifficulty, maxMonsters) {
			targetDifficulty = targetDifficulty || 'medium';
			var totalTargetExp = partyInfo.totalPartyExpLevels[targetDifficulty];
			var monsters = randomEncounter.getRandomEncounter(partyInfo.totalPlayerCount, totalTargetExp, filters, maxMonsters),
				i;

			encounter.reset();

			for ( i = 0; i < monsters.length; i++ ) {
				encounter.add( monsters[i].monster, monsters[i].qty );
			}
		}

		function randomize(monster, filters) {
			var monsterList = randomEncounter.getShuffledMonsterList(monster.cr.string),
				qty = encounter.groups[monster.id].qty;

			while ( monsterList.length ) {
				// Make sure we don't roll a monster we already have
				if ( encounter.groups[monsterList[0].name] ) {
					monsterList.shift();
					continue;
				}

				if ( monsters.check( monsterList[0], filters, { skipCrCheck: true } ) ) {
					encounter.remove(monster, true);
					encounter.add( monsterList[0], qty );
					return;					
				} else {
					monsterList.shift();
				}
			}
		}

		function remove(monster, removeAll) {
			encounter.groups[monster.id].qty--;

			if ( encounter.groups[monster.id].qty === 0 ) {
				delete encounter.groups[monster.id];
			} else if ( removeAll ) {
				// Removing all is implemented by recurively calling this function until the
				// qty is 0
				encounter.remove(monster, true);
			}

			encounter.reference = null;
		}

		function reset(storedEncounter) {
			encounter.reference = null;
			encounter.groups = {};

			if (storedEncounter) {
				encounter.type = storedEncounter.type || 'encounter';
				Object.keys(storedEncounter.groups).forEach(function (id) {
					encounter.add(
						monsters.byId[id],
						storedEncounter.groups[id],
						{ skipFreeze: true }
					);
				});

				encounter.reference = storedEncounter;
			}
		}

		function freeze() {
			var o = {
				groups: {}
			};

			Object.keys(encounter.groups).forEach(function (monsterId) {
				o.groups[monsterId] = encounter.groups[monsterId].qty;
			});

			store.set("5em-encounter", o);
		}

		function thaw() {
			encounter.reset();

			return store.get("5em-encounter").then(function (frozen) {
				if ( !frozen ) {
					return;
				}				
				
			});
		}
	}
})();
