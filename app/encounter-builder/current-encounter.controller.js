(function() {
'use strict';

    angular
        .module('app')
        .controller('CurrentEncounterController', CurrentEncounterController);

    CurrentEncounterController.$inject = ['encounter'];
    function CurrentEncounterController(encounter) {
        var vm = this;
        
        vm.encounter = encounter;
        vm.generateAnother = generateAnother;
        vm.generateRandomEasy = generateRandomEasy;
        vm.generateRandomMedium = generateRandomMedium;
        vm.generateRandomHard = generateRandomHard;
        vm.generateRandomDeadly = generateRandomDeadly;
        vm.randomButtonText = randomButtonText;

        var lastDifficulty = "medium";
        
        function generateRandom(difficulty) {
            difficulty = difficulty || lastDifficulty;
            encounter.generateRandom(vm.filters, difficulty);
            lastDifficulty = difficulty;
        }

        function randomButtonText() {
            return "Random " + _.capitalize(lastDifficulty);
        }
    }
})();