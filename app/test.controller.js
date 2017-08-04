(function() {
	'use strict';

	angular.module("app")
		.controller('TestController', TestController);

	TestController.$inject = ['misc', 'AppVersion', 'combatConstants',
		'sources',
		'store',
		'shuffle',
		'players',
		'library',
		'actionQueue',
		'crInfo',
		'alignments',
		'monsterFactory',
		'metaInfo',
		'monsterData',
		'randomEncounter',
		'encounter',
		'filters'
	];

	function TestController(miscLib, appVersion) {
		var vm = this;
		vm.appVersion = appVersion;
	}
})();