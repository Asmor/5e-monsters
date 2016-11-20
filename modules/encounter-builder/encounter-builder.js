"use strict";

define({
	url: "/encounter-builder",
	templateUrl: "modules/encounter-builder/encounter-builder.html",
	controller: function (
		$scope,
		store,
		actionQueue,
		encounter,
		metaInfo,
		monsters,
		sources,
		util
	) {
		window.scope = $scope;

		// There's no way to tell when they're done building an encounter, so clear the queue if they ever make it here.
		actionQueue.clear();

		$scope.partial = util.partialFactory("modules/encounter-builder/partials/");

		$scope.alignments = metaInfo.alignments;
		$scope.crList = metaInfo.crList;
		$scope.filters = {
			source: sources.filters,
			pageSize: 10,
		};
		$scope.monsters = monsters.all;
		$scope.sizes = metaInfo.sizes;
		$scope.sources = sources.all;
		$scope.tags = Object.keys(metaInfo.tags).sort();
		$scope.types = metaInfo.types;
		$scope.levels = metaInfo.levels;
		$scope.environments = metaInfo.environments;

		$scope.checkMonster = monsters.check;

		$scope.encounter = encounter;

		store.get("5em-filters", function (frozen) {
			if (frozen) {
				$scope.filters = frozen;
			}

			if (!$scope.$$phase) {
				$scope.$apply();
			}

			$scope.$watch("filters", function () {
				store.set("5em-filters", $scope.filters);
			}, true);
		});

		$scope.monsterSort = function (monster) {
			var sort = $scope.filters.sort;

			if ( sort === "size" ) {
				return monster.sizeSort;
			}

			if ( sort === "type" ) {
				return monster.type;
			}

			if ( sort === "alignment" ) {
				return (monster.alignment||{text:"zzzzz"}).text;
			}

			if ( sort === "cr" ) {
				return monster.cr.numeric;
			}

			return monster.name;
		};

		$scope.dangerZone = function (monster) {
			if ( !monster ) {
				return null;
			}

			var threat = $scope.encounter.threat,
				monsterExp = monster.cr.exp;

			if ( monsterExp > threat.deadly ) {
				return "deadly";
			} else if ( monsterExp > threat.hard ) {
				return "hard";
			} else if ( monsterExp > threat.medium ) {
				return "medium";
			} else if ( monsterExp > threat.easy ) {
				return "easy";
			} else if ( monsterExp > threat.pair ) {
				return "pair";
			} else if ( monsterExp > threat.group ) {
				return "group";
			} else {
				return "trivial";
			}
		};

		$scope.resetFilters = function () {
			$scope.filters.size = null;
			$scope.filters.type = null;
			$scope.filters.alignment = null;
			$scope.filters.minCr = null;
			$scope.filters.maxCr = null;
			$scope.filters.environment = null;
		};

		$scope.updateSourceFilters = function () {
			// The default is core, but for implementation reasons it's represented by the empty string
			var sourceTypes = $scope.filters.sources || "core",
				select = [ ],
				i;

			if ( sourceTypes === "custom" ) {
				return;
			}

			if ( sourceTypes.match(/all|core|books/) ) {
				select.push("Player's Handbook");
				select.push("Monster Manual");
			}

			if ( sourceTypes.match(/all|books/) ) {
				select.push("Hoard of the Dragon Queen");
				select.push("Rise of Tiamat");
				select.push("Princes of the Apocalypse");
				select.push("Out of the Abyss");
				select.push("Curse of Strahd");
				select.push("Storm King's Thunder"); 
				select.push("Volo's Guide to Monsters"); 
			}

			if ( sourceTypes.match(/all|basic/) ) {
				select.push("Basic Rules v1");
				select.push("HotDQ supplement");
				select.push("Princes of the Apocalypse Online Supplement v1.0");
			}
			
			if ( sourceTypes.match(/all|thirdparty/) ) {
				select.push("Monster-A-Day");
				select.push("Fifth Edition Foes");
				select.push("Primeval Thule Campaign Setting");
				select.push("Primeval Thule Gamemaster's Companion");
				select.push("Tome of Beasts");
			}

			for ( i = 0; i < sources.all.length; i++ ) {
				$scope.filters.source[sources.all[i]] = false;
			}

			while (select.length) {
				$scope.filters.source[select.pop()] = true;
			}
		};

		$scope.$watch("filters", function () {
			store.set("5em-filters", $scope.filters);
		}, true);
	},
});