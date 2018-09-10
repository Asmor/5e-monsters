"use strict";
var SC = angular.module("app", []);

SC.directive("sheetChecker", function (testSheet) {
	// window.all = monsters.all;
	var template = document.getElementById("sheet-checker-template").innerHTML;

	function getSheetId(s) {
		var idMatch = s.match(/\b([-a-z0-9_]{44})\b/i);

		if ( idMatch ) {
			return idMatch[1];
		}

		return s;
	}

	var sheetMetaStorageKey = "5em-sheet-meta";

	function getSheetMeta() {
		var json = localStorage[sheetMetaStorageKey];
		if ( json ) {
			return JSON.parse(json);
		}

		return {};
	}

	function addSheet({ name, sheetId }) {
		var sheetMetaData = getSheetMeta();

		if ( sheetMetaData[sheetId] ) {
			alert("This sheet is already saved as \"" + sheetMetaData[sheetId].name + "\"");
			return;
		}

		sheetMetaData[sheetId] = {
			name: name,
			timestamp: 0,
			custom: true,
		};

		localStorage[sheetMetaStorageKey] = JSON.stringify(sheetMetaData);
		alert(name + " added. If KFC is already open, refresh it to see your new content.");
	}

	return {
		restrict: "E",
		template: template,
		scope: {},
		link: function (scope) {
			scope.messages = [];
			scope.sheetId = "";
			scope.name = "";
			scope.untested = true;
			scope.sharableLink = "";

			var sheetParamMatch = document.location.search.match(/\bsheetid=([-a-z0-9_]{44})\b/i);
			var nameParamMatch = document.location.search.match(/\bname=([^&]+)($|&)/i);
			scope.viaSharable = sheetParamMatch && nameParamMatch;
			scope.secureType = "HTTP";
			scope.otherType = "HTTPS";
			scope.otherTypeLink = document.location.toString().replace(/^http:/, "https:");

			if ( document.location.protocol === "https:" ) {
				scope.secureType = "HTTPS";
				scope.otherType = "HTTP";
				scope.otherTypeLink = document.location.toString().replace(/^https:/, "http:");
			}


			if ( sheetParamMatch ) {
				scope.sheetId = sheetParamMatch[1];
			}

			if ( nameParamMatch ) {
				scope.name = decodeURIComponent(nameParamMatch[1]);
			}

			scope.test = function () {
				scope.messages = [{ message: "Loading..." }]
				scope.untested = true;
				scope.sharableLink = "";
				scope.sheetId = getSheetId(scope.sheetId);

				testSheet(scope.sheetId)
				.then(results => {
					scope.messages = results;
					scope.untested = false;
					scope.generateSharableLink();
				})
				.catch(results => {
					scope.messages = results;
				});
			};

			if ( sheetParamMatch && nameParamMatch ) {
				scope.test();
			}

			scope.generateSharableLink = function () {
				if ( !scope.name ) {
					scope.sharableLink = "";
					return;
				}

				if ( !scope.untested ) {
					scope.sharableLink = document.location
						.toString()
						.match(/^[^\?]+/)[0]
						+ "?"
						+ [
							"name=" + encodeURIComponent(scope.name),
							"sheetid=" + scope.sheetId,
						].join("&");
				}
			};

			scope.$watch("name", scope.generateSharableLink);
			scope.$watch("sheetId", () => {
				scope.untested = true;
			});

			scope.add = function () {
				addSheet({
					name: scope.name,
					sheetId: scope.sheetId,
				});
			}
		},
	};
});
SC.factory("testSheet", testSheet);

testSheet.$inject = ["googleSheetLoader"];
function testSheet(googleSheetLoader) {
	var FAIL = "fail";
	var WARN = "warn";
	var GOOD = "good";

	var messages = [];

	function log(message) {
		messages.push({message: message});
	}

	function err({ fid, field, reason, value, severity }) {
		messages.push({ fid, field, reason, value, severity: severity || GOOD });

		if ( severity === FAIL ) {
			fail = true;
		}
	}

	var fail = false;

	return function (sheetId) {
		messages.length = 0;
		fail = false;

		var idMatch = sheetId.match(/\b([-a-z0-9_]{44})\b/i);

		if ( !idMatch ) {
			log("Can't find valid google sheets ID in: " + sheetId);
			return;
		}

		var id = idMatch[1];

		log("Attempting to load ID:" + id);
		log("If it doesn't load, make sure you've published it (not just shared!) File -> Publish to the web");

		return googleSheetLoader.loadIndex(id, { noCache: true })
		.then(function (index) {
			return index.loadSheets();
		})
		.then(function (sheets) {
			// Remove the message about publishing
			messages.pop();
			var startingMessageLength = messages.length;

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
					err({
						fid,
						field: "fid",
						reason: "Invalid fid",
						value: fid,
						severity: FAIL,
					});
				} else {
					var expectedFid = fidMatch[1] + name
							.toLowerCase()
							.replace(/ /g, "-")
							.replace(/--+/g, "-")
							.replace(/[^-a-z0-9]/g, "");

					if ( expectedFid !== fid ) {
						err({
							fid,
							field: "fid",
							reason: "Possibly improper fid, expected " + expectedFid,
							value: fid,
							severity: WARN,
						});
					}
				}

				if ( special ) {
					// These are the placeholders and are missing a lot of stuff everything else require
					return;
				}

				// CR
				if ( !cr ) {
					err({
						fid,
						field: "cr",
						reason: "Missing cr",
						severity: FAIL,
					});
				} else if ( !cr.match(/^(1\/[248]|[12]?\d|30)$/) ) {
					err({
						fid,
						field: "cr",
						reason: "Invalid CR",
						value: cr,
						severity: FAIL,
					});
				}

				// size
				if ( !size ) {
					err({
						fid,
						field: "size",
						reason: "Missing size",
						severity: FAIL,
					});
				} else if ( !size.match(/^(Tiny|Small|Medium|Large|Huge|Gargantuan)$/) ) {
					err({
						fid,
						field: "size",
						reason: "Unknown size",
						value: size,
						severity: FAIL,
					});
				}

				// type
				if ( !type ) {
					err({
						fid,
						field: "type",
						reason: "Missing type",
						severity: FAIL,
					});
				} else if ( !type.match(/^(Aberration|Beast|Celestial|Construct|Dragon|Elemental|Fey|Fiend|Giant|Humanoid|Monstrosity|Ooze|Plant|Undead)$/) ) {
					err({
						fid,
						field: "type",
						reason: "Unknown type",
						value: type,
						severity: FAIL,
					});
				}

				// tags (not tested)
				// section (not tested)

				// environment
				(environment || "").split(/\s*,\s*/).forEach(function (env) {
					if ( env === "" ) {
						return;
					}

					if ( !env.match(/^(aquatic|arctic|cave|coast|desert|dungeon|forest|grassland|mountain|planar|ruins|swamp|underground|urban)$/) ) {
						err({
							fid,
							field: "environment",
							reason: "Unknown environment",
							value: env,
							severity: FAIL,
						});
					}
				});
				// ac
				// hp
				// init
				// alignment (too complicated to test for real, just check it exists)
				["ac", "hp", "init", "alignment"].forEach(function (key) {
					if ( !row[key] ) {
						err({
							fid,
							field: key,
							reason: "Missing " + key,
							severity: FAIL,
						});
					}
				});

				// lair
				// legendary
				// unique
				["lair", "legendary", "unique"].forEach(function (key) {
					if ( row[key] && row[key] !== key ) {
						err({
							fid,
							field: key,
							reason: "Must be blank or " + key,
							value: row[key],
							severity: FAIL,
						});
					}
				});

				// sources
				if ( !sources ) {
					err({
						fid,
						field: "sources",
						reason: "Missing sources",
						severity: FAIL,
					});
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
							err({
								fid,
								field: "sources",
								reason: "Invalid location. Should be either a page number or a URL",
								value: where,
								severity: FAIL,
							});
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
				err({
					fid: monsterSources[name],
					field: "sources",
					reason: "Source used by monster but not listed in sources sheet",
					value: name,
					severity: FAIL,
				});
			});

			if ( startingMessageLength === messages.length ) {
				log("No errors detected");
			}

			log("Done");

			if ( fail ) {
				throw messages;
			}

			return messages;
		});
	};
}
