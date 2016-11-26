(function() { 
	"use strict";

	angular.module("app")
		.factory("monsterData", MonsterData);

	function MonsterData() {
		var data = {};

		require([
			// Monsters MUST be the first dependency! All subsequent dependencies are assumed to be sources
			// and passed as a slice
			"scripts/data/monsters",
			"scripts/data/basicrules",
			"scripts/data/custom",
			"scripts/data/hotdq",
			"scripts/data/hotdqsup",
			"scripts/data/rot", 
			"scripts/data/curseofstrahd",
			"scripts/data/stormkingsthunder",  
			"scripts/data/monstermanual",
			"scripts/data/playershandbook",
			"scripts/data/princes",
			"scripts/data/princessupplement",
			"scripts/data/outoftheabyss",
			"scripts/data/monsteraday",
			"scripts/data/fiftheditionfoes",
			"scripts/data/primevalthule",
			"scripts/data/primevalthulegmc",
			"scripts/data/tomeofbeasts", 
			"scripts/data/volosguidetomonsters", 
		], function (monsters) {
			data.monsters = monsters;
			data.sources = Array.prototype.slice.call(arguments, 1);
		});

		return data;
	}
})();

