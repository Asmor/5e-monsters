"use strict";

define(["app/misc"], function (miscLib) {
	return function () {
		return {
			all: miscLib.sources,
			filters: miscLib.sourceFilters,
			shortNames: miscLib.shortNames,
		};
	};
});
