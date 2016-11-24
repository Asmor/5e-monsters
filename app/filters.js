"use strict";

define([
	"scripts/monsterfactory"
], function (
	monsterLib
) {
	return {
		monster: function () {
			return function ( input, filters ) {
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
		},
		negative: function () {
			return function ( input ) {
				var output = [],
					i;

				for ( i = 0; i < input.length; i++ ) {
					if ( input[i] < 0 ) {
						output.push(input[i]);
					}
				}

				return output;
			};
		},
		positive: function () {
			return function ( input ) {
				var output = [],
					i;

				for ( i = 0; i < input.length; i++ ) {
					if ( input[i] > 0 ) {
						output.push(input[i]);
					}
				}

				return output;
			};
		},
		sortEncounter: function () {
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
		},
	};
});
