(function() {
    'use strict';

    angular
        .module('app')
        .directive('groupInfo', GroupInfo);

    GroupInfo.$inject = [];
    function GroupInfo() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: 'GroupInfoController',
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: 'app/encounter-builder/group-info.html',
            scope: {}
        };
        return directive;
        
        function link(scope, element, attrs) {
        }
    }
})();