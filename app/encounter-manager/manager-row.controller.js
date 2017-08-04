(function() {
	/* global _ */
	'use strict';

	angular
		.module('app')
		.controller('managerRowController', ManagerRowController);

	ManagerRowController.$inject = ['$state', 'encounter', 'monsters', 'actionQueue', 'library'];
	function ManagerRowController($state, encounter, monsters, actionQueue, library) {
		var vm = this;

		vm.calculateExp = calculateExp;
		vm.load = load;
		vm.remove = remove;
		vm.encounter = encounter;
		vm.monsters = monsters;

		activate();

		////////////////

		function activate() { }

		function calculateExp(storedEncounter) {
			var exp = 0;

			_.forEach(storedEncounter.groups, function (value, id) {
				// If we start on this page, byId won't be populated yet. Will get filled out
				// correctly on a later digest cycle
				if ( monsters.byId[id] ) {
					exp += monsters.byId[id].cr.exp * storedEncounter.groups[id];
				}
			});

			return exp;
		}

		function load(storedEncounter) {
			encounter.reset(storedEncounter);

			if ( !actionQueue.next($state) ) {
				$state.go("encounter-builder");
			}
		}

		function remove( storedEncounter ) {
			library.remove(storedEncounter);

			if ( angular.equals(encounter.reference, storedEncounter) ) {
				encounter.reference = null;
			}
		}
	}
})();
