(function() {
	'use strict';

	angular
		.module('app')
		.controller('EncounterManagerController', EncounterManagerController);

	EncounterManagerController.$inject = ['$scope', '$state', 'actionQueue', 'encounter', 'library', 'monsters', 'util'];

	function EncounterManagerController($scope, $state, actionQueue, encounter, library, monsters, util) {
		var vm = this;

		vm.partial = util.partialFactory("app/encounter-manager/partials/");

		vm.encounter = encounter;
		vm.library = library;
		vm.monsters = monsters;

		var placeholder = [];

		Object.keys(encounter.groups).forEach(function (id) {
			placeholder.push([
				(encounter.groups[id].qty > 1) ? encounter.groups[id].qty + "x" : "",
				encounter.groups[id].monster.name,
			].join(" "));
		});

		vm.newEncounter = {
			placeholder: placeholder.join(", "),
			name: "",
		};

		vm.calculateExp = function (storedEncounter) {
			var exp = 0;

			Object.keys( storedEncounter.groups ).forEach(function (id) {
				exp += monsters.byId[id].cr.exp * storedEncounter.groups[id];
			});

			return exp;
		};

		vm.load = function (storedEncounter) {
			encounter.reset(storedEncounter);

			if ( !actionQueue.next($state) ) {
				$state.go("encounter-builder");
			}
		};

		vm.save = function () {
			var newLibraryEntry = {
					name: vm.newEncounter.name || vm.newEncounter.placeholder,
					groups: {},
			};

			Object.keys(encounter.groups).forEach(function (id) {
				newLibraryEntry.groups[id] = encounter.groups[id].qty;
			});
			
			encounter.reference = library.store(newLibraryEntry);
		};

		vm.remove = function ( storedEncounter ) {
			library.remove(storedEncounter);

			if ( angular.equals(encounter.reference, storedEncounter) ) {
				encounter.reference = null;
			}
		};
	}
})();