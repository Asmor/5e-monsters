(function() {
    'use strict';

    angular
        .module('app')
        .directive('searchControls', SearchControls);

    SearchControls.$inject = [];
    function SearchControls() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: {
                'filters': '='
            },
            controller: 'SearchController',
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: 'app/encounter-builder/search.html',
            scope: {
            }
        };
        return directive;
        
        function link(scope, element, attrs) {
        }
    }
})();