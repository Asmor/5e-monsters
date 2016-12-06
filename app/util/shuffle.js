(function () {
	"use strict";

	angular.module("app")
		.factory('shuffle', Shuffle);

	// via http://bost.ocks.org/mike/shuffle/

	function Shuffle() {
		return function (array) {
			var m = array.length, t, i;

			while (m) {
				i = Math.floor(Math.random() * m--);

				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}

			return array;
		};
	}
})();
