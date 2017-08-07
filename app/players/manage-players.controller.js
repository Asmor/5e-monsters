(function() {
'use strict';

    angular
        .module('app')
        .controller('ManagePlayersController', ManagePlayersController);

    ManagePlayersController.$inject = ['$state', 'actionQueue', 'players'];

    function ManagePlayersController($state, actionQueue, players) {
        var vm = this;

        vm.players = players;

        vm.select = function (party) {
            players.selectParty(party);

            actionQueue.next($state);
        };    

        activate();

        ////////////////

        function activate() { 
            // If there aren't any parties, send them to edit
            if ( !players.parties || !players.parties.length ) {
                $state.go("players.edit");
                return;
            }
        }
    }
})();