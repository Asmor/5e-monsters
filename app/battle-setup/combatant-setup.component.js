(function() {
'use strict';

    angular
        .module('app')
        .component('combatantSetup', {
            templateUrl: 'app/battle-setup/combatant-setup.html',
            controller: 'combatantSetupController',
            controllerAs: "vm",
            bindings: {
                combatant: '<'
            },
        });
})();