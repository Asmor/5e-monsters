/* exported Monster */
/* exported addMonster */
/* exported monstersFilter */
/* exported registerMonster */
/* global tags */
/* global monsters */
/* global monstersByName */
"use strict";

function Monster(args) {
	var monster = this;
	monster.name = args.name;
	monster.section = args.section;
	monster.cr = args.cr;
	monster.type = args.type;
	monster.tags = (args.tags) ? args.tags.sort() : undefined;
	monster.size = args.size;
	monster.alignment = args.alignment;
	monster.legendary = args.legendary;
	monster.lair = args.lair;
	monster.sources = [];

	monster.crSort = parseCr(monster.cr[0]);
	monster.sizeSort = parseSize(monster.size);
}

function addMonster(args) {
	var monster = new Monster(args);

	monsters.push(monster);
	monstersByName[monster.name] = monster;

	if (args.tags) {
		register(tags, args.tags);
	}
}

function parseCr(cr) {
	switch ( cr ) {
		case "1/8": return 0.125;
		case "1/4": return 0.25;
		case "1/2": return 0.5;
		default: return parseInt( cr );
	}
}

function parseSize(size) {
	switch ( size ) {
		case "Tiny": return 1;
		case "Small": return 2;
		case "Medium": return 3;
		case "Large": return 4;
		case "Huge": return 5;
		case "Gargantuan": return 6;
		default: return -1;
	}
}

function register(target, entries, propName) {
	for ( var i = 0; i < entries.length; i++ ) {
		if ( propName ) {
			target[entries[i][propName]] = true;
		} else {
			target[entries[i]] = true;
		}
	}
}

function monstersFilter() {
	return function ( input, filters ) {
		var output = [], i;

		for ( i = 0; i < input.length; i++ ) {
			if ( checkMonster(input[i], filters) ) {
				output.push(input[i]);
			}
		}

		// Monsters are already sorted by name
		if ( filters.sort === "size" ) {
			output.sort(function (a, b) {
				return (a.sizeSort > b.sizeSort) ? 1 : -1;
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
				return a.crSort - b.crSort;
			});
		}

		return output;
	};
}

function checkMonster(monster, filters) {
	if ( filters.type && monster.type !== filters.type ) {
		return false;
	}

	if ( filters.size && monster.size !== filters.size ) {
		return false;
	}

	if ( filters.alignment ) {
		if ( !monster.alignment ) {
			return false;
		}

		if ( !(
			filters.alignment.lg && monster.alignment.lg ||
			filters.alignment.ln && monster.alignment.ln ||
			filters.alignment.le && monster.alignment.le ||
			filters.alignment.ng && monster.alignment.ng ||
			filters.alignment.n  && monster.alignment.n  ||
			filters.alignment.ne && monster.alignment.ne ||
			filters.alignment.cg && monster.alignment.cg ||
			filters.alignment.cn && monster.alignment.cn ||
			filters.alignment.ce && monster.alignment.ce
		) ) {
			return false;
		}
	}

	if ( filters.minCr && !meetsMinCr(monster, filters.minCr) ) {
		return false;
	}

	if ( filters.maxCr && !meetsMaxCr(monster, filters.maxCr) ) {
		return false;
	}

	if ( !isInSource(monster, filters.source) ) {
		return false;
	}

	return true;
}

function meetsMinCr(monster, cr) {
	var i, crValue;

	for ( i = 0; i < monster.cr.length; i++ ) {
		crValue = parseCr(monster.cr[i]);
		if ( crValue >= cr ) {
			return true;
		}
	}

	return false;
}

function meetsMaxCr(monster, cr) {
	var i, crValue;

	for ( i = 0; i < monster.cr.length; i++ ) {
		crValue = parseCr(monster.cr[i]);
		if ( crValue <= cr ) {
			return true;
		}
	}

	return false;
}

function isInSource(monster, sources) {
	for ( var i = 0; i < monster.sources.length; i++ ) {
		if ( sources[monster.sources[i].name] ) {
			return true;
		}
	}

	return false;
}

function registerMonster(name, source, page) {
	if ( ! monstersByName[name] ) {
		console.warn("Unable to find", name, source);
		return;
	}

	monstersByName[name].sources.push({ name: source, page: page });
}