(function() {
    'use strict';

    angular
        .module('app')
        .directive('difficultyLegend', DifficultyLegend);

    DifficultyLegend.$inject = [];
    function DifficultyLegend() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: {
                'showHeader': '='
            },
            controller: angular.noop,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: 'app/common/difficulty-legend.html',
            scope: {
            }
        };
        return directive;
        
        function link(scope, element, attrs) {
        }
    }
})();