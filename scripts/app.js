/* global Controllers */
/* global Directives */
/* global monstersFilter */
"use strict";

var monsterListApp = angular.module("monsterListApp", [
	"ui.router",
	"ngTouch",
	"angularUtils.directives.dirPagination",
	"angular-storage",
]);

monsterListApp.config(function ($stateProvider, $urlRouterProvider) {
	// Default
	$urlRouterProvider.otherwise("/encounter-builder");

	// Main menu page
	$stateProvider.state("encounter-builder", Controllers.encounterBuilder);
	$stateProvider.state("battle-setup", Controllers.battleSetup);
	$stateProvider.state("battle-tracker", Controllers.battleTracker);
});
monsterListApp.filter("monstersFilter", monstersFilter);
monsterListApp.directive("numberInput", Directives.numberInput);

monsterListApp.filter("positive", function () {
	return function ( input ) {
		var output = [],
			i;

		for ( i = 0; i < input.length; i++ ) {
			if ( input[i] > 0 ) {
				output.push(input[i]);
			}
		}

		return output;
	};
});
monsterListApp.filter("negative", function () {
	return function ( input ) {
		var output = [],
			i;

		for ( i = 0; i < input.length; i++ ) {
			if ( input[i] < 0 ) {
				output.push(input[i]);
			}
		}

		return output;
	};
});
