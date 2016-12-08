(function() {
'use strict';

	angular
		.module('app')
		.controller('EncounterInfoController', EncounterInfoController);

	EncounterInfoController.$inject = ['encounter'];
	function EncounterInfoController(encounter) {
		var vm = this;

		vm.getMonsterQtyString = function () {
			var qty = Object.keys(vm.encounter.groups).reduce(function (sum, key) {
				return sum + vm.encounter.groups[key].qty;
			}, 0);

			if ( qty === 1 ) {
				return "1 enemy";
			}

			return qty + " enemies";
		};
		
		vm.encounter = encounter;
		window.encounter = encounter;
	}
})();
