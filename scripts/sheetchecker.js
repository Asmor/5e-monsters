"use strict";
var SC = angular.module("app", []);

SC.directive("sheetChecker", function (googleSheetLoader) {
	// window.all = monsters.all;
	var template = document.getElementById("sheet-checker-template").innerHTML;
	return {
		restrict: "E",
		template: template,
		scope: {},
		link: function (scope) {
			scope.messages = [];
			scope.sheetId = "";
			// Just a shortcut
			function log(message) {
				scope.messages.push({message: message});
			}

			function err(fid, field, reason, value) {
				scope.messages.push({
					fid: fid,
					field: field,
					reason: reason,
					value: value
				});
			}

			scope.test = function () {
				scope.messages.length = 0;


				var idMatch = scope.sheetId.match(/\b([-a-z0-9_]{44})\b/i);

				if ( !idMatch ) {
					log("Can't find valid google sheets ID in: " + scope.sheetId);
					return;
				}

				var id = idMatch[1];

				log("Attempting to load ID:" + id);
				log("If it doesn't load, make sure you've published it (not just shared!) File -> Publish to the web");

				googleSheetLoader.loadIndex(id, { noCache: true })
				.then(function (index) {
					return index.loadSheets();
				})
				.then(function (sheets) {
					// Remove the message about publishing
					scope.messages.pop();
					var startingMessageLength = scope.messages.length;

					// Check all sheets are present
					if ( !sheets.Monsters || !sheets.Sources ) {
						if ( !sheets.Monsters ) {
							log("Missing Monsters sheet");
						}
						if ( !sheets.Sources ) {
							log("Missing Sources sheet");
						}
						return;
					}

					// Check monsters
					var used = {
						fid: {},
						name: {}
					};
					var monsterSources = {};
					sheets.Monsters.forEach(function (row) {
						var { fid, name, cr, size, type, tags, section, alignment, environment, ac, hp, init, lair, legendary, unique, sources, special } = row;

						// Make sure fid and name are present and unique
						["fid", "name"].forEach(function (key) {
							var val = row[key];
							if ( !val ) {
								log("Missing " + key + ": " + JSON.stringify(row));
							}

							if ( used[key][val] ) {
								log("Duplicate " + key + ": " + val);
							}
						});

						if ( !fid || !name ) {
							// All the errors use fid, so error messages are going to be meaningless at this point
							return;
						}

						var fidMatch = fid.match(/^([-\w]+\.)([-\w]+)$/);

						if ( !fidMatch ) {
							err(fid, "fid", "Invalid fid", fid);
						} else {
							var expectedFid = fidMatch[1] + name
									.toLowerCase()
									.replace(/ /g, "-")
									.replace(/--+/g, "-")
									.replace(/[^-a-z0-9]/g, "");

							if ( expectedFid !== fid ) {
								err(fid, "fid", "Possibly improper fid, expected " + expectedFid, fid);
							}
						}

						if ( special ) {
							// These are the placeholders and are missing a lot of stuff everything else require
							return;
						}

						// CR
						if ( !cr ) {
							err(fid, "cr", "Missing cr");
						} else if ( !cr.match(/^(1\/[248]|[12]?\d|30)$/) ) {
							err(fid, "cr", "Invalid CR", cr);
						}

						// size
						if ( !size ) {
							err(fid, "size", "Missing size");
						} else if ( !size.match(/^(Tiny|Small|Medium|Large|Huge|Gargantuan)$/) ) {
							err(fid, "size", "Unknown size", size);
						}

						// type
						if ( !type ) {
							err(fid, "type", "Missing type");
						} else if ( !type.match(/^(Aberration|Beast|Celestial|Construct|Dragon|Elemental|Fey|Fiend|Giant|Humanoid|Monstrosity|Ooze|Plant|Undead)$/) ) {
							err(fid, "type", "Unknown type", type);
						}

						// tags (not tested)
						// section (not tested)

						// environment
						(environment || "").split(/\s*,\s*/).forEach(function (env) {
							if ( env === "" ) {
								return;
							}

							if ( !env.match(/^(aquatic|arctic|cave|coast|desert|dungeon|forest|grassland|mountain|planar|ruins|swamp|underground|urban)$/) ) {
								err(fid, "environment", "Unknown environment", env);
							}
						});
						// ac
						// hp
						// init
						// alignment (too complicated to test for real, just check it exists)
						["ac", "hp", "init", "alignment"].forEach(function (key) {
							if ( !row[key] ) {
								err(fid, key, "Missing " + key);
							}
						});

						// lair
						// legendary
						// unique
						["lair", "legendary", "unique"].forEach(function (key) {
							if ( row[key] && row[key] !== key ) {
								err(fid, key, "Must be blank or " + key, row[key]);
							}
						});

						// sources
						if ( !sources ) {
							err(fid, "sources", "Missing sources");
						} else {
							sources.split(", ").forEach(function (rawSource) {
								var sourceMatch = rawSource.match(/([^:]*): (.*)/);

								if ( !sourceMatch ) {
									// Just a source with no page or URL
									return { name: rawSource };
								}

								var name = sourceMatch[1];
								var where = sourceMatch[2];

								monsterSources[name] = fid;

								if ( where && !where.match(/^\d+$|^https?:\/\//) ) {
									err(fid, "sources", "Invalid location. Should be either a page number or a URL", where);
								}
							});
						}
					});

					// Check the sources
					sheets.Sources.forEach(function (row) {
						["name", "shortname"].forEach(function (key) {
							if ( !row[key] ) {
								log("Missing " + key + " for a source: " + JSON.stringify(row));
							}
						});
						
						var name = row.name;
						if ( monsterSources[name] ) {
							delete monsterSources[name];
						} else {
							log("Missing source from monster list, or duplicated source: " + name);
						}
					});

					// Make sure all the sources from monsters are accounted for
					Object.keys(monsterSources).forEach(function (name) {
						err(monsterSources[name], "sources", "Source used by monster but not listed in sources sheet", name);
					});

					if ( startingMessageLength === scope.messages.length ) {
						log("No errors detected");
					}

					log("Done");
				});
			};
		},
	};
});
