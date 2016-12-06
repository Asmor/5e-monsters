(function() {
    'use strict';

    angular
        .module('app')
        .component('currentEncounter', {
            bindings: {
                filters: '<'
            },
            controller: CurrentEncounterController,
            controllerAs: 'vm',
            templateUrl: 'app/encounter-builder/current-encounter.html'
        });

    CurrentEncounterController.$inject = ['encounter'];
    function CurrentEncounterController(encounter) {
        var vm = this;
        
        vm.encounter = encounter;

        activate();

        ////////////////

        function activate() { 
        }
    }
})();