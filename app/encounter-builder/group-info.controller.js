(function() {
'use strict';

  angular
    .module('app')
    .controller('GroupInfoController', GroupInfoController);

  GroupInfoController.$inject = ['encounter', 'playerLevels', 'partyInfo'];
  function GroupInfoController(encounter, playerLevels, partyInfo) {
    var vm = this;

    vm.encounter = encounter;
    vm.levels = playerLevels;
    vm.partyInfo = partyInfo;

    
  }
})();