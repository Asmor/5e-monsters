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
		"scripts/services",
		"scripts/services/metaInfo",
	], function (
		encounterBuilder,
		encounterManager,
		battleSetup,
		battleTracker,
		players,
		account,
		common,
		filters,
		services,
		metaInfoService
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
		.factory("account", services.account)
		.factory("actionQueue", services.actionQueue)
		.factory("combat", services.combat)
		.factory("encounter", services.encounter)
		.factory("library", services.library)
		.factory("metaInfo", metaInfoService)
		.factory("monsters", services.monsters)
		.factory("players", services.players)
		.factory("sources", services.sources)
		.factory("store", services.store)
		.factory("util", services.util)
	;

	angular.bootstrap(document, ['monsterListApp']);
});