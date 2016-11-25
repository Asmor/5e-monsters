(function() {
	"use strict";

	angular.module('app')
		.factory('util', UtilService);

	UtilService.$inject = ["misc"];

	function UtilService(miscLib) {
		var service = {
			d: miscLib.d,
			getShuffledMonsterList: miscLib.getShuffledMonsterList,
			partialFactory: miscLib.partialFactory,
		};
		
		return service;
	};
})();
