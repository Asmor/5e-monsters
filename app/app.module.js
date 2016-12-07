(function () {
	/* global requirejs */
	"use strict";

	var myapp = angular
		.module("app", [
			"ui.router",
			"ngTouch",
			"angularUtils.directives.dirPagination",
			"LocalStorageModule"
		]);

	myapp.config(function(localStorageServiceProvider) {
		localStorageServiceProvider
    		.setPrefix('');
	});
})();