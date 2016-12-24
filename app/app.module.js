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

	serviceInitialization.$inject = ['$log', 'encounter', 'players'];

	function serviceInitialization($log, encounter, players) {
		$log.log("Service initialization on app run");
		encounter.initialize();
		players.initialize();
	}
})();