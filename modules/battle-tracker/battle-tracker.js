/* global Controllers */
/* global partialFactory */
"use strict";

Controllers.battleTracker = {
	url: "/fight",
	templateUrl: "modules/battle-tracker/battle-tracker.html",
	controller: function ($scope, $state, store) {
		window.scope = $scope;

		$scope.partial = partialFactory("modules/battle-tracker/partials/");

		$scope.combatants = store.get("5em-combatants");
		$scope.options = {
			delta: 0,
			active: 0,
		};


		if ( !$scope.combatants || !$scope.combatants.length ) {
			$state.go("encounter-builder");
			return;
		}

		$scope.combatants.sort(function (a, b) {
			return b.initiative - a.initiative;
		});

		$scope.combatants[$scope.options.active].active = true;

		$scope.applyDelta = function (combatant, multiplier) {
			multiplier = multiplier || 1;

			// Make sure damage is initialized
			combatant.damage = combatant.damage || 0;

			combatant.damage += $scope.options.delta * multiplier;
			console.log(combatant, $scope.options.delta, combatant.damage);
			$scope.options.delta = 0;


			// Damage can't reduce you below 0
			if ( combatant.damage > combatant.hp ) {
				combatant.damage = combatant.hp;
			}

			// Damage can't be negative
			if ( combatant.damage < 0 ) {
				combatant.damage = 0;
			}
		};

		$scope.nextTurn = function () {
			$scope.combatants[$scope.options.active].active = false;
			$scope.options.active = ( $scope.options.active + 1 ) % $scope.combatants.length;
			$scope.combatants[$scope.options.active].active = true;
		};
	},
};
