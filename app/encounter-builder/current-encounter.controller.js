(function() {
'use strict';

    angular
        .module('app')
        .controller('CurrentEncounterController', CurrentEncounterController);

    CurrentEncounterController.$inject = ['encounter', 'sources'];
    function CurrentEncounterController(encounter, sources) {
        var vm = this;
        
        vm.encounter = encounter;

        activate();

        ////////////////

        function activate() { 
            vm.filters = {
                source: sources.filters,
                pageSize: 10,
            };
        }
    }
})();