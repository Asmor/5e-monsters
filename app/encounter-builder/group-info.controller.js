(function() {
'use strict';

    angular
        .module('app')
        .controller('GroupInfoController', GroupInfoController);

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