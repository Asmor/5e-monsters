(function() {
	"use strict";

	angular.module("app")
		.filter("countHiddenMonstersFilter", CountHiddenMonsters);

	CountHiddenMonsters.$inject = ["monsterFactory"];

	function CountHiddenMonsters(monsterLib) {
		return function ( input, filters ) {
			if (!input) return 0;
			var output = 0, i;

			for ( i = 0; i < input.length; i++ ) {
				if ( monsterLib.checkIsMonsterFoundAndFiltered(input[i], filters) ) {
					output++;
				}
			}

			return output;
		};
	}
})();
