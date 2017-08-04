(function() {
'use strict';

	angular
		.module('app')
		.controller('BattleTrackerController', BattleTrackerController);

	BattleTrackerController.$inject = ['$state', 'combat'];

	function BattleTrackerController($state, combat) {
		var vm = this;
		vm.combat = combat;

		activate();

		////////////////

		function activate() { 
			if ( !combat.combatants || !combat.combatants.length ) {
				$state.go("encounter-builder");
			}
			
			combat.begin();
		}
	}
})();