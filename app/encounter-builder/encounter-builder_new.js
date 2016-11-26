(function () {
	"use strict";

	angular.module("app")
		.controller("EncounterBuilderController", EncounterBuilderController);

	EncounterBuilderController.$inject = ['$scope', 'store', 'actionQueue', 'encounter', 'metaInfo', 'sources', 'util'];

	function EncounterBuilderController(
			$scope,
			store,
			actionQueue,
			encounter,
			metaInfo,
			monsters,
			sources,
			util
		) {
			var vm = this;

			// There's no way to tell when they're done building an encounter, so clear the queue if they ever make it here.
			actionQueue.clear();

			vm.partial = util.partialFactory("app/encounter-builder/partials/");

			vm.alignments = metaInfo.alignments;
			vm.crList = metaInfo.crList;
			vm.filters = {
				source: sources.filters,
				pageSize: 10,
			};
			vm.monsters = monsters.all;
			vm.sizes = metaInfo.sizes;
			vm.sourceNames = sources.all;
			vm.sources = sources;
			vm.tags = Object.keys(metaInfo.tags).sort();
			vm.types = metaInfo.types;
			vm.levels = metaInfo.levels;
			vm.environments = metaInfo.environments;

			vm.checkMonster = monsters.check;

			vm.encounter = encounter;

			$scope.$watch(function (scope) { return vm.encounter.groups; }, function (newValue, oldValue) {
				var subtotal = 0;

				_.forEach(newValue, function(item, idx) {
					var groupQty = item.qty;
					var groupMonster = monsters.byId[idx];

					subtotal += groupMonster.cr.exp * groupQty;
				});

				encounter.exp = subtotal;
			}, true);

			store.get("5em-filters", function (frozen) {
				if (frozen) {
					vm.filters = frozen;
				}

				if (!vm.$$phase) {
					vm.$apply();
				}

				vm.$watch("filters", function () {
					store.set("5em-filters", vm.filters);
				}, true);
			});

			vm.monsterSort = function (monster) {
				var sort = vm.filters.sort;

				if ( sort === "size" ) {
					return monster.sizeSort;
				}

				if ( sort === "type" ) {
					return monster.type;
				}

				if ( sort === "alignment" ) {
					return (monster.alignment||{text:"zzzzz"}).text;
				}

				if ( sort === "cr" ) {
					return monster.cr.numeric;
				}

				return monster.name;
			};

			vm.dangerZone = function (monster) {
				if ( !monster ) {
					return null;
				}

				var threat = vm.encounter.threat,
					monsterExp = monster.cr.exp;

				if ( monsterExp > threat.deadly ) {
					return "deadly";
				} else if ( monsterExp > threat.hard ) {
					return "hard";
				} else if ( monsterExp > threat.medium ) {
					return "medium";
				} else if ( monsterExp > threat.easy ) {
					return "easy";
				} else if ( monsterExp > threat.pair ) {
					return "pair";
				} else if ( monsterExp > threat.group ) {
					return "group";
				} else {
					return "trivial";
				}
			};

			vm.resetFilters = function () {
				vm.filters.size = null;
				vm.filters.type = null;
				vm.filters.alignment = null;
				vm.filters.minCr = null;
				vm.filters.maxCr = null;
				vm.filters.environment = null;
			};

			vm.updateSourceFilters = function (newValue) {
				if (newValue) {
					vm.filters.sources = newValue;
				}
				// The default is core, but for implementation reasons it's represented by the empty string
				var sourceTypes = vm.filters.sources || "core",
					select = [ ],
					i;

				if ( sourceTypes === "custom" ) {
					return;
				}

				if ( sourceTypes.match(/all|core|books/) ) {
					select.push("Player's Handbook");
					select.push("Monster Manual");
					select.push("Volo's Guide to Monsters");
				}

				if ( sourceTypes.match(/all|books/) ) {
					select.push("Hoard of the Dragon Queen");
					select.push("Rise of Tiamat");
					select.push("Princes of the Apocalypse");
					select.push("Out of the Abyss");
					select.push("Curse of Strahd");
					select.push("Storm King's Thunder"); 
				}

				if ( sourceTypes.match(/all|basic/) ) {
					select.push("Basic Rules v1");
					select.push("HotDQ supplement");
					select.push("Princes of the Apocalypse Online Supplement v1.0");
				}
				
				if ( sourceTypes.match(/all|thirdparty/) ) {
					select.push("Monster-A-Day");
					select.push("Fifth Edition Foes");
					select.push("Primeval Thule Campaign Setting");
					select.push("Primeval Thule Gamemaster's Companion");
					select.push("Tome of Beasts");
				}

				for ( i = 0; i < sources.all.length; i++ ) {
					vm.filters.source[sources.all[i]] = false;
				}

				while (select.length) {
					vm.filters.source[select.pop()] = true;
				}
			};

			$scope.$watch("filters", function () {
				store.set("5em-filters", vm.filters);
			}, true);
		}
});
