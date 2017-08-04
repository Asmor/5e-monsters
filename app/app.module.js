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

	serviceInitialization.$inject = ['encounter', 'players', 'partyInfo'];

	function serviceInitialization(encounter, players, partyInfo) {
		partyInfo.initialize();
		encounter.initialize();
		players.initialize();
	}
})();
