"use strict";

define(["app/constants"], function (constants) {
	return {
		main: {
			url: "/players",
			templateUrl: "app/players/players.html?" + constants.VERSION,
			controller: function ($scope, util) {
				$scope.partial = util.partialFactory("app/players/partials/");
			}
		},

		edit: {
			url: "/edit",
			templateUrl: "app/players/edit.html?" + constants.VERSION,
			controller: function ($scope, players, util) {
				window.scope = $scope;

				$scope.partial = util.partialFactory("app/players/partials/");

				$scope.players = players;
			},
		},

		manage: {
			url: "/manage",
			templateUrl: "app/players/manage.html?" + constants.VERSION,
			controller: function ($scope, $state, actionQueue, players, util) {
				window.scope = $scope;

				$scope.partial = util.partialFactory("app/players/partials/");

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
