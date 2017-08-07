(function() {
'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('app')
        .component('monsterTable', {
            templateUrl: 'app/encounter-builder/monster-table.html',
            controller: 'monsterTableController',
            controllerAs: 'vm',
            bindings: {
                filters: '<'
            },
        });
})();