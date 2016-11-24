"use strict";

define(["app/constants"], function (constants) {
	return {
		url: "/fight",
		templateUrl: "app/battle-tracker/battle-tracker.html?" + constants.VERSION,
		controller: function ($scope, $state, combat, util) {
			window.scope = $scope;

			if ( !combat.combatants || !combat.combatants.length ) {
				$state.go("encounter-builder");
			}

			$scope.partial = util.partialFactory("app/battle-tracker/partials/");

			$scope.combat = combat;
			combat.begin();
		},
	};
});
