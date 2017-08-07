(function() {
'use strict';

    angular
        .module('app')
        .controller('EditPlayersController', EditPlayersController);

    EditPlayersController.$inject = ['players'];

    function EditPlayersController(players) {
        var vm = this;
        vm.players = players;

        activate();

        ////////////////

        function activate() { }
    }
})();