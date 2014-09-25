/* global Controllers */
/* global alignments */
/* global checkMonster */
/* global crInfo */
/* global levels */
/* global monsters */
/* global sourceFilters */
/* global sources */
/* global tags */
/* global sizes */
/* global types */

"use strict";

Controllers.main = {
	url: "/main",
	templateUrl: "pages/main.html",
	controller: function ($scope) {
		window.scope = $scope;
		$scope.alignments = alignments;
		$scope.crList = [
			crInfo["0"],	crInfo["1/8"],	crInfo["1/4"],	crInfo["1/2"],
			crInfo["1"],	crInfo["2"],	crInfo["3"],	crInfo["4"],
			crInfo["5"],	crInfo["6"],	crInfo["7"],	crInfo["8"],
			crInfo["9"],	crInfo["10"],	crInfo["11"],	crInfo["12"],
			crInfo["13"],	crInfo["14"],	crInfo["15"],	crInfo["16"],
			crInfo["17"],	crInfo["18"],	crInfo["19"],	crInfo["20"],
			crInfo["21"],	crInfo["22"],	crInfo["23"],	crInfo["24"],
			crInfo["25"],	crInfo["26"],	crInfo["27"],	crInfo["28"],
			crInfo["29"],	crInfo["30"],
		];
		$scope.filters = {
			source: sourceFilters,
			pageSize: 10,
		};
		$scope.monsters = monsters.sort(function (a, b) {
			return (a.name > b.name) ? 1 : -1;
		});
		$scope.sizes = sizes;
		$scope.sources = sources;
		$scope.tags = Object.keys(tags).sort();
		$scope.types = types;
		$scope.levels = levels;

		$scope.checkMonster = checkMonster;

		$scope.encounter = {
			qty: 0,
			exp: 0,
			groups: {},
			playerCount: 4,
			partyLevel: $scope.levels[0],
			threat: {},
		};
		$scope.encounter.qty = 0;
		$scope.encounter.exp = 0;
		$scope.addMonster = function (monster) {
			$scope.encounter.groups[monster.name] = $scope.encounter.groups[monster.name] || {
				qty: 0,
				monster: monster,
			};

			$scope.encounter.groups[monster.name].qty++;
			$scope.encounter.qty++;
			$scope.encounter.exp += monster.cr.exp;
		};

		$scope.removeMonster = function (monster) {
			$scope.encounter.groups[monster.name].qty--;
			$scope.encounter.qty--;
			$scope.encounter.exp -= monster.cr.exp;
			if ( $scope.encounter.groups[monster.name].qty === 0 ) {
				delete $scope.encounter.groups[monster.name];
			}
		};

		$scope.adjustedEncounterExp = function () {
			var qty = $scope.encounter.qty,
				exp = $scope.encounter.exp,
				multiplierCategory,
				// 0 = a single monster against a large group
				// last = a horde of monsters against a small group
				multipliers = [
					0.5,
					1,
					1.5,
					2,
					2.5,
					3,
					4,
					5,
				];

			if ( qty === 0 ) {
				return 0;
			} else if ( qty === 1 ) {
				multiplierCategory = 1;
			} else if ( qty === 2 ) {
				multiplierCategory = 2;
			} else if ( qty < 7 ) {
				multiplierCategory = 3;
			} else if ( qty < 11 ) {
				multiplierCategory = 4;
			} else if ( qty < 15 ) {
				multiplierCategory = 5;
			} else {
				multiplierCategory = 6;
			}

			if ( $scope.encounter.playerCount < 3 ) {
				// Increase multiplier for parties of one and two
				multiplierCategory++;
			} else if ( $scope.encounter.playerCount > 5 ) {
				// Decrease multiplier for parties of six through eight
				multiplierCategory--;
			}

			return Math.floor(exp * multipliers[multiplierCategory]);
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
		};

		// Gotta get threat levels set up with initial values
		$scope.recalculateThreatLevels();
	},
};