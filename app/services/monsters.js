(function() {
	"use strict";

	angular.module("app")
		.factory("monsters", Monsters);

	Monsters.$inject = ['monsterData', 'misc', 'monsterFactory', 'metaInfo'];

	function Monsters(data, miscLib, monsterLib, metaInfo) {
		var service = {
				all: all,
				byCr: byCr,
				byId: byId,
				check: monsterLib.checkMonster,
			};

		return service;

		var i, j, m, source,
			all = [],
			byId = {},
			byCr = {};

		window.metaInfo = metaInfo;

		for ( i = 0; i < data.monsters.length; i++ ) {
			m = new monsterLib.Monster(data.monsters[i]);

			all.push(m);
			byId[m.id] = m;

			if ( ! m.special ) {
				if ( ! byCr[m.cr.string] ) {
					byCr[m.cr.string] = [];
				}

				byCr[m.cr.string].push(m);
			}

			// TODO: CP from addMonster. Is this actually used?
			// if (args.tags) {
			// 	register(miscLib.tags, args.tags);
			// }
		}

		for ( i = 0; i < data.sources.length; i++ ) {
			source = data.sources[i];

			miscLib.sources.push(source.name);
			miscLib.sourceFilters[source.name] = source.initialState;
			miscLib.shortNames[source.name] = source.shortName;

			for ( j = 0; j < source.contents.length; j++ ) {
				m = source.contents[j];
				byId[m[0]].sources.push({
					name: source.name,
					page: m[1],
					url: m[2]
				});
			}
		}
		
		all.sort(function (a, b) {
			return (a.name > b.name) ? 1 : -1;
		});
	};
})();
