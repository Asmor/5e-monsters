"use strict";

define(["scripts/constants"], function (constants) {
	return {
		url: "/fight",
		templateUrl: "modules/battle-tracker/battle-tracker.html?" + constants.VERSION,
		controller: function ($scope, $state, combat, util) {
			window.scope = $scope;

			if ( !combat.combatants || !combat.combatants.length ) {
				$state.go("encounter-builder");
			}

			$scope.partial = util.partialFactory("modules/battle-tracker/partials/");

			$scope.combat = combat;
			combat.begin();
		},
	};
});
