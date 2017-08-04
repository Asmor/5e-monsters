(function () {
	"use strict";

	angular.module("app")
		.constant("combatConstants", {
			READY       : 1,
			NO_MONSTERS : 2,
			NO_PLAYERS  : 4
		})
		.constant("AppVersion", 1);
})();