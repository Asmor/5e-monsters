/* global Controllers */
/* global Directives */
/* global Filters */
"use strict";

angular
	.module("monsterListApp", [
		"ui.router",
		"ngTouch",
		"angularUtils.directives.dirPagination",
		"angular-storage",
	])
	.config(function ($stateProvider, $urlRouterProvider) {
		// Default
		$urlRouterProvider.otherwise("/encounter-builder");

		// Main menu page
		$stateProvider.state("encounter-builder", Controllers.encounterBuilder);
		$stateProvider.state("battle-setup", Controllers.battleSetup);
		$stateProvider.state("battle-tracker", Controllers.battleTracker);
	})
	.directive("numberInput", Directives.numberInput)
	.filter("monstersFilter", Filters.monster)
	.filter("positive", Filters.positive)
	.filter("negative", Filters.negative)
;
