/* global Controllers */
/* global alignments */
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
			return a.name > b.name;
		});
		$scope.sizes = sizes;
		$scope.sources = sources;
		$scope.tags = Object.keys(tags).sort();
		$scope.types = types;
	},
};