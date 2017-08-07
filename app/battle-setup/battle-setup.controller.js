(function() {
	'use strict';

	angular
		.module('app')
		.controller('BattleSetupController', BattleSetupController);

	BattleSetupController.$inject = ['$state', 'actionQueue', 'combat', 'combatConstants', 'integration'];

	function BattleSetupController($state, actionQueue, combat, combatConstants, integration) {
		var vm = this;
		
		vm.combat = combat;

		vm.launchImpInit = integration.launchImpInit;

		activate();

		////////////////

		function activate() {
			var combatState = combat.init(),
				forward;

			if ( combatState & combatConstants.NO_PLAYERS ) {
				actionQueue.unshift("players.manage", "You must select a party");
				forward = true;
			}

			if ( combatState & combatConstants.NO_MONSTERS ) {
				actionQueue.unshift("encounter-manager", "You must select an encounter");
				forward = true;
			}

			if ( forward ) {
				// In the end, send them back here
				actionQueue.queue("battle-setup");

				actionQueue.next($state);
			}
		}
	}
})();
