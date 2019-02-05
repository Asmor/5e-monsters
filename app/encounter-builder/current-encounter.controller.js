(function() {
'use strict';

    angular
        .module('app')
        .controller('CurrentEncounterController', CurrentEncounterController);

    CurrentEncounterController.$inject = ['encounter','partyInfo'];
    function CurrentEncounterController(encounter, partyInfo) {
        var vm = this;
        
        vm.encounter = encounter;
        vm.generateRandom = generateRandom;
        vm.randomButtonText = randomButtonText;
        vm.isPool = vm.encounter.type == 'pool';
        vm.newEncounter = newEncounter;
        vm.partyInfo = partyInfo;
        vm.totalMonsters = 10;

        var lastDifficulty = "medium";
        
        function generateRandom(difficulty) {
            console.log("gen random", vm.total_monsters);
            difficulty = difficulty || lastDifficulty;
            encounter.generateRandom(vm.filters, difficulty, vm.totalMonsters);
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