(function() {
/* global _ */
'use strict';

  angular
    .module('app')
    .factory('partyInfo', PartyInfo);

  PartyInfo.inject = ['playerLevels', 'store'];

  function PartyInfo(playerLevels, store) {
    var service = {
      // Variables
			partyLevels: [
				{
					level: playerLevels[1],
					playerCount: 4
				}
			],

      // Methods
      initialize: initialize,
			freeze: freeze,
			thaw: thaw,

      // Properties
			get totalPlayerCount() {
				return _.sum(_.map(service.partyLevels, function (pl) { return pl.playerCount; }));
			},

			get totalPartyExpLevels() {
				var result = _.reduce(service.partyLevels, function(accum, curLevel) {
					var curExpLevels = getExpLevels(curLevel);

					return {
							easy: accum.easy + curExpLevels.easy,
							medium: accum.medium + curExpLevels.medium,
							hard: accum.hard + curExpLevels.hard,
							deadly: accum.deadly + curExpLevels.deadly,
							budget: accum.budget + curExpLevels.budget
					};
				}, { easy: 0, medium: 0, hard: 0, deadly: 0, budget: 0});
				return result;
			}
    };
    
    return service;

		function getExpLevels(partyLevel) {
				return {
					easy: partyLevel.playerCount * partyLevel.level.easy,
					medium: partyLevel.playerCount * partyLevel.level.medium,
					hard: partyLevel.playerCount * partyLevel.level.hard,
					deadly: partyLevel.playerCount * partyLevel.level.deadly,
					budget: partyLevel.playerCount * partyLevel.level.budget
				};
		}

    ////////////////
    function initialize() {
			thaw();
		}

    function freeze() {
			var o =_.map(service.partyLevels, function (pl) {
				return {
					level: pl.level.level,
					playerCount: pl.playerCount
				};
			});

			store.set("5em-party-info", o);
		}

		function thaw() {
			if (store.hasKey('5em-party-info')) {
				return store.get("5em-party-info").then(loadPartyInfoFromStore);
			} else {
				return store.get("5em-encounter").then(loadFromEncounterStoreAndConvert);
			}
		}

		/*
			Token: 5em-party-info
			Type: Array
			Example:
				[
					{
						level: 4,
						playerCount: 4
					}
				]
		*/
		function loadPartyInfoFromStore(frozenDataArray) {
			if ( !frozenDataArray ) {
				return;
			}

			service.partyLevels = [];

			_.forEach(frozenDataArray, function(frozenData) {
				service.partyLevels.push({
					level: playerLevels[frozenData.level],
					playerCount: frozenData.playerCount
				});
			});
		}

		function loadFromEncounterStoreAndConvert(frozenData) {
			if ( !frozenData ) {
				return;
			}

			service.partyLevels = [{
				level: playerLevels[frozenData.partyLevel],
				playerCount: frozenData.playerCount
			}];

			var newFrozenData = [
				{
					level: frozenData.partyLevel,
					playerCount: frozenData.playerCount
				}
			];
			store.set("5em-party-info", newFrozenData);

			if (store.hasKey("5em-current-encounter")) {
				store.remove("5em-encounter");
			}
		}
  }
})();
