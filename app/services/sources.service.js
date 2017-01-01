(function() {
	"use strict";

	angular.module("app")
		.factory('sources', SourcesService);

	SourcesService.$inject = ['misc'];

	function SourcesService(miscLib){
		return {
			all: miscLib.sources,
			filters: miscLib.sourceFilters,
			shortNames: miscLib.shortNames
		};
	}
})();
