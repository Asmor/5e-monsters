"use strict";
define([
	"scripts/meta/alignments",
	"scripts/meta/crInfo",
], function (alignments, crInfo) {
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
		monster.unique = args.unique;
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

	function checkMonster(monster, filters, args) {
		args = args || {};

		if ( filters.type && monster.type !== filters.type ) {
			return false;
		}

		if ( filters.size && monster.size !== filters.size ) {
			return false;
		}

		if ( args.nonUnique && monster.unique ) {
			console.log("Skipped unique", monster.name);
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
		if ( !monster || !monster.sources) {
			return false;
		}

		for ( var i = 0; i < monster.sources.length; i++ ) {
			if ( sources[monster.sources[i].name] ) {
				return true;
			}
		}

		return false;
	}

	return {
		checkMonster: checkMonster,
		Monster: Monster,
	};
});