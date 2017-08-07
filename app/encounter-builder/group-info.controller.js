(function() {
'use strict';

  angular
    .module('app')
    .controller('GroupInfoController', GroupInfoController);

  GroupInfoController.$inject = ['encounter', 'playerLevels', 'partyInfo'];
  function GroupInfoController(encounter, playerLevels, partyInfo) {
    var vm = this;

    vm.encounter = encounter;
    vm.partyInfo = partyInfo;
    vm.addPartyLevel = addPartyLevel;

    function addPartyLevel() {
      partyInfo.partyLevels.push({
        level: playerLevels[1],
        playerCount: 1
      });

      partyInfo.freeze();
    }
  }
})();