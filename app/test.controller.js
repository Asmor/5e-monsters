(function() {
	'use strict';

	angular.module("app")
		.controller('TestController', TestController);

	TestController.$inject = ['misc', 'AppVersion', 'CombatReady', 'CombatNoMonsters', 'CombatNoPlayers',
		'util',
		'sources',
		'store',
		'shuffle',
		'players',
		'library'
	];

	function TestController(miscLib, appVersion) {
		var vm = this;
		vm.appVersion = appVersion;
	}
})();