"use strict";

define([
	// Monsters MUST be the first dependency! All subsequent dependencies are assumed to be sources
	// and passed as a slice
	"scripts/data/monsters",
	"scripts/data/basicrules",
	"scripts/data/custom",
	"scripts/data/hotdq",
	"scripts/data/hotdqsup",
	"scripts/data/monstermanual",
	"scripts/data/playershandbook",
], function (monsters) {
	return {
		monsters: monsters,
		sources: Array.slice(arguments, 1),
	};
});

/*
*/
