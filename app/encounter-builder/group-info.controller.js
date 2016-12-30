(function() {
'use strict';

  angular
    .module('app')
    .controller('GroupInfoController', GroupInfoController);

  GroupInfoController.$inject = ['encounter', 'playerLevels'];
  function GroupInfoController(encounter, playerLevels) {
    var vm = this;

    vm.encounter = encounter;
    vm.levels = playerLevels;
    vm.updateAndSave = updateAndSave;
    
    activate();

    ////////////////

    function activate() { }

    function updateAndSave() {
      encounter.freeze();
    }
  }
})();