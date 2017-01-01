(function() {
'use strict';

  angular
    .module('app')
    .factory('partyInfo', PartyInfo);

  PartyInfo.inject = ['$log', 'playerLevels', 'store'];

  function PartyInfo($log, playerLevels, store) {
    var service = {
      // Variables
      partyLevel: playerLevels[1],
			playerCount: 4,

      // Methods
      initialize: initialize,
			freeze: freeze,
			thaw: thaw,

      // Properties
			get totalPlayerCount() {
				return playerCount;
			},

			get totalPartyExpLevels() {
				return {
					easy: service.playerCount * service.partyLevel.easy,
					medium: service.playerCount * service.partyLevel.medium,
					hard: service.playerCount * service.partyLevel.hard,
					deadly: service.playerCount * service.partyLevel.deadly
				};
			}
    };
    
    return service;

    ////////////////
    function initialize() {
			thaw();
		}

    function freeze() {
			var o = [{
				level: service.partyLevel.level,
				playerCount: service.playerCount,
			}];

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

			var frozenData = frozenDataArray[0];
			$log.log('Load party level (' + frozenData.level + ') and player count (' + frozenData.playerCount + ') from the store');
			service.partyLevel = playerLevels[frozenData.level];
			service.playerCount = frozenData.playerCount;
		}

		function loadFromEncounterStoreAndConvert(frozenData) {
			if ( !frozenData ) {
				return;
			}

			$log.log('(Encounter) Load party level (' + frozenData.partyLevel + ') and player count (' + frozenData.playerCount + ') from the store');
			service.partyLevel = playerLevels[frozenData.partyLevel];
			service.playerCount = frozenData.playerCount;

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