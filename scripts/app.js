/* global Controllers */
/* global Directives */
/* global Filters */
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
monsterListApp.filter("monstersFilter", Filters.monster);
monsterListApp.directive("numberInput", Directives.numberInput);

monsterListApp.filter("positive", Filters.positive);
monsterListApp.filter("negative", Filters.negative);
