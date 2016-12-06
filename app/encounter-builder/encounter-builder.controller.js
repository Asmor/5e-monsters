(function () {
	"use strict";

	angular.module("app")
		.controller("EncounterBuilderController", EncounterBuilderController);

	EncounterBuilderController.$inject = ['$scope', 'store', 'actionQueue', 'encounter', 'metaInfo', 'monsters', 'sources'];

	function EncounterBuilderController(
			$scope,
			store,
			actionQueue,
			encounter,
			metaInfo,
			monsters,
			sources
		) {
			var vm = this;

			// There's no way to tell when they're done building an encounter, so clear the queue if they ever make it here.
			actionQueue.clear();

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

				vm.encounter.exp = subtotal;
			}, true);

			store.get("5em-filters", function (frozen) {
				if (frozen) {
					vm.filters = frozen;
				}

				if (!$scope.$$phase) {
					$scope.$apply();
				}

				$scope.$watch("vm.filters", function () {
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

			$scope.$watch("filters", function () {
				store.set("5em-filters", vm.filters);
			}, true);
		}
})();
