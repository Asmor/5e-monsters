(function() {
	"use strict";

	angular.module("app").factory("monsters", Monsters);

	// https://docs.google.com/spreadsheets/d/19ngAA7d1eYKiBtKTsg8Qcsq_zhDSBzEMxXS45eCdd7I/edit
	var masterSheetId = "19ngAA7d1eYKiBtKTsg8Qcsq_zhDSBzEMxXS45eCdd7I";
	var all = [];
	var byId = {};
	var byCr = {};
	var loaded = {};

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
		window.loadSheet = loadSheet;

		return {
			all: all,
			byCr: byCr,
			byId: byId,
			check: monsterFactory.checkMonster,
			loadSheet: loadSheet,
		};
	}

	function loadMonsters($rootScope, googleSheetLoader, miscLib, monsterFactory, sheetId, custom) {
		googleSheetLoader(sheetId)
		.then(function (sheets) {
			sheets.Monsters.forEach(function (monsterData) {
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

			sheets.Sources.forEach(function (sourceData) {
				var name = sourceData.name;
				var shortName = sourceData.shortname;
				var initialState = custom || !!(sourceData.defaultselected || "").match(/yes/i);

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
})();
