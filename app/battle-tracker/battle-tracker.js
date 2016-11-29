(function() {
'use strict';

	angular
		.module('app')
		.controller('BattleTrackerController', BattleTrackerController);

	BattleTrackerController.$inject = ['$state', 'combat', 'util'];

	function BattleTrackerController($state, combat, util) {
		var vm = this;
		vm.partial = util.partialFactory("app/battle-tracker/partials/");
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