(function() {
	"use strict";

	angular.module("app")
		.factory("monsterFactory", MonsterFactory);

	MonsterFactory.$inject = ["alignments", "crInfo", "library"];
	function MonsterFactory(alignments, crInfo, library) {
		var factory = {
			checkMonster: checkMonster,
			checkIsMonsterFoundAndFiltered: checkIsMonsterFoundAndFiltered,
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
					} else {
						out.url = where;
					}

					return out;
				});

			monster.sortSources();

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
		Monster.prototype.merge = function (monster) {
			// If the same monster is found in multiple sheets, merge them. Right now that means just combining their sources.
			monster.sources.forEach(source => this.sources.push(source));
			this.sortSources();
		};
		Monster.prototype.sortSources = function () {
			this.sources.sort(sourceCompare);
		};

		const sourceCompare = (a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: "base" });

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

		var regexCache = {
			"": new RegExp(""),
		};
		var poolCache = {
		};
		var lastRegex = regexCache[""];
		function checkMonster(monster, filters, args) {
			return !isFiltered(monster, filters, args) && isNameMatched(monster, filters);
		}

		function checkIsMonsterFoundAndFiltered(monster, filters, args) {
			return isNameMatched(monster, filters) && isFiltered(monster, filters, args);
		}

		function isFiltered(monster, filters, args) {
			args = args || {};

			var legendaryMap = {
				'Legendary': 'legendary',
				'Legendary (in lair)': 'lair',
				'Ordinary': false
			};

			if (filters.legendary) {
				var legendaryFilter = legendaryMap[filters.legendary];

				if (legendaryFilter) {
					if (!monster[legendaryFilter]) return true;
				} else  {
					if (monster.legendary || monster.lair) return true;
				}
			}

			if ( filters.type && monster.type !== filters.type ) {
				return true;
			}

			if ( filters.size && monster.size !== filters.size ) {
				return true;
			}

			if ( args.nonUnique && monster.unique ) {
				return true;
			}

			if ( filters.alignment ) {
				if ( !monster.alignment ) {
					return true;
				}

				if ( ! (filters.alignment.flags & monster.alignment.flags) ) {
					return true;
				}
			}

			if ( !args.skipCrCheck ) {
				if ( filters.minCr && monster.cr.numeric < filters.minCr ) {
					return true;
				}

				if ( filters.maxCr && monster.cr.numeric > filters.maxCr ) {
					return true;
				}
			}

			if ( filters.environment && monster.environments.indexOf(filters.environment) === -1 ) {
				return true;
			}

			if ( filters.pool ) {
				let pool = poolCache[filters.pool];
				if (!pool) {
					pool = library.encounters.filter(encounter => encounter.type == 'pool' && encounter.name == filters.pool)[0];
					poolCache[filters.pool] = pool;
				}
				if ( pool && !pool.groups[monster.id] ) {
					return true;
				}
			}

			if ( !isInSource(monster, filters.source) ) {
				return true;
			}

			return false;
		}

		function isNameMatched(monster, filters) {
			if ( filters.search ) {
				let checkRegex = filters.search.match(/^\/(.*?)\/?$/);
				if ( checkRegex ) {
					let regex;
					let raw = checkRegex[1];
					try {
						// Two goals here.
						// 1. Avoid making new RegExp objects every time this function is run
						// 2. Maintain results while user is typing even if it might not be a valid regex after every keystroke

						// First check the cache to avoid remaking regex objects every time this
						// function is called (can be tens of thousands of times per keystroke)

						// If no cache hit, try to make a new regex. If that fails, we'll catch and
						// use the last good regex we have.

						// Finally, if we sucessfully get a cache hit or create a new regex, we'll
						// set lastRegex to this for future runs
						regex = regexCache[raw] || new RegExp(raw, "i");

						if ( regex ) {
							// This regex is good, so save it for the future
							lastRegex = regex;
						}
					} catch (ex) {
						// We know this doesn't give a good regex, so avoid trying again
						regexCache[raw] = null;
					}

					regex = regex || lastRegex;

					if ( !monster.searchable.match(regex) ) {
						return false;
					}
				} else if ( monster.searchable.indexOf(filters.search.toLowerCase()) === -1 ) {
					return false;
				}
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
