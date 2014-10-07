/* global Controllers */
"use strict";

Controllers.encounterManager = {
	url: "/encounter-manager",
	templateUrl: "modules/encounter-manager/encounter-manager.html",
	controller: function ($scope, $state, encounter, library, monsters, util) {
		window.scope = $scope;

		$scope.partial = util.partialFactory("modules/encounter-manager/partials/");

		$scope.encounter = encounter;
		$scope.library = library;
		$scope.monsters = monsters;

		var placeholder = [];

		Object.keys(encounter.groups).forEach(function (id) {
			placeholder.push([
				(encounter.groups[id].qty > 1) ? encounter.groups[id].qty + "x" : "",
				encounter.groups[id].monster.name,
			].join(" "));
		});

		$scope.newEncounter = {
			placeholder: placeholder.join(", "),
			name: "",
		};

		$scope.load = function (storedEncounter) {
			encounter.reset(storedEncounter);

			$state.go("encounter-builder");
		};

		$scope.save = function () {
			var newLibraryEntry = {
					name: $scope.newEncounter.name || $scope.newEncounter.placeholder,
					groups: {},
			};

			Object.keys(encounter.groups).forEach(function (id) {
				newLibraryEntry.groups[id] = encounter.groups[id].qty;
			});
			
			encounter.reference = library.store(newLibraryEntry);
		};

		$scope.remove = function ( storedEncounter ) {
			library.remove(storedEncounter);

			if ( encounter.reference === storedEncounter ) {
				encounter.reference = null;
			}
		};
	}
};