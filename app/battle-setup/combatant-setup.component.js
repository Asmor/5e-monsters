(function() {
'use strict';

    angular
        .module('app')
        .component('combatantSetup', {
            templateUrl: 'app/battle-setup/combatant-setup.html',
            controller: angular.noop,
            controllerAs: "$vm",
            bindings: {
                combatant: '<'
            },
        });
})();