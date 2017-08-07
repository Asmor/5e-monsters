(function() {
    'use strict';

    angular
        .module('app')
        .component('difficultyLegend', {
            bindings: {
                showHeader: '<'
            },
            controllerAs: 'vm',
            templateUrl: 'app/common/difficulty-legend.html'
        });
})();