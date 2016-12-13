(function() {
'use strict';

  angular
    .module('app')
    .controller('GroupInfoController', GroupInfoController);

  GroupInfoController.$inject = ['encounter', 'playerLevelExperience'];
  function GroupInfoController(encounter, playerLevels) {
    var vm = this;

    vm.encounter = encounter;
    vm.levels = playerLevels;

    activate();

    ////////////////

    function activate() { }
  }
})();