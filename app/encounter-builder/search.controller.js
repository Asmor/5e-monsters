(function() {
'use strict';

	angular
		.module('app')
		.controller('SearchController', SearchController);

	SearchController.$inject = ['$scope', 'sources', 'metaInfo', 'store'];
	function SearchController($scope, sources, metaInfo, store) {
		var vm = this;

		vm.alignments = metaInfo.alignments;
		vm.crList = metaInfo.crList;
		vm.environments = metaInfo.environments;
		vm.sizes = metaInfo.sizes;
		vm.sourceNames = sources.all;
		vm.types = metaInfo.types;

		vm.resetFilters = resetFilters;
		vm.updateSourceFilters = updateSourceFilters;

		activate();

		$scope.$on("custom-source-added", function (event, sourceName) {
			// Custom content should be enabled by default
			vm.filters.source[sourceName] = true;
		});

		////////////////

		function activate() {
		}

		function resetFilters() {
			vm.filters.size = null;
			vm.filters.type = null;
			vm.filters.alignment = null;
			vm.filters.minCr = null;
			vm.filters.maxCr = null;
			vm.filters.environment = null;
		}

		function updateSourceFilters(newValue) {
			console.log("TODO", newValue);
			if (newValue) {
				vm.filters.sources = newValue;
			}

			// The default is core, but for implementation reasons it's represented by the empty string
			var sourceTypes = vm.filters.sources || "core";

			// If we're selecting everything, turn everything on. Otherwise turn everything off and
			// then selectively turn things on
			sources.all.forEach(function (sourceName) {
				vm.filters.source[sourceName] = (sourceTypes === "all");
			});
			if ( sourceTypes === "core" ) {
				[
					"Player's Handbook",
					"Monster Manual",
					"Volo's Guide to Monsters",
				].forEach(function (sourceName) {
					vm.filters.source[sourceName] = true;
				});
			}
		}
	}
})();
