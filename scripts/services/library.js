"use strict";

define(function () {
	return ["$rootScope", "store", function ($rootScope, store) {
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
			store.get("5em-library", function (frozen) {
				if (frozen) {
					library.encounters = frozen;

					if (!$rootScope.$$phase) {
						$rootScope.$apply();
					}
				}
			});
		}

		return library;
	}];
});