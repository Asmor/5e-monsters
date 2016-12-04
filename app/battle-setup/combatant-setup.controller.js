(function() {
'use strict';

    angular
        .module('app')
        .controller('combatantSetupController', combatantSetupController);

    combatantSetupController.$inject = ['combat'];
    function combatantSetupController(combat) {
        var $vm = this;
        $vm.combat = combat;

        activate();

        ////////////////

        function activate() { }
    }
})();