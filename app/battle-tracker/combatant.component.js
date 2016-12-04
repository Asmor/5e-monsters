(function() {
'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('app')
        .component('combatant', {
            templateUrl: 'app/battle-tracker/combatant.html',
            controller: angular.noop,
            controllerAs: '$vm',
            bindings: {
                combatant: '<'
            },
        });
})();