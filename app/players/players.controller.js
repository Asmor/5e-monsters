(function() {
'use strict';

	angular
		.module('app')
		.controller('PlayersController', PlayersController);

	PlayersController.$inject = [];
	
	function PlayersController() {
		var vm = this;

		activate();

		////////////////

		function activate() { }
	}
})();
