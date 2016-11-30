(function() {
    'use strict';

    angular
        .module('app')
        .directive('currentEncounter', CurrentEncounter);

    CurrentEncounter.$inject = [];
    function CurrentEncounter() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: 'CurrentEncounterController',
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            templateUrl: 'app/encounter-builder/current-encounter.html',
            scope: {
            }
        };
        return directive;
        
        function link(scope, element, attrs) {
        }
    }
})();