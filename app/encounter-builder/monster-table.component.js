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
            bindings: {
                filters: '<'
            },
        });
})();