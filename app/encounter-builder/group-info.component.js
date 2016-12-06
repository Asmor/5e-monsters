(function() {
    'use strict';

    angular
        .module('app')
        .component('groupInfo', {
            controller: GroupInfoController,
            controllerAs: 'vm',
            templateUrl: 'app/encounter-builder/group-info.html'
        });

    GroupInfoController.$inject = ['encounter', 'metaInfo'];

    function GroupInfoController(encounter, metaInfo) {
        var vm = this;
        
        vm.encounter = encounter;
        vm.levels = metaInfo.levels;

        activate();

        ////////////////

        function activate() { }
    }
})();