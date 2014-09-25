/* global Controllers */
/* global monstersFilter */
"use strict";

var monsterListApp = angular.module("monsterListApp", ["ui.router", "ngTouch", "angularUtils.directives.dirPagination"]);

monsterListApp.config(function ($stateProvider, $urlRouterProvider) {
	// Default
	$urlRouterProvider.otherwise("/main");

	// Main menu page
	$stateProvider.state("main", Controllers.main);
});
monsterListApp.filter("monstersFilter", monstersFilter);
