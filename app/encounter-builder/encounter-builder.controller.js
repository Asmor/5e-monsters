(function () {
	"use strict";

	angular.module("app")
		.controller("EncounterBuilderController", EncounterBuilderController);

	EncounterBuilderController.$inject = ['$scope', 'store', 'actionQueue', 'encounter', 'monsters', 'sources'];

	function EncounterBuilderController($scope, store, actionQueue, encounter, monsters, sources) {
		var vm = this;

		vm.encounter = encounter;
		vm.getMonsterQtyString = getMonsterQtyString;

		activate();

		function activate() {
			// There's no way to tell when they're done building an encounter, so clear the queue if they ever make it here.
			actionQueue.clear();

			vm.filters = {
				source: sources.filters,
				pageSize: 10,
			};

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

		function getMonsterQtyString() {
			var qty = Object.keys(vm.encounter.groups).reduce(function (sum, key) {
				return sum + vm.encounter.groups[key].qty;
			}, 0);

			if ( qty === 1 ) {
				return "1 enemy";
			}

			return qty + " enemies";
		};
	}
})();
