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

        function generateAnother() {
            encounter.generateRandom(vm.filters, lastDifficulty);
        }

        function generateRandomEasy() {
            var diff = "easy";
            encounter.generateRandom(vm.filters, diff);
            lastDifficulty = diff;
        }

        function generateRandomMedium() {
            var diff = "medium";
            encounter.generateRandom(vm.filters, diff);
            lastDifficulty = diff;
        }

        function generateRandomHard() {
            var diff = "hard";
            encounter.generateRandom(vm.filters, diff);
            lastDifficulty = diff;
        }

        function generateRandomDeadly() {
            var diff = "deadly";
            encounter.generateRandom(vm.filters, diff);
            lastDifficulty = diff;
        }

        function randomButtonText() {
            return "Random " + _.capitalize(lastDifficulty);
        }
    }
})();