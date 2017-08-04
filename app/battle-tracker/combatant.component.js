(function() {
'use strict';

    angular
        .module('app')
        .component('combatant', {
            templateUrl: 'app/battle-tracker/combatant.html',
            controller: CombatantController,
            controllerAs: 'vm',
            bindings: {
                combatant: '<'
            },
        });

    CombatantController.$inject = ['combat'];
    function CombatantController(combat) {
        var vm = this;
        vm.combat = combat;

        activate();

        ////////////////

        function activate() { }
    }
})();