/* global Controllers */
"use strict";

Controllers.battleSetup = {
	url: "/battle-setup",
	templateUrl: "modules/battle-setup/battle-setup.html",
	controller: function ($scope, $state, store, encounter, monsters, util) {
		window.scope = $scope;

		$scope.partial = util.partialFactory("modules/battle-setup/partials/");

		var monsterIds = Object.keys(encounter.groups),
			lair = false,
			i, j, monster, name, qty;

		if ( ! monsterIds.length ) {
			// If there aren't any monsters, we can't run an encounter
			$state.go("encounter-builder");
			return;
		}

		$scope.combatants = [];

		for ( i = 0; i < encounter.playerCount; i++ ) {
			$scope.combatants.push({
				type: "player",
				name: "Player " + (i + 1),
				initiativeMod: 0,
				initiative: 10,
				hp: 10,
			});
		}

		for ( i = 0; i < monsterIds.length; i++ ) {
			monster = monsters.byId[monsterIds[i]];
			qty = encounter.groups[monsterIds[i]].qty;
			lair = lair || monster.lair;

			for ( j = 0; j < qty; j++ ) {
				name = [ monster.name ];

				if ( qty > 1 ) {
					name.push( j + 1 );
				}

				$scope.combatants.push({
					type: "enemy",
					name: name.join(" "),
					ac: monster.ac,
					hp: monster.hp,
					initiativeMod: monster.init,
					initiative: 10 + monster.init,
					id: monster.id,
				});
			}
		}

		if ( lair ) {
			$scope.combatants.push({
				type: "lair",
				name: "Lair",
				iniativeMod: 0,
				initiative: 20,
				fixedInitiative: true,
				noHp: true,
			});
		}

		$scope.rollInitiative = function (combatant) {
			combatant.initiative = util.d(20) + combatant.initiativeMod;
			combatant.initiativeRolled = true;
		};

		$scope.startFight = function () {
			store.set("5em-combatants", $scope.combatants);
			$state.go("battle-tracker");
		};
	},
};
