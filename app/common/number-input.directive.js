(function() {
	"use strict";

	angular.module('app')
		.directive('numberInput', NumberInput);

	function NumberInput() {
		return {
			restrict: "E",
			scope: {},
			bindToController: {
				value: '=model',
				mods: '=buttons',
				nonNegative: '=nonNegative'
			},
			templateUrl: "app/common/number-input.html",
			controller: 'NumberInputController',
			controllerAs: 'vm'
		};
	}
})();
