"use strict";

define(function () {
	return function () {
		return {
			restrict: "E",
			scope: {
				value: '=model',
				mods: '=buttons',
				nonNegative: '=nonNegative'
			},
			templateUrl: "modules/common/number-input.html",
			link: function (scope) {
				scope.isNonNegative = function () {
					if (scope.nonNegative && scope.value === 0) {
						return "number-input--button__hidden";
					}
				};

				scope.modify = function (amt) {
					scope.value += amt;

					if ( scope.nonNegative && scope.value < 0 ) {
						scope.value = 0;
					}
				};
			},
		};
	};
});