/* exported Monster */
/* exported addMonster */
/* exported monstersFilter */
/* exported registerMonster */
/* global alignments */
/* global crInfo */
/* global tags */
/* global monsters */
/* global monstersById */
"use strict";

function Monster(args) {
	var monster = this;
	monster.id = args.id;
	monster.name = args.name;
	monster.section = args.section;
	monster.ac = args.ac;
	monster.hp = args.hp;
	monster.init = args.init;
	monster.cr = crInfo[args.cr];
	monster.type = args.type;
	monster.tags = (args.tags) ? args.tags.sort() : undefined;
	monster.size = args.size;
	monster.alignment = args.alignment || alignments.unaligned;
	monster.special = args.special;
	monster.environments = (args.environments) ? args.environments.sort() : [];
	monster.legendary = args.legendary;
	monster.lair = args.lair;
	monster.sources = [];

	monster.sizeSort = parseSize(monster.size);
	monster.searchable = [
		monster.name,
		monster.section,
		monster.type,
		monster.size,
		(monster.alignment) ? monster.alignment.text : "",
	].concat(
		monster.cr
	).concat(
		monster.tags
	).join("|").toLowerCase();
}

function addMonster(args) {
	var monster = new Monster(args);

	monsters.push(monster);
	monstersById[monster.id] = monster;

	if ( !monster.special ) {
		crInfo[monster.cr.string].monsters.push(monster);
	}

	if (args.tags) {
		register(tags, args.tags);
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

function checkMonster(monster, filters, args) {
	args = args || {};

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
			filters.alignment.ce && monster.alignment.ce ||
			filters.alignment.unaligned && monster.alignment.unaligned
		) ) {
			return false;
		}
	}

	if ( !args.skipCrCheck ) {
		if ( filters.minCr && monster.cr.numeric < filters.minCr ) {
			return false;
		}

		if ( filters.maxCr && monster.cr.numeric > filters.maxCr ) {
			return false;
		}
	}

	if ( filters.environment && monster.environments.indexOf(filters.environment) === -1 ) {
		return false;
	}

	if ( !isInSource(monster, filters.source) ) {
		return false;
	}

	if ( filters.search && monster.searchable.indexOf(filters.search.toLowerCase()) === -1 ) {
		return false;
	}

	return true;
}

function isInSource(monster, sources) {
	if ( !monster ) {
		return false;
	}

	for ( var i = 0; i < monster.sources.length; i++ ) {
		if ( sources[monster.sources[i].name] ) {
			return true;
		}
	}

	return false;
}

function registerMonster(id, source, page) {
	// if ( !page ) return;
	for ( var i = 0; i < monsters.length; i++ ) {
		if (monsters[i].name === id) {
			console.log([
				"[ \"",
				monsters[i].id,
				"\", ",
				page || 0,
				" ], // ",
				id
			].join(""));
		}
	}

	if ( ! monstersById[id] ) {
		console.warn("Unable to find", id, source);
		return;
	}

	monstersById[id].sources.push({ name: source, page: page });
}
