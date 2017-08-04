(function() {
    'use strict';

    angular
        .module('app')
        .component('groupInfo', {
            controller: 'GroupInfoController',
            controllerAs: 'vm',
            templateUrl: 'app/encounter-builder/group-info.html'
        });
})();