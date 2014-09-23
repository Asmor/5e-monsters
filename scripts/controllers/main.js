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
				// 0 and 7 are repeats of 1 and 6, to handle large and small party adjustments
				multipliers = [
					1,
					1,
					1.5,
					2,
					2.5,
					3,
					4,
					4,
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
			var count = $scope.encounter.playerCount,
				level = $scope.encounter.partyLevel,
				mediumExp = count * level.medium,
				monsterExp = monster.cr.exp;

			if ( monsterExp > count * level.deadly ) {
				return "ludicrous";
			} else if ( monsterExp > count * level.hard ) {
				return "deadly";
			} else if ( monsterExp > mediumExp ) {
				return "hard";
			} else if ( monsterExp > count * level.easy ) {
				return "medium";
			} else if ( monsterExp > mediumExp / 3 ) {
				return "easy";
			} else if ( monsterExp > mediumExp / 8 ) {
				return "pair";
			} else if ( monsterExp > mediumExp / 20 ) {
				return "group";
			} else {
				return "trivial";
			}
		};
	},
};