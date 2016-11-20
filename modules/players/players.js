"use strict";

define(["scripts/constants"], function (constants) {
	return {
		main: {
			url: "/players",
			templateUrl: "modules/players/players.html?" + constants.VERSION,
			controller: function ($scope, util) {
				$scope.partial = util.partialFactory("modules/players/partials/");
			}
		},

		edit: {
			url: "/edit",
			templateUrl: "modules/players/edit.html?" + constants.VERSION,
			controller: function ($scope, players, util) {
				window.scope = $scope;

				$scope.partial = util.partialFactory("modules/players/partials/");

				$scope.players = players;
			},
		},

		manage: {
			url: "/manage",
			templateUrl: "modules/players/manage.html?" + constants.VERSION,
			controller: function ($scope, $state, actionQueue, players, util) {
				window.scope = $scope;

				$scope.partial = util.partialFactory("modules/players/partials/");

				// If there aren't any parties, send them to edit
				if ( !players.parties || !players.parties.length ) {
					$state.go("players.edit");
					return;
				}

				$scope.players = players;

				$scope.select = function (party) {
					players.selectParty(party);

					actionQueue.next($state);
				};
			},
		},
	};
});
