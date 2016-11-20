"use strict";

define(["scripts/misc"], function (miscLib) {
	return function () {
		return {
			all: miscLib.sources,
			filters: miscLib.sourceFilters,
			shortNames: miscLib.shortNames,
		};
	};
});
