(function() {
'use strict';

    angular
        .module('app')
        .controller('NumberInputController', NumberInputController);

    NumberInputController.$inject = [];

    function NumberInputController() {
        var vm = this;
        vm.modify = modify;
        vm.hideNegative = hideNegative;

        activate();

        ////////////////

        function activate() { }

        function modify(amt) {
            vm.value += amt;

            if ( vm.nonNegative && vm.value < 0 ) {
                vm.value = 0;
            }
        }

        function hideNegative() {
            return vm.nonNegative && vm.value === 0;
        }
    }
})();