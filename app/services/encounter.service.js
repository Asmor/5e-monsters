(function () {
	"use strict";

	angular.module("app")
		.factory("encounter", EncounterService);

	EncounterService.$inject = ['$rootScope', '$log', 'randomEncounter', 'store', 'monsters', 'players', 'misc', 'playerLevels'];

	function EncounterService($rootScope, $log, randomEncounter, store, monsters, players, miscLib, playerLevels) {
		var encounter = {
				groups: {},
				partyLevel: playerLevels[1],
				playerCount: 4,
				reference: null,
				threat: {},

				// Methods
				add: add,
				generateRandom: generateRandom,
				initialize: initialize,
				randomize: randomize,
				recalculateThreatLevels: recalculateThreatLevels,
				remove: remove,
				reset: reset,
				thaw: thaw,
				freeze: freeze,

				// Properties
				get adjustedExp() {
					var qty = encounter.qty,
					exp = encounter.exp,
					multiplier = miscLib.getMultiplier(encounter.playerCount, qty);

					return Math.floor(exp * multiplier);
				},

				get difficulty() {
					var exp = encounter.adjustedExp,
						count = encounter.playerCount,
						level = encounter.partyLevel;

					if ( exp === 0 ) {
						return false;
					}

					if ( exp < ( count * level.easy ) ) {
						return '';
					} else if ( exp < ( count * level.medium ) ) {
						return "Easy";
					} else if ( exp < ( count * level.hard ) ) {
						return "Medium";
					} else if ( exp < ( count * level.deadly ) ) {
						return "Hard";
					} else {
						return "Deadly";
					}
				}
		};

		return encounter;
		
		function initialize() {
			thaw().then(function () {
				encounter.recalculateThreatLevels();
			});
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
			encounter.qty += qty;
			encounter.exp += monster.cr.exp * qty;

			encounter.reference = null;
		}

		function generateRandom(filters, targetDifficulty) {
			targetDifficulty = targetDifficulty || 'medium';
			var targetExp = encounter.partyLevel[targetDifficulty];
			var monsters = randomEncounter.getRandomEncounter(encounter.playerCount, targetExp, filters),
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

		function recalculateThreatLevels() {
			var count = encounter.playerCount,
				level = encounter.partyLevel,
				mediumExp = count * level.medium,
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

			encounter.threat.deadly  = count * level.deadly / singleMultiplier;
			encounter.threat.hard    = count * level.hard / singleMultiplier;
			encounter.threat.medium  = mediumExp / singleMultiplier;
			encounter.threat.easy    = count * level.easy / singleMultiplier;
			encounter.threat.pair    = mediumExp / ( 2 * pairMultiplier );
			encounter.threat.group   = mediumExp / ( 4 * groupMultiplier );
			encounter.threat.trivial = mediumExp / ( 8 * trivialMultiplier );
		}

		function remove(monster, removeAll) {
			encounter.groups[monster.id].qty--;
			encounter.qty--;
			encounter.exp -= monster.cr.exp;
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
			encounter.qty = 0;
			encounter.exp = 0;
			encounter.groups = {};
			encounter.threat = {};

			if (storedEncounter) {
				Object.keys(storedEncounter.groups).forEach(function (id) {
					encounter.add(
						monsters.byId[id],
						storedEncounter.groups[id],
						{ skipFreeze: true }
					);
				});

				encounter.reference = storedEncounter;
			}

			encounter.recalculateThreatLevels();
		}

		function freeze() {
			var o = {
				groups: {},
				partyLevel: encounter.partyLevel.level,
				playerCount: encounter.playerCount,
			};

			$log.log("Freezing party info", o);

			Object.keys(encounter.groups).forEach(function (monsterId) {
				o.groups[monsterId] = encounter.groups[monsterId].qty;
			});

			store.set("5em-encounter", o);
		}

		function thaw() {
			$log.log('Thawing party info');
			encounter.reset();

			return store.get("5em-encounter").then(function (frozen) {
				if ( !frozen ) {
					return;
				}

				$log.log('Load party level (' + frozen.partyLevel + ') and player count (' + frozen.playerCount + ') from the store');
				encounter.partyLevel = playerLevels[frozen.partyLevel];
				encounter.playerCount = frozen.playerCount;
			});
		}
	}
})();