"use strict";

define([
	// Monsters MUST be the first dependency! All subsequent dependencies are assumed to be sources
	// and passed as a slice
	"scripts/data/monsters",
	"scripts/data/basicrules",
	"scripts/data/custom",
	"scripts/data/hotdq",
	"scripts/data/hotdqsup",
	"scripts/data/rot", 
	"scripts/data/curseofstrahd", 
	"scripts/data/monstermanual",
	"scripts/data/playershandbook",
	"scripts/data/princes",
	"scripts/data/princessupplement",
	"scripts/data/outoftheabyss",
	"scripts/data/monsteraday",
	"scripts/data/fiftheditionfoes",
	"scripts/data/primevalthule",
	"scripts/data/primevalthulegmc",
], function (monsters) {
	return {
		monsters: monsters,
		sources: Array.prototype.slice.call(arguments, 1),
	};
});
