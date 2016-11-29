(function() {
'use strict';

	angular
		.module('app')
		.controller('PlayersController', PlayersController);

	PlayersController.$inject = ['util'];
	
	function PlayersController(util) {
		var vm = this;
		vm.partial = util.partialFactory("app/players/partials/");

		activate();

		////////////////

		function activate() { }
	}
})();
