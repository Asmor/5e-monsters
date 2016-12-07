(function () {
	"use strict";

	angular.module("app")
		.controller("EncounterBuilderController", EncounterBuilderController);

	EncounterBuilderController.$inject = ['$scope', 'store', 'actionQueue', 'encounter', 'monsters', 'sources'];

	function EncounterBuilderController($scope, store, actionQueue, encounter, monsters, sources) {
		var vm = this;

		// There's no way to tell when they're done building an encounter, so clear the queue if they ever make it here.
		actionQueue.clear();

		vm.filters = {
			source: sources.filters,
			pageSize: 10,
		};
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

		store.get("5em-filters").then(function (frozen) {
			if (frozen) {
				vm.filters = frozen;
			}
		})
		.finally(function() {
			$scope.$watch("vm.filters", function () {
				store.set("5em-filters", vm.filters);
			}, true);
		});
	}
})();
