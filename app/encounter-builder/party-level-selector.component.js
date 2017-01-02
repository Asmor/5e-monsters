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
      controller: PartyLevelSelectorController,
      controllerAs: 'vm',
      bindings: {
        partyLevel: '='
      },
    });

  PartyLevelSelectorController.inject = ['playerLevels', 'partyInfo'];
  function PartyLevelSelectorController(playerLevels, partyInfo) {
    var vm = this;

    vm.save = save;
    vm.levels = playerLevels;

    function save() {
      partyInfo.freeze();
    }
  }
})();