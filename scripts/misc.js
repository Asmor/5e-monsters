"use strict";

define(function () {
	var crs = [],
		sourceFilters = {},
		sources = [],
		tags = {},
		levels = [
			{ level: 1,		easy: 25,	medium: 50,		hard: 75,	deadly: 100 },
			{ level: 2,		easy: 50,	medium: 100,	hard: 150,	deadly: 200 },
			{ level: 3,		easy: 75,	medium: 150,	hard: 225,	deadly: 400 },
			{ level: 4,		easy: 125,	medium: 250,	hard: 375,	deadly: 500 },
			{ level: 5,		easy: 250,	medium: 500,	hard: 750,	deadly: 1100 },
			{ level: 6,		easy: 300,	medium: 600,	hard: 900,	deadly: 1400 },
			{ level: 7,		easy: 350,	medium: 750,	hard: 1100,	deadly: 1700 },
			{ level: 8,		easy: 450,	medium: 900,	hard: 1400,	deadly: 2100 },
			{ level: 9,		easy: 550,	medium: 1100,	hard: 1600,	deadly: 2400 },
			{ level: 10,	easy: 600,	medium: 1200,	hard: 1900,	deadly: 2800 },
			{ level: 11,	easy: 800,	medium: 1600,	hard: 2400,	deadly: 3600 },
			{ level: 12,	easy: 1000,	medium: 2000,	hard: 3000,	deadly: 4500 },
			{ level: 13,	easy: 1100,	medium: 2200,	hard: 3400,	deadly: 5100 },
			{ level: 14,	easy: 1250,	medium: 2500,	hard: 3800,	deadly: 5700 },
			{ level: 15,	easy: 1400,	medium: 2800,	hard: 4300,	deadly: 6400 },
			{ level: 16,	easy: 1600,	medium: 3200,	hard: 4800,	deadly: 7200 },
			{ level: 17,	easy: 2000,	medium: 3900,	hard: 5900,	deadly: 8800 },
			{ level: 18,	easy: 2100,	medium: 4200,	hard: 6300,	deadly: 9500 },
			{ level: 19,	easy: 2400,	medium: 4900,	hard: 7300,	deadly: 10900 },
			{ level: 20,	easy: 2800,	medium: 5700,	hard: 8500,	deadly: 12700 },
		],
		i;

	crs.push({ text: "0", value: 0 });
	crs.push({ text: "1/8", value: 0.125 });
	crs.push({ text: "1/4", value: 0.25 });
	crs.push({ text: "1/2", value: 0.5 });
	for ( i = 1; i < 25; i++ ) {
		crs.push({ text: i.toString(), value: i });
	}

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

	// function getShuffledMonsterList(cr) {
	// 	var monsters = crInfo[cr].monsters.slice(0);

	// 	return shuffle(monsters);
	// }

	function partialFactory(moduleName) {
		return function ( partialName, base ) {
			return [
				base || moduleName,
				partialName,
				".html",
			].join("");
		};
	}

	function d(n) {
		return Math.floor(Math.random() * n) + 1;
	}

	return {
		d: d,
		getMultiplier: getMultiplier,
		levels: levels,
		partialFactory: partialFactory,
		sourceFilters: sourceFilters,
		sources: sources,
		tags: tags,
	};
});