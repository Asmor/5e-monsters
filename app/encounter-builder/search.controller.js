(function() {
'use strict';

	angular
		.module('app')
		.controller('SearchController', SearchController);

	SearchController.$inject = ["$scope", "metaInfo", "sheetManager", "sources"];
	function SearchController($scope, metaInfo, sheetManager, sources) {
		var vm = this;

		vm.alignments = metaInfo.alignments;
		vm.crList = metaInfo.crList;
		vm.environments = metaInfo.environments;
		vm.sizes = metaInfo.sizes;
		vm.sourceNames = sources.all;
		vm.types = metaInfo.types;

		// Cache sorted data to avoid infinite digest
		var contentCacheKey;
		var contentCache;
		$scope.getContent = function () {
			var metadata = sheetManager.getSheetMetaData();
			var metadataKeys = Object.keys(metadata);
			var cacheKey = metadataKeys
				.sort()
				.map(function (sheetId) {
					return sheetId + metadata[sheetId].timestamp;
				})
				.join("|");

			if ( contentCacheKey !== cacheKey ) {
				contentCacheKey = cacheKey;

				contentCache = metadataKeys
				.map(function (sheetId) {
					var data = metadata[sheetId];
					var date = (new Date(data.timestamp));
					return {
						name: data.name,
						id: sheetId,
						custom: data.custom,
						updated: [date.toLocaleDateString(), date.toLocaleTimeString()].join(" "),
					};
				})
				.sort(function (a, b) {
					var aCustom = !!a.custom;
					var bCustom = !!b.custom;

					if ( aCustom !== bCustom ) {
						// true is "greater than" false, so custom is sorted to bottom
						return (aCustom > bCustom) ? 1 : -1;
					}

					return (a.name > b.name) ? 1 : -1;
				});
			}
			return contentCache;
		};

		vm.resetFilters = resetFilters;
		vm.updateSourceFilters = updateSourceFilters;

		$scope.$on("custom-source-added", function (event, sourceName) {
			// Custom content should be enabled by default
			vm.filters.source[sourceName] = true;
		});

		$scope.addCustom = function () {
			var added = sheetManager.addContent($scope.customName, $scope.customUrl);

			if ( added ) {
				$scope.customName = null;
				$scope.customUrl = null;
			}
		};

		$scope.removeCustom = sheetManager.removeContent;

		function resetFilters() {
			vm.filters.size = null;
			vm.filters.type = null;
			vm.filters.alignment = null;
			vm.filters.minCr = null;
			vm.filters.maxCr = null;
			vm.filters.environment = null;
		}

		function updateSourceFilters(newValue) {
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
			if ( sourceTypes === "official" ) {
				[
					"Basic Rules v1",
					"Curse of Strahd",
					"Hoard of the Dragon Queen",
					"HotDQ supplement",
					"Monster Manual",
					"Out of the Abyss",
					"Player's Handbook",
					"Princes of the Apocalypse",
					"Princes of the Apocalypse Online Supplement v1.0",
					"Rise of Tiamat",
					"Storm King's Thunder",
					"Tales from the Yawning Portal",
					"The Tortle Package",
					"Tomb of Annihilation",
					"Volo's Guide to Monsters",
				].forEach(function (sourceName) {
					vm.filters.source[sourceName] = true;
				});
			}
		}
	}
})();
