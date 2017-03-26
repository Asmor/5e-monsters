(function() {
	"use strict";

	angular.module("app").factory("monsters", Monsters);

	// https://docs.google.com/spreadsheets/d/19ngAA7d1eYKiBtKTsg8Qcsq_zhDSBzEMxXS45eCdd7I/edit
	var masterSheetId = "19ngAA7d1eYKiBtKTsg8Qcsq_zhDSBzEMxXS45eCdd7I";
	var all = [];
	var byId = {};
	var byCr = {};
	var loaded = {};
	var sourcesById = {};

	Monsters.$inject = ["$rootScope", "googleSheetLoader", "misc", "monsterFactory"];
	function Monsters($rootScope, googleSheetLoader, miscLib, monsterFactory) {
		function loadSheet(sheetId, custom) {
			if ( loaded[sheetId] ) {
				// Don't allow a source to be loaded multiple times
				return;
			}

			loaded[sheetId] = true;

			loadMonsters($rootScope, googleSheetLoader, miscLib, monsterFactory, sheetId, custom);
		}

		loadSheet(masterSheetId);

		return {
			all: all,
			byCr: byCr,
			byId: byId,
			check: monsterFactory.checkMonster,
			loadSheet: loadSheet,
			removeSheet: removeSheet.bind(null, miscLib),
		};
	}

	function loadMonsters($rootScope, googleSheetLoader, miscLib, monsterFactory, sheetId, custom) {
		googleSheetLoader(sheetId)
		.then(function (sheets) {
			sheets.Monsters.forEach(function (monsterData) {
				monsterData.sheetId = sheetId;
				var monster = new monsterFactory.Monster(monsterData);

				all.push(monster);
				byId[monster.id] = monster;

				if ( ! monster.special ) {
					if ( ! byCr[monster.cr.string] ) {
						byCr[monster.cr.string] = [];
					}

					byCr[monster.cr.string].push(monster);
				}
			});

			sourcesById[sheetId] = [];
			sheets.Sources.forEach(function (sourceData) {
				var name = sourceData.name;
				var shortName = sourceData.shortname;
				var initialState = custom || !!(sourceData.defaultselected || "").match(/yes/i);

				sourcesById[sheetId].push(name);
				miscLib.sources.push(name);
				miscLib.sourceFilters[name] = initialState;
				miscLib.shortNames[name] = shortName;

				if ( custom ) {
					$rootScope.$broadcast("custom-source-added", name);
				}
			});

			miscLib.sources.sort();

			all.sort(function (a, b) {
				return (a.name > b.name) ? 1 : -1;
			});
		});
	}

	function removeSheet(miscLib, id) {
		var i = 0;
		while ( all[i] ) {
			if ( all[i].sheetId === id ) {
				all.splice(i, 1);
			} else {
				i++;
			}
		}

		if ( !sourcesById[id] ) {
			return;
		}

		sourcesById[id].forEach(function (sourceName) {
			i = miscLib.sources.indexOf(sourceName);
			miscLib.sources.splice(i, 1);
			delete miscLib.sourceFilters[name];
			delete miscLib.shortNames[name];
		});

		delete sourcesById[id];
	}
})();
