(function() {
'use strict';

    angular
        .module('app')
        .component('searchControls', {
            templateUrl: 'app/encounter-builder/search.html',
            controller: 'SearchController',
            controllerAs: 'vm',
            bindings: {
                filters: '<',
            },
        });
})();
