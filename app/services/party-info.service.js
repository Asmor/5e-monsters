(function() {
'use strict';

  angular
    .module('app')
    .factory('partyInfo', PartyInfo);

  PartyInfo.inject = ['$log', 'playerLevels', 'store'];

  function PartyInfo($log, playerLevels, store) {
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
				var partyLevel = service.partyLevels[0];
				return {
					easy: partyLevel.playerCount * partyLevel.level.easy,
					medium: partyLevel.playerCount * partyLevel.level.medium,
					hard: partyLevel.playerCount * partyLevel.level.hard,
					deadly: partyLevel.playerCount * partyLevel.level.deadly
				};
			}
    };
    
    return service;

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

			$log.log("Freezing party info", o);

			store.set("5em-party-info", o);
		}

		function thaw() {
			$log.log('Thawing party info');

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
				console.log('Load party level (' + frozenData.level + ') and player count (' + frozenData.playerCount + ') from the store');
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

			$log.log('(Encounter) Load party level (' + frozenData.partyLevel + ') and player count (' + frozenData.playerCount + ') from the store');
			service.partyLevels = [{
				level: playerLevels[frozenData.partyLevel],
				playerCount: frozenData.playerCount
			}];

			$log.log("Removing old encounter store token and replacing it with party info token");

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