"use strict";

require([
	"modules/encounter-builder/encounter-builder",
	"modules/encounter-manager/encounter-manager",
	"modules/battle-setup/battle-setup",
	"modules/battle-tracker/battle-tracker",
	"modules/players/players",
	"modules/account/account",
	"modules/common/common",
	"scripts/filters",
	"scripts/services/account",
	"scripts/services/actionQueue",
	"scripts/services/combat",
	"scripts/services/encounter",
	"scripts/services/library",
	"scripts/services/metaInfo",
	"scripts/services/monsters",
	"scripts/services/players",
	"scripts/services/sources",
	"scripts/services/store",
	"scripts/services/util",
], function (
	encounterBuilder,
	encounterManager,
	battleSetup,
	battleTracker,
	players,
	account,
	common,
	filters,
	accountService,
	actionQueueService,
	combatService,
	encounterService,
	libraryService,
	metaInfoService,
	monstersService,
	playersService,
	sourcesService,
	storeService,
	utilService
) {
	angular
		.module("monsterListApp", [
			"ui.router",
			"ngTouch",
			"angularUtils.directives.dirPagination",
			"firebase",
		])
		.config(function ($stateProvider, $urlRouterProvider) {
			// Default
			$urlRouterProvider.otherwise("/encounter-builder");

			// Main menu page
			$stateProvider.state("encounter-builder", encounterBuilder);
			$stateProvider.state("encounter-manager", encounterManager);
			$stateProvider.state("battle-setup", battleSetup);
			$stateProvider.state("battle-tracker", battleTracker);
			$stateProvider.state("players", players.main);
			$stateProvider.state("players.edit", players.edit);
			$stateProvider.state("players.manage", players.manage);
			$stateProvider.state("account", account);
		})
		.directive("numberInput", common.numberInput)
		.filter("monstersFilter", filters.monster)
		.filter("negative", filters.negative)
		.filter("positive", filters.positive)
		.filter("sortEncounter", filters.sortEncounter)
		.factory("account", accountService)
		.factory("actionQueue", actionQueueService)
		.factory("combat", combatService)
		.factory("encounter", encounterService)
		.factory("library", libraryService)
		.factory("metaInfo", metaInfoService)
		.factory("monsters", monstersService)
		.factory("players", playersService)
		.factory("sources", sourcesService)
		.factory("store", storeService)
		.factory("util", utilService)
	;

angular.bootstrap(document, ['monsterListApp']);
});