(function() {
	"use strict";

	angular.module("app")
		.filter("positive", function PositiveFilter() {
				return function ( input ) {
					input = input || '';
					var output = [],
						i;

					for ( i = 0; i < input.length; i++ ) {
						if ( input[i] > 0 ) {
							output.push(input[i]);
						}
					}

					return output;
				};
			})
		.filter("negative", function NegativeFilter() {
				return function ( input ) {
					input = input || '';
					var output = [],
						i;

					for ( i = 0; i < input.length; i++ ) {
						if ( input[i] < 0 ) {
							output.push(input[i]);
						}
					}

					return output;
				};
			});
})();
