/* global Controllers */
"use strict";

Controllers.battleSetup = {
	url: "/battle-setup",
	templateUrl: "modules/battle-setup/battle-setup.html",
	controller: function ($scope, $state, combat, util) {
		window.scope = $scope;

		$scope.partial = util.partialFactory("modules/battle-setup/partials/");
		$scope.combat = combat;

		if ( !combat.init() ) {
			$state.go("encounter-builder");
			return;
		}
	},
};
