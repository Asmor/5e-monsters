(function() {
	'use strict';

	angular
		.module('app')
		.run(appRun);

	appRun.$inject = ['routerHelper'];

	function appRun(routerHelper) {
		var otherwise = "/encounter-builder";
		routerHelper.configureStates(getStates(), otherwise);
	}

	function getStates() {
		return [
			{
				state: "battle-setup",
				config: {
					url: "/battle-setup",
					templateUrl: "app/battle-setup/battle-setup.html",
					controller: 'BattleSetupController',
					controllerAs: "vm"
				}
			},
			{
				state: "battle-tracker",
				config: {
					url: "/fight",
					templateUrl: "app/battle-tracker/battle-tracker.html",
					controller: 'BattleTrackerController',
					controllerAs: "vm"
				}
			},
			{
				state: "encounter-builder",
				config: {
					url: "/encounter-builder",
					templateUrl: "app/encounter-builder/encounter-builder.html",
					controller: 'EncounterBuilderController',
					controllerAs: "vm"
				}
			},
			{
				state: "encounter-manager",
				config: {
					url: "/encounter-manager",
					templateUrl: "app/encounter-manager/encounter-manager.html",
					controller: 'EncounterManagerController',
					controllerAs: "vm"
				}
			},
			{
				state: "players",
				config: {
					url: "/players",
					templateUrl: "app/players/players.html",
					controller: 'PlayersController',
					controllerAs: "vm"
				}
			},
			{
				state: "players.manage",
				config: {
					url: "/manage",
					templateUrl: "app/players/manage.html",
					controller: 'ManagePlayersController',
					controllerAs: "vm"
				}
			},
						{
				state: "players.edit",
				config: {
					url: "/edit",
					templateUrl: "app/players/edit.html",
					controller: 'EditPlayersController',
					controllerAs: "vm"
				}
			},
			{
				state: "about",
				config: {
					url: "/about",
					templateUrl: "app/about/about.html",
					controller: angular.noop,
					controllerAs: "vm"
				}
			},
			{
				state: "test",
				config: {
					url: "/test",
					templateUrl: "app/test.html",
					controller: 'TestController',
					controllerAs: "vm"
				}
			}
		];
	}

})();

