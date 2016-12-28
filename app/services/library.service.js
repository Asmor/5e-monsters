(function() {
	"use strict";

	angular.module("app")
		.factory("library", LibraryService);

	LibraryService.$inject = ["$rootScope", "$log", "store"];

	function LibraryService($rootScope, $log, store) {
		var library = {
				encounters: [],
				remove: function (storedEncounter) {
					library.encounters.splice(library.encounters.indexOf(storedEncounter), 1);

					freeze();
				},
				store: function (encounter) {
					 for ( var i = 0; i < library.encounters.length; i++ ) {
					 	if ( angular.equals(encounter, library.encounters[i]) ) {
					 		return library.encounters[i];
					 	}
					 }

					library.encounters.push(encounter);
					freeze();

					return encounter;
				}
		};

		thaw();

		function freeze() {
			$log.log('Freeze library');
			store.set("5em-library", library.encounters);
		}

		function thaw() {
			$log.log('Thaw library');
			store.get("5em-library").then(function (frozen) {
				if (frozen) {
					library.encounters = frozen;
				}
			});
		}

		return library;
	}
})();
