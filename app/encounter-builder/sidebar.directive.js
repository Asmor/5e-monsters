(function() {
    'use strict';

    angular
        .module('app')
        .directive('sidebar', Sidebar);

    Sidebar.$inject = [];
    function Sidebar() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: SidebarController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
            }
        };
        return directive;
        
        function link(scope, element, attrs) {
        }
    }
    /* @ngInject */
    function SidebarController () {
        
    }
})();