(function() {
	"use strict";

	angular.module("app")
		.filter("monstersFilter", SortAndFilterMonsters);

	SortAndFilterMonsters.$inject = ["monsterFactory"];

	function SortAndFilterMonsters(monsterLib) {
		return function ( input, filters ) {
			if (!input) return [];
			var output = [], i;

			for ( i = 0; i < input.length; i++ ) {
				if ( monsterLib.checkMonster(input[i], filters) ) {
					output.push(input[i]);
				}
			}

			// Monsters are already sorted by name
			if ( filters.sort === "size" ) {
				output.sort(function (a, b) {
					return a.sizeSort - b.sizeSort;
				});
			} else if ( filters.sort === "type" ) {
				output.sort(function (a, b) {
					return (a.type > b.type) ? 1 : -1;
				});
			} else if ( filters.sort === "alignment" ) {
				output.sort(function (a, b) {
					return ((a.alignment||{text:"zzzzzzz"}).text > (b.alignment||{text:"zzzzzzz"}).text) ? 1 : -1;
				});
			} else if ( filters.sort === "cr" ) {
				output.sort(function (a, b) {
					return a.cr.numeric - b.cr.numeric;
				});
			}

			return output;
		};
	}
})();
