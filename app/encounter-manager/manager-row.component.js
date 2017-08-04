(function() {
'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('app')
        .component('managerRow', {
            templateUrl:'app/encounter-manager/manager-row.html',
            controller: 'managerRowController',
            controllerAs: 'vm',
            bindings: {
                storedEncounter: '<'
            }
        });
})();