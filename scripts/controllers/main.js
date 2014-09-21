/* global Controllers */
/* global alignments */
/* global checkMonster */
/* global crs */
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
		$scope.crs = crs;
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
			$scope.encounter.exp += monster.exp;
		};
		$scope.removeMonster = function (monster) {
			$scope.encounter.groups[monster.name].qty--;
			$scope.encounter.qty--;
			$scope.encounter.exp -= monster.exp;
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
	},
};