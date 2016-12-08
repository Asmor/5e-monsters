(function() {
    'use strict';

    angular
        .module('app')
        .component('encounterInfo', {
            bindings: {
                filters: '<'
            },
            controller: 'EncounterInfoController',
            controllerAs: 'vm',
            templateUrl: 'app/encounter-builder/encounter-info.html'
        });
})();
