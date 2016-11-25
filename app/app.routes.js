(function() {
	'use strict';

	angular
		.module('app')
		.run(appRun);

	appRun.$inject = ['routerHelper'];

	function appRun(routerHelper) {
		var otherwise = "/encounter-builder";
		routerHelper.configureStates(getStates(), otherwise);
	}

	function getStates() {
		return [
			{
				state: "encounter-builder",
				config: {
					url: "/encounter-builder",
					templateUrl: "app/test.html",
					controller: 'TestController',
					// templateUrl: "app/encounter-builder/encounter-builder.html",
					// controller: 'EncounterBuilderController',
					controllerAs: "vm"
				}
			}
		];
	}

})();

