/* global Controllers */
/* global NO_MONSTERS */
/* global NO_PLAYERS */
"use strict";

Controllers.battleSetup = {
	url: "/battle-setup",
	templateUrl: "modules/battle-setup/battle-setup.html",
	controller: function ($scope, $state, combat, util) {
		window.scope = $scope;

		$scope.partial = util.partialFactory("modules/battle-setup/partials/");
		$scope.combat = combat;

		var combatState = combat.init();

		if ( combatState === NO_MONSTERS ) {
			$state.go("encounter-builder");
			return;
		} else if ( combatState === NO_PLAYERS ) {
			$state.go("players.manage");
			return;
		}
	},
};
