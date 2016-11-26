(function () {
	"use strict";

	angular.module("app")
		.constant("combatConstants", {
			READY       : 1,
			NO_MONSTERS : 2,
			NO_PLAYERS  : 4
		})
		.constant("AppVersion", 1);

// define({
// 	// Used for returning values from the combat service
// 	READY       : 1,
// 	NO_MONSTERS : 2,
// 	NO_PLAYERS  : 4,

// 	// Used for cache-busting. Should be kept in sync with value in requirejs config in app.js
// 	VERSION: 1,
// });
})();