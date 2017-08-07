(function() {
'use strict';

  angular
    .module('app')
    .controller('PartyLevelSelectorController', PartyLevelSelectorController);

  PartyLevelSelectorController.inject = ['playerLevels', 'partyInfo'];
  function PartyLevelSelectorController(playerLevels, partyInfo) {
    var vm = this;

    vm.levels = playerLevels;
    vm.save = save;
    vm.addPartyLevel = addPartyLevel;
    vm.removePartyLevel = removePartyLevel;

    function save() {
      partyInfo.freeze();
    }

    function addPartyLevel() {
      partyInfo.partyLevels.push({
        level: playerLevels[1],
        playerCount: 1
      });

      partyInfo.freeze();
    }

    function removePartyLevel(partyLevel) {
      var index = partyInfo.partyLevels.indexOf(partyLevel);
      partyInfo.partyLevels.splice(index, 1);

      partyInfo.freeze();
    }
  }
})();