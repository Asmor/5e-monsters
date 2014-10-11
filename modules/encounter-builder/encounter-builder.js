/* global Controllers */
"use strict";

Controllers.encounterBuilder = {
	url: "/encounter-builder",
	templateUrl: "modules/encounter-builder/encounter-builder.html",
	controller: function (
		$scope,
		$firebase,
		$firebaseSimpleLogin,
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

		// TODO: For debug only
		$scope.fb = $firebase;
		$scope.fbsl = $firebaseSimpleLogin;

		$scope.partial = util.partialFactory("modules/encounter-builder/partials/");

		$scope.alignments = metaInfo.alignments;
		$scope.crList = metaInfo.crList;
		$scope.filters = store.get("5em-filters") || {
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
				return "ludicrous";
			} else if ( monsterExp > threat.hard ) {
				return "deadly";
			} else if ( monsterExp > threat.medium ) {
				return "hard";
			} else if ( monsterExp > threat.easy ) {
				return "medium";
			} else if ( monsterExp > threat.pair ) {
				return "easy";
			} else if ( monsterExp > threat.group ) {
				return "pair";
			} else if ( monsterExp > threat.trivial ) {
				return "group";
			} else {
				return "trivial";
			}
		};

		$scope.$watch("filters", function () {
			store.set("5em-filters", $scope.filters);
		}, true);
	},
};
