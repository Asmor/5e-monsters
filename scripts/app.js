/* global Controllers */
/* global Directives */
/* global Filters */
/* global Services */
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
		$stateProvider.state("players", Controllers.players.main);
		$stateProvider.state("players.edit", Controllers.players.edit);
		$stateProvider.state("players.manage", Controllers.players.manage);
	})
	.directive("numberInput", Directives.numberInput)
	.filter("monstersFilter", Filters.monster)
	.filter("negative", Filters.negative)
	.filter("positive", Filters.positive)
	.filter("sortEncounter", Filters.sortEncounter)
	.factory("combat", Services.combat)
	.factory("encounter", Services.encounter)
	.factory("metaInfo", Services.metaInfo)
	.factory("monsters", Services.monsters)
	.factory("players", Services.players)
	.factory("sources", Services.sources)
	.factory("util", Services.util)
;
