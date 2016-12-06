(function() {
'use strict';

    angular
        .module('app')
        .controller('managerRowController', ManagerRowController);

    ManagerRowController.$inject = ['$state', 'encounter', 'monsters', 'actionQueue', 'library'];
    function ManagerRowController($state, encounter, monsters, actionQueue, library) {
        var $ctrl = this;

        $ctrl.calculateExp = calculateExp;
        $ctrl.load = load;
        $ctrl.remove = remove;
        $ctrl.encounter = encounter;
        $ctrl.monsters = monsters;

        activate();

        ////////////////

        function activate() { }

        function calculateExp(storedEncounter) {
			var exp = 0;

			_.forEach(storedEncounter.groups, function (value, id) {
				exp += monsters.byId[id].cr.exp * storedEncounter.groups[id];
			});

			return exp;
		};

		function load(storedEncounter) {
			encounter.reset(storedEncounter);

			if ( !actionQueue.next($state) ) {
				$state.go("encounter-builder");
			}
		};

        function remove( storedEncounter ) {
			library.remove(storedEncounter);

			if ( angular.equals(encounter.reference, storedEncounter) ) {
				encounter.reference = null;
			}
		};
    }
})();