/* global Controllers */
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
});
monsterListApp.filter("monstersFilter", monstersFilter);
