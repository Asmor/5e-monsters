(function() {
'use strict';

	angular
		.module('app')
		.controller('SearchController', SearchController);

	SearchController.$inject = ["$scope", "metaInfo", "sheetManager", "sources", "library"];
	function SearchController($scope, metaInfo, sheetManager, sources, library) {
		var vm = this;

		vm.alignments = metaInfo.alignments;
		vm.crList = metaInfo.crList;
		vm.environments = metaInfo.environments;
		vm.sizes = metaInfo.sizes;
		vm.sourceNames = sources.all;
		vm.types = metaInfo.types;
		vm.legendaryList = metaInfo.legendaryList;
		vm.encounters = library.encounters;
		vm.sortChoices = metaInfo.sortChoices;
		window.sources = sources;

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
			vm.filters.legendary = null;
		}

		function updateSourceFilters({ type, enabled }) {
			sources.sourcesByType[type].forEach(name => vm.filters.source[name] = enabled);
		}

		let sourceSections = [];
		let sourceSectionKey;
		$scope.getSourceSections = function () {
			let key = sources.all.join();

			if ( key !== sourceSectionKey ) {
				sourceSectionKey = key;

				sourceSections = Object.keys(sources.sourcesByType).map(sourceType => ({
					name: sourceType,
					sources: sources.sourcesByType[sourceType].slice().sort(),
				}));

				sourceSections.sort((a, b) => {
					let aName = a.name;
					let bName = b.name;
					let aIsOfficial = aName.match(/Official/);
					let bIsOfficial = bName.match(/Official/);

					// Sort official types to the top, then sort by name
					if ( aIsOfficial && !bIsOfficial ) {
						return -1;
					} else if ( !aIsOfficial && bIsOfficial ) {
						return 1;
					} else {
						if ( aName > bName ) {
							return 1;
						} else {
							return -1;
						}
					}
				});
			}

			return sourceSections; 
		}
	}
})();
