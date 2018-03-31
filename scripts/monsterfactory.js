(function() {
	"use strict";

	angular.module("app")
		.factory("monsterFactory", MonsterFactory);

	MonsterFactory.$inject = ["alignments", "crInfo"];
	function MonsterFactory(alignments, crInfo) {
		var factory = {
			checkMonster: checkMonster,
			Monster: Monster,
		};

		function Monster(args) {
			var monster = this;
			monster.sheetId = args.sheetId;
			// guid is deprecated. Still need to work out plan to get rid of it, but for the time
			// being we can at least make it so new things don't need one by falling back to fid if
			// guid isn't supplied
			monster.id = args.guid || args.fid;
			monster.fid = args.fid;
			monster.name = args.name;
			monster.section = args.section;
			["ac", "hp", "init"].forEach(function (key) {
				// Try to parse each of these into a number, but if that fails then just give the
				// original string value, which presumably is either an empty string or something
				// complicated
				var parsed = Number.parseInt(args[key]);

				if ( isNaN(parsed) ) {
					parsed = args[key];
				}

				monster[key] = parsed;
			});
			monster.cr = crInfo[args.cr];
			monster.type = args.type;
			monster.tags = args.tags ? args.tags.split(/\s*,\s*/).sort() : null;
			monster.size = args.size;
			monster.alignment = parseAlignment(args.alignment);
			monster.environments = (args.environment || "").split(/\s*,\s*/).sort();
			// Special, legendary, lair, and unique are stored in spreadsheet as strings to make it
			// easy to read a row, but should be translated to booleans
			monster.special = !!args.special;
			monster.legendary = !!args.legendary;
			monster.lair = !!args.lair;
			monster.unique = !!args.unique;
			monster.sources = args.sources
				.split(/\s*,\s*/)
				.map(function (rawSource) {
					var sourceMatch = rawSource.match(/([^:]*): (.*)/);

					if ( !sourceMatch ) {
						// Just a source with no page or URL
						return { name: rawSource };
					}

					var name = sourceMatch[1];
					var where = sourceMatch[2];
					var out = {
						name: name,
					};

					if ( where.match(/^\d+$/) ) {
						out.page = Number.parseInt(where, 10);
						out.url = "https://www.dndbeyond.com/monsters/" + monster.name.toLowerCase().split(" ").join("-")
					} else {
						out.url = where;
					}

					return out;
				});

			monster.sizeSort = parseSize(monster.size);
			monster.searchable = [
				monster.name,
				monster.section,
				monster.type,
				monster.size,
				(monster.alignment) ? monster.alignment.text : "",
			].concat(
				monster.cr.string
			).concat(
				monster.tags
			).join("|").toLowerCase();
		}

		function parseAlignment(alignmentString) {
			var flags = (alignmentString || "")
				// alignmentString should be a string of alignments, seperated by commas, "or", or
				// commas followed by "or" (I'm pro-Oxford comma)
				.split(/\s*(,|or|,\s*or)\s*/i)
				.reduce(function (total, current) {
					return total | parseSingleAlignmentFlags(current);
				}, 0);

			if ( !flags ) {
				console.warn("Couldn't parse alignments: ", alignmentString);
				flags = alignments.unaligned.flags;
			}

			return {
				text: alignmentString,
				flags: flags,
			};
		}

		function parseSingleAlignmentFlags(alignment) {
			var flags;

			alignmentTestOrder.some(function (alignmentDefinition) {
				if ( alignment.match(alignmentDefinition.regex) ) {
					flags = alignmentDefinition.flags;
					return true;
				}
			});

			return flags;
		}

		// Check "neutral" and "any" last, since those are substrings found in more specific
		// alignments
		var alignmentTestOrder = [
			alignments.any_chaotic,
			alignments.any_evil,
			alignments.any_good,
			alignments.any_lawful,
			alignments.any_neutral,
			alignments.non_chaotic,
			alignments.non_evil,
			alignments.non_good,
			alignments.non_lawful,
			alignments.unaligned,
			alignments.lg,
			alignments.ng,
			alignments.cg,
			alignments.ln,
			alignments.cn,
			alignments.le,
			alignments.ne,
			alignments.ce,
			alignments.n,
			alignments.any,
		];

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

			var legendaryMap = {
				'Legendary': 'legendary',
				'Legendary (in lair)': 'lair',
				'Ordinary': false
			};

			if (filters.legendary) {
				var legendaryFilter = legendaryMap[filters.legendary];

				if (legendaryFilter) {
					if (!monster[legendaryFilter]) return false;
				} else  {
					if (monster.legendary || monster.lair) return false;
				}
			}

			if ( filters.type && monster.type !== filters.type ) {
				return false;
			}

			if ( filters.size && monster.size !== filters.size ) {
				return false;
			}

			if ( args.nonUnique && monster.unique ) {
				return false;
			}

			if ( filters.alignment ) {
				if ( !monster.alignment ) {
					return false;
				}

				if ( ! (filters.alignment.flags & monster.alignment.flags) ) {
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

		return factory;
	}
})();
