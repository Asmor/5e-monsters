"use strict";

define({
	url: "/account",
	templateUrl: "modules/account/account.html",
	controller: function ($scope, $state, account, actionQueue, util) {
		window.scope = $scope;

		$scope.partial = util.partialFactory("modules/account/partials/");

		$scope.account = account;

		$scope.login = function (how) {
			account.login({
				with: how,
				callback: function (error, authData) {
					if (account.loginProvider) {
						actionQueue.next($state);
					}
				}
			});
		};
	},
});
