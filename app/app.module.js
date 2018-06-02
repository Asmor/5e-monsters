(function () {
	/* global requirejs */
	"use strict";

	// polyfill for older browsers that don't support Number.parseInt natively
	if ( !Number.parseInt ) {
		Number.parseInt = window.parseInt;
	}

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
