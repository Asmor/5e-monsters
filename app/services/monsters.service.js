(function() {
	"use strict";

	angular.module("app").factory("monsters", Monsters);

	// https://docs.google.com/spreadsheets/d/19ngAA7d1eYKiBtKTsg8Qcsq_zhDSBzEMxXS45eCdd7I/edit
	var masterSheetId = "19ngAA7d1eYKiBtKTsg8Qcsq_zhDSBzEMxXS45eCdd7I";

	Monsters.$inject = [
		"googleSheetLoader",
		"misc",
		"monsterFactory",
	];

	function Monsters(
		googleSheetLoader,
		miscLib,
		monsterFactory
	) {
		var registedSources = {};
		var all = [];
		var byId = {};
		var byCr = {};

window.monsters = all;
		googleSheetLoader(masterSheetId)
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
				var initialState = !!(sourceData.defaultselected || "").match(/yes/i);

				if ( registedSources[name] ) {
					return;
				}

				registedSources[name] = true;

				miscLib.sources.push(name);
				miscLib.sourceFilters[name] = initialState;
				miscLib.shortNames[name] = shortName;
			});

			all.sort(function (a, b) {
				return (a.name > b.name) ? 1 : -1;
			});
		});

		return {
			all: all,
			byCr: byCr,
			byId: byId,
			check: monsterFactory.checkMonster,
		};
	}
})();
