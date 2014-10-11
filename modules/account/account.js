/* global Controllers */
"use strict";

Controllers.account = {
	url: "/account",
	templateUrl: "modules/account/account.html",
	controller: function ($scope, account, util) {
		window.scope = $scope;

		$scope.partial = util.partialFactory("modules/account/partials/");

		$scope.account = account;
	},
};
