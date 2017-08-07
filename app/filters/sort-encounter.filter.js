(function() {
	'use strict';

	angular.module('app')
		.filter('sortEncounter', SortEncounter);

	function SortEncounter() {
		return function (items) {
			var sorted = [];

			Object.keys(items).forEach(function (key) {
				sorted.push(items[key]);
			});

			sorted.sort(function (a, b) {
				return (a.monster.name > b.monster.name) ? 1 : -1;
			});

			return sorted;
		};
	}
})();