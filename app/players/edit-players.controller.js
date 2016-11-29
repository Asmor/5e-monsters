(function() {
'use strict';

    angular
        .module('app')
        .controller('EditPlayersController', EditPlayersController);

    EditPlayersController.$inject = ['players', 'util'];

    function EditPlayersController(players, util) {
        var vm = this;
        vm.partial = util.partialFactory("app/players/partials/");
        vm.players = players;

        activate();

        ////////////////

        function activate() { }
    }
})();