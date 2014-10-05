/* global Controllers */
"use strict";

Controllers.encounterBuilder = {
	url: "/encounter-builder",
	templateUrl: "modules/encounter-builder/encounter-builder.html",
	controller: function (
		$scope,
		store,
		encounter,
		metaInfo,
		monsters,
		party,
		sources,
		util
	) {
		window.scope = $scope;

		$scope.partial = util.partialFactory("modules/encounter-builder/partials/");

		$scope.alignments = metaInfo.alignments;
		$scope.crList = metaInfo.crList;
		$scope.filters = store.get("5em-filters") || {
			source: sources.filters,
			pageSize: 10,
		};
		$scope.monsters = monsters.all;
		$scope.sizes = metaInfo.sizes;
		$scope.sources = sources.all;
		$scope.tags = Object.keys(metaInfo.tags).sort();
		$scope.types = metaInfo.types;
		$scope.levels = metaInfo.levels;
		$scope.environments = metaInfo.environments;

		$scope.checkMonster = monsters.check;

		var frozenEncounter = store.get("5em-encounter");
		$scope.encounter = (frozenEncounter) ? encounter.thaw(frozenEncounter) : {
			qty: 0,
			exp: 0,
			groups: {},
			playerCount: 4,
			partyLevel: $scope.levels[0],
			threat: {},
		};		

		$scope.addMonster = function (monster, qty) {
			if ( typeof qty === "undefined" ) {
				qty = 1;
			}

			$scope.encounter.groups[monster.id] = $scope.encounter.groups[monster.id] || {
				qty: 0,
				monster: monster,
			};

			$scope.encounter.groups[monster.id].qty += qty;
			$scope.encounter.qty += qty;
			$scope.encounter.exp += monster.cr.exp * qty;

			store.set("5em-encounter", encounter.freeze($scope.encounter));
		};

		$scope.deleteMonster = function (monster) {
			if ( !$scope.encounter.groups[monster.id] ) { return; }

			var qty = $scope.encounter.groups[monster.id].qty,
				exp = monster.cr.exp * qty;

			delete $scope.encounter.groups[monster.id];
			$scope.encounter.qty -= qty;
			$scope.encounter.exp -= exp;
		};

		$scope.removeMonster = function (monster) {
			$scope.encounter.groups[monster.id].qty--;
			$scope.encounter.qty--;
			$scope.encounter.exp -= monster.cr.exp;
			if ( $scope.encounter.groups[monster.id].qty === 0 ) {
				delete $scope.encounter.groups[monster.id];
			}

			store.set("5em-encounter", encounter.freeze($scope.encounter));
		};

		$scope.getRandomEncounter = function () {
			var monsters = encounter.generateRandom($scope.encounter.playerCount, $scope.encounter.partyLevel, $scope.filters),
				i;

			$scope.encounter.qty = 0;
			$scope.encounter.exp = 0;
			$scope.encounter.groups = {};

			for ( i = 0; i < monsters.length; i++ ) {
				$scope.addMonster( monsters[i].monster, monsters[i].qty );
			}
		};

		$scope.randomize = function (monster) {
			var monsterList = util.getShuffledMonsterList(monster.cr.string),
				qty = $scope.encounter.groups[monster.id].qty;

			while ( monsterList.length ) {
				// Make sure we don't roll a monster we already have
				if ( $scope.encounter.groups[monsterList[0].name] ) {
					monsterList.shift();
					continue;
				}

				if ( monster.check( monsterList[0], $scope.filters, { skipCrCheck: true } ) ) {
					$scope.deleteMonster(monster);
					$scope.addMonster( monsterList[0], qty );
					return;					
				} else {
					monsterList.shift();
				}
			}

		};

		$scope.adjustedEncounterExp = function () {
			var qty = $scope.encounter.qty,
				exp = $scope.encounter.exp,
				multiplier = party.getMultiplier($scope.encounter.playerCount, qty);

			return Math.floor(exp * multiplier);
		};

		$scope.encounterDifficulty = function () {
			var exp = $scope.adjustedEncounterExp(),
				count = $scope.encounter.playerCount,
				level = $scope.encounter.partyLevel;

			if ( exp === 0 ) {
				return false;
			}

			if ( exp <= ( count * level.easy ) ) {
				return "Easy";
			} else if ( exp <= ( count * level.medium ) ) {
				return "Medium";
			} else if ( exp <= ( count * level.hard ) ) {
				return "Hard";
			} else if ( exp <= ( count * level.deadly ) ) {
				return "Deadly";
			} else {
				return "Ludicrous";
			}
		};

		$scope.monsterSort = function (monster) {
			var sort = $scope.filters.sort;

			if ( sort === "size" ) {
				return monster.sizeSort;
			}

			if ( sort === "type" ) {
				return monster.type;
			}

			if ( sort === "alignment" ) {
				return (monster.alignment||{text:"zzzzz"}).text;
			}

			if ( sort === "cr" ) {
				return monster.cr.numeric;
			}

			return monster.name;
		};

		$scope.dangerZone = function (monster) {
			if ( !monster ) {
				return null;
			}

			var threat = $scope.encounter.threat,
				monsterExp = monster.cr.exp;

			if ( monsterExp > threat.deadly ) {
				return "ludicrous";
			} else if ( monsterExp > threat.hard ) {
				return "deadly";
			} else if ( monsterExp > threat.medium ) {
				return "hard";
			} else if ( monsterExp > threat.easy ) {
				return "medium";
			} else if ( monsterExp > threat.pair ) {
				return "easy";
			} else if ( monsterExp > threat.group ) {
				return "pair";
			} else if ( monsterExp > threat.trivial ) {
				return "group";
			} else {
				return "trivial";
			}
		};

		$scope.recalculateThreatLevels = function () {
			var count = $scope.encounter.playerCount,
				level = $scope.encounter.partyLevel,
				mediumExp = count * level.medium,
				singleMultiplier = 1,
				pairMultiplier = 1.5,
				groupMultiplier = 2,
				trivialMultiplier = 2.5;

			if ( count < 3 ) {
				// For small groups, increase multiplier
				singleMultiplier = 1.5;
				pairMultiplier = 2;
				groupMultiplier = 2.5;
				trivialMultiplier = 3;
			} else if ( count > 5 ) {
				// For large groups, reduce multiplier
				singleMultiplier = 0.5;
				pairMultiplier = 1;
				groupMultiplier = 1.5;
				trivialMultiplier = 2;
			}

			$scope.encounter.threat.deadly	= count * level.deadly / singleMultiplier;
			$scope.encounter.threat.hard	= count * level.hard / singleMultiplier;
			$scope.encounter.threat.medium	= mediumExp / singleMultiplier;
			$scope.encounter.threat.easy	= count * level.easy / singleMultiplier;
			$scope.encounter.threat.pair	= mediumExp / ( 2 * pairMultiplier );
			$scope.encounter.threat.group	= mediumExp / ( 4 * groupMultiplier );
			$scope.encounter.threat.trivial	= mediumExp / ( 8 * trivialMultiplier );

			store.set("5em-encounter", encounter.freeze($scope.encounter));
		};

		// Gotta get threat levels set up with initial values
		$scope.recalculateThreatLevels();

		$scope.$watch("filters", function () {
			store.set("5em-filters", $scope.filters);
		}, true);
	},
};
