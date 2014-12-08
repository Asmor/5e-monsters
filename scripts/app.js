// "use strict";

requirejs.onResourceLoad = function (context, map, depMaps) {
  if (!window.rtree) {
    window.rtree = {};
    window.rtree.tree = {};
	window.rtree.map = function() {
	  var dep, key, rt, val, _i, _len, _ref;
	  rt = rtree.tree;
	  for (key in rt) {
		val = rt[key];
		if (rt.hasOwnProperty(key)) {
		  _ref = val.deps;
		  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
		    dep = _ref[_i];
		    val.map[dep] = rt[dep];
		  }
		}
	  }
	};
	window.rtree.toUml = function() {
	  var dep, key, rt, uml, val, _i, _len, _ref;
	  rt = rtree.tree;
	  uml = [];
	  for (key in rt) {
		val = rt[key];
		if (rt.hasOwnProperty(key)) {
		  _ref = val.deps;
		  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
		    dep = _ref[_i];
		    uml.push("[" + key + "]->[" + dep + "]");
		  }
		}
	  }
	  return uml.join("\n");
	};
 
  }
  r = window.rtree.tree;
  o = {deps: [], map: {}};
  if (!r[map.name]) {
    r[map.name] = o;
  }
  if (map.parentMap && map.parentMap.name) {
    if (!r[map.parentMap.name]) {
      r[map.parentMap.name] = o;
    }
    if (map.parentMap.name !== map.name) {
      r[map.parentMap.name].deps.push(map.name);
    }
  }
};

require([
		"modules/encounter-builder/encounter-builder",
		"modules/encounter-manager/encounter-manager",
		"modules/battle-setup/battle-setup",
		"modules/battle-tracker/battle-tracker",
		"modules/players/players",
		"modules/account/account",
		"modules/common/common",
		"scripts/filters",
		"scripts/services",
	], function (
		encounterBuilder,
		encounterManager,
		battleSetup,
		battleTracker,
		players,
		account,
		common,
		filters,
		services
	) {
	angular
		.module("monsterListApp", [
			"ui.router",
			"ngTouch",
			"angularUtils.directives.dirPagination",
			"firebase",
		])
		.config(function ($stateProvider, $urlRouterProvider) {
			// Default
			$urlRouterProvider.otherwise("/encounter-builder");

			// Main menu page
			$stateProvider.state("encounter-builder", encounterBuilder);
			$stateProvider.state("encounter-manager", encounterManager);
			$stateProvider.state("battle-setup", battleSetup);
			$stateProvider.state("battle-tracker", battleTracker);
			$stateProvider.state("players", players.main);
			$stateProvider.state("players.edit", players.edit);
			$stateProvider.state("players.manage", players.manage);
			$stateProvider.state("account", account);
		})
		.directive("numberInput", common.numberInput)
		.filter("monstersFilter", filters.monster)
		.filter("negative", filters.negative)
		.filter("positive", filters.positive)
		.filter("sortEncounter", filters.sortEncounter)
		.factory("account", services.account)
		.factory("actionQueue", services.actionQueue)
		.factory("combat", services.combat)
		.factory("encounter", services.encounter)
		.factory("library", services.library)
		.factory("metaInfo", services.metaInfo)
		.factory("monsters", services.monsters)
		.factory("players", services.players)
		.factory("sources", services.sources)
		.factory("store", services.store)
		.factory("util", services.util)
	;

	angular.bootstrap(document, ['monsterListApp']);
});