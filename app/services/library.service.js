(function() {
	"use strict";

	angular.module("app")
		.factory("library", LibraryService);

	LibraryService.$inject = ["$rootScope", "store"];

	function LibraryService($rootScope, store) {
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
			store.set("5em-library", library.encounters);
		}

		function thaw() {
			store.get("5em-library").then(function(frozen) {
				if (frozen) {
					for ( var i = 0; i < frozen.length; i++ ) {
						library.encounters.push(frozen[i]);
					}
				}
			});
		}

		return library;
	}
})();
