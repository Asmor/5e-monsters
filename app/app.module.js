(function () {
	/* global requirejs */
	"use strict";

	var myApp = angular
		.module("app", [
			"ui.router",
			"ngTouch",
			"angularUtils.directives.dirPagination",
			"LocalStorageModule"
		]);

	myApp.config(function(localStorageServiceProvider) {
		localStorageServiceProvider
    		.setPrefix('');
	});

	myApp.run(serviceInitialization);

	serviceInitialization.$inject = ['$log', 'encounter', 'players', 'partyInfo'];

	function serviceInitialization($log, encounter, players, partyInfo) {
		$log.log("Service initialization on app run");
		partyInfo.initialize();
		encounter.initialize();
		players.initialize();
	}
})();