(function() {
	"use strict";

	angular.module("app")
		.factory('misc', MiscService);

	function MiscService() {

		var crs = [],
			sourceFilters = {},
			sources = [],
			sourcesByType = {},
			shortNames = {},
			tags = {},
			i;

		crs.push({ text: "0", value: 0 });
		crs.push({ text: "1/8", value: 0.125 });
		crs.push({ text: "1/4", value: 0.25 });
		crs.push({ text: "1/2", value: 0.5 });
		for ( i = 1; i < 25; i++ ) {
			crs.push({ text: i.toString(), value: i });
		}

		var service = {		
			getMultiplier: getMultiplier,
			sourceFilters: sourceFilters,
			sources: sources,
			sourcesByType: sourcesByType,
			shortNames: shortNames,
			tags: tags,
		};

		return service;

		//////

		function getMultiplier(playerCount, monsterCount) {
			var multiplierCategory,
				multipliers = [
					0.5,
					1,
					1.5,
					2,
					2.5,
					3,
					4,
					5,
				];

			if ( monsterCount === 0 ) {
				return 0;
			} else if ( monsterCount === 1 ) {
				multiplierCategory = 1;
			} else if ( monsterCount === 2 ) {
				multiplierCategory = 2;
			} else if ( monsterCount < 7 ) {
				multiplierCategory = 3;
			} else if ( monsterCount < 11 ) {
				multiplierCategory = 4;
			} else if ( monsterCount < 15 ) {
				multiplierCategory = 5;
			} else {
				multiplierCategory = 6;
			}

			if ( playerCount < 3 ) {
				// Increase multiplier for parties of one and two
				multiplierCategory++;
			} else if ( playerCount > 5 ) {
				// Decrease multiplier for parties of six through eight
				multiplierCategory--;
			}

			return multipliers[multiplierCategory];
		}
	}
})();
