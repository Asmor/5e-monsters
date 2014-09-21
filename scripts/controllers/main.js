/* global Controllers */
/* global alignments */
/* global checkMonster */
/* global crs */
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

		$scope.checkMonster = checkMonster;

		$scope.encounter = {};
		$scope.encounterQty = 0;
		$scope.encounterExp = 0;
		$scope.addMonster = function (monster) {
			$scope.encounter[monster.name] = $scope.encounter[monster.name] || {
				qty: 0,
				monster: monster,
			};

			$scope.encounter[monster.name].qty++;
			$scope.encounterQty++;
			$scope.encounterExp += monster.exp;
		};
		$scope.removeMonster = function (monster) {
			$scope.encounter[monster.name].qty--;
			$scope.encounterQty--;
			$scope.encounterExp -= monster.exp;
			if ( $scope.encounter[monster.name].qty === 0 ) {
				delete $scope.encounter[monster.name];
			}
		};
		$scope.adjustedEncounterExp = function () {
			var qty = $scope.encounterQty,
				exp = $scope.encounterExp;

			if ( qty === 0 ) {
				return 0;
			} else if ( qty === 1 ) {
				return exp;
			} else if ( qty === 2 ) {
				return Math.floor(exp * 1.5);
			} else if ( qty < 7 ) {
				return Math.floor(exp * 2);
			} else if ( qty < 11 ) {
				return Math.floor(exp * 2.5);
			} else if ( qty < 15 ) {
				return exp * 3;
			} else {
				return exp * 4;
			}
		};
	},
};