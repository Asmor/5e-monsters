(function() {
	"use strict";

	angular.module("app")
		.factory('sources', SourcesService);

	SourcesService.$inject = ["misc"];

	function SourcesService(misc) {
		return {
			all: misc.sources,
			filters: misc.sourceFilters,
			shortNames: misc.shortNames,
			sourcesByType: misc.sourcesByType,
		};
	}
})();
