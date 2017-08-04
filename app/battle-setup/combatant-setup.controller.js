(function() {
'use strict';

    angular
        .module('app')
        .controller('combatantSetupController', CombatantSetupController);

    CombatantSetupController.$inject = ['combat'];
    function CombatantSetupController(combat) {
        var vm = this;
        vm.combat = combat;

        activate();

        ////////////////

        function activate() { }
    }
})();