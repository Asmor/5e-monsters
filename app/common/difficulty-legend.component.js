(function() {
    'use strict';

    angular
        .module('app')
        .component('difficultyLegend', {
            bindings: {
                showHeader: '<'
            },
            templateUrl: 'app/common/difficulty-legend.html'
        });
})();