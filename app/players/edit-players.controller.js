(function() {
'use strict';

    angular
        .module('app')
        .controller('EditPlayersController', EditPlayersController);

    EditPlayersController.$inject = ['players', 'util'];

    function EditPlayersController(players, util) {
        var vm = this;
        vm.players = players;

        activate();

        ////////////////

        function activate() { }
    }
})();