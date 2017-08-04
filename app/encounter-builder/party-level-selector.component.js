(function() {
'use strict';

  // Usage:
  // 
  // Creates:
  // 

  angular
    .module('app')
    .component('partyLevelSelector', {
      templateUrl: 'app/encounter-builder/party-level-selector.html',
      controller: 'PartyLevelSelectorController',
      controllerAs: 'vm',
      bindings: {
        partyLevel: '=',
        first: '<'
      },
    });
})();