(function() {
'use strict';

    angular
        .module('app')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', 'sources', 'metaInfo', 'store'];
    function SearchController($scope, sources, metaInfo, store) {
        var vm = this;

        vm.alignments = metaInfo.alignments;
        vm.crList = metaInfo.crList;
        vm.environments = metaInfo.environments;
        vm.sizes = metaInfo.sizes;
        vm.sourceNames = sources.all;
        vm.types = metaInfo.types;

        vm.resetFilters = resetFilters;
        vm.updateSourceFilters = updateSourceFilters;

        activate();

        ////////////////

        function activate() { 
            $scope.$watch("vm.filters", function () {
				store.set("5em-filters", vm.filters);
			}, true);
        }

        function resetFilters() {
            vm.filters.size = null;
            vm.filters.type = null;
            vm.filters.alignment = null;
            vm.filters.minCr = null;
            vm.filters.maxCr = null;
            vm.filters.environment = null;
        };

        function updateSourceFilters(newValue) {
            if (newValue) {
                vm.filters.sources = newValue;
            }
            // The default is core, but for implementation reasons it's represented by the empty string
            var sourceTypes = vm.filters.sources || "core",
                select = [ ],
                i;

            if ( sourceTypes === "custom" ) {
                return;
            }

            if ( sourceTypes.match(/all|core|books/) ) {
                select.push("Player's Handbook");
                select.push("Monster Manual");
                select.push("Volo's Guide to Monsters");
            }

            if ( sourceTypes.match(/all|books/) ) {
                select.push("Hoard of the Dragon Queen");
                select.push("Rise of Tiamat");
                select.push("Princes of the Apocalypse");
                select.push("Out of the Abyss");
                select.push("Curse of Strahd");
                select.push("Storm King's Thunder"); 
            }

            if ( sourceTypes.match(/all|basic/) ) {
                select.push("Basic Rules v1");
                select.push("HotDQ supplement");
                select.push("Princes of the Apocalypse Online Supplement v1.0");
            }
            
            if ( sourceTypes.match(/all|thirdparty/) ) {
                select.push("Monster-A-Day");
                select.push("Fifth Edition Foes");
                select.push("Primeval Thule Campaign Setting");
                select.push("Primeval Thule Gamemaster's Companion");
                select.push("Tome of Beasts");
            }

            for ( i = 0; i < sources.all.length; i++ ) {
                vm.filters.source[sources.all[i]] = false;
            }

            while (select.length) {
                vm.filters.source[select.pop()] = true;
            }
        };
    }
})();