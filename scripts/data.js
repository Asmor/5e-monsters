(function() { 
	"use strict";

	angular.module("app")
		.factory("monsterData", MonsterData);

	MonsterData.$inject = [
		"monsterStats"
		// "basicRules"
		// "custom",
		// "hotdq",
		// "hotdqsup",
		// "rot", 
		// "curseofstrahd",
		// "stormkingsthunder",  
		// "monstermanual",
		// "playershandbook",
		// "princes",
		// "princessupplement",
		// "outoftheabyss",
		// "monsteraday",
		// "fiftheditionfoes",
		// "primevalthule",
		// "primevalthulegmc",
		// "tomeofbeasts", 
		// "volosguidetomonsters"
	];

	function MonsterData(monsters) {
		var data = {
			monsters: monsters,
			sources: Array.prototype.slice.call(arguments, 1)
		};

		// require([
		// 	// Monsters MUST be the first dependency! All subsequent dependencies are assumed to be sources
		// 	// and passed as a slice
		// 	"scripts/data/monsters",
		// 	"scripts/data/basicrules",
		// 	"scripts/data/custom",
		// 	"scripts/data/hotdq",
		// 	"scripts/data/hotdqsup",
		// 	"scripts/data/rot", 
		// 	"scripts/data/curseofstrahd",
		// 	"scripts/data/stormkingsthunder",  
		// 	"scripts/data/monstermanual",
		// 	"scripts/data/playershandbook",
		// 	"scripts/data/princes",
		// 	"scripts/data/princessupplement",
		// 	"scripts/data/outoftheabyss",
		// 	"scripts/data/monsteraday",
		// 	"scripts/data/fiftheditionfoes",
		// 	"scripts/data/primevalthule",
		// 	"scripts/data/primevalthulegmc",
		// 	"scripts/data/tomeofbeasts", 
		// 	"scripts/data/volosguidetomonsters", 
		// ], function (monsters) {

		return data;
		// });
	}
})();

