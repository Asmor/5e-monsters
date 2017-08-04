(function() {
'use strict';

  // Usage:
  // 
  // Creates:
  // 

  angular
    .module('app')
    .component('navbar', {
      templateUrl: 'app/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: "vm",
      bindings: {
      },
    });

  function NavbarController() {
    var vm = this;
  }
})();