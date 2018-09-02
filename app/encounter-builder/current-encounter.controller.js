(function() {
'use strict';

    angular
        .module('app')
        .controller('CurrentEncounterController', CurrentEncounterController);

    CurrentEncounterController.$inject = ['encounter'];
    function CurrentEncounterController(encounter) {
        var vm = this;
        
        vm.encounter = encounter;
        vm.generateRandom = generateRandom;
        vm.randomButtonText = randomButtonText;
        vm.isPool = vm.encounter.type == 'pool';
        vm.newEncounter = newEncounter;

        var lastDifficulty = "medium";
        
        function generateRandom(difficulty) {
            difficulty = difficulty || lastDifficulty;
            encounter.generateRandom(vm.filters, difficulty);
            lastDifficulty = difficulty;
        }

        function newEncounter() {
            vm.encounter.reset();
            vm.isPool = false;
        }

        function randomButtonText() {
            return "Random " + _.capitalize(lastDifficulty);
        }
    }
})();