(function() {
'use strict';

    angular.module('app')
        .controller('monsterTableController', MonsterTableController);
    
    MonsterTableController.$inject = ['encounter', 'monsters', 'sources'];
    function MonsterTableController(encounter, monsters, sources) {
        var vm = this;
        
        vm.encounter = encounter;
        vm.monsters = monsters.all;
        vm.sources = sources;
        vm.dangerZone = dangerZone;
        
        ////////////////

        vm.$onInit = function() { };
        vm.$onChanges = function(changesObj) { };
        vm.$onDestory = function() { };

        function dangerZone(monster) {
            if ( !monster ) {
                return null;
            }

            var threat = encounter.threat,
                monsterExp = monster.cr.exp;
                
            if ( monsterExp > threat.deadly ) {
                return "deadly";
            } else if ( monsterExp > threat.hard ) {
                return "hard";
            } else if ( monsterExp > threat.medium ) {
                return "medium";
            } else if ( monsterExp > threat.easy ) {
                return "easy";
            } else if ( monsterExp > threat.pair ) {
                return "pair";
            } else if ( monsterExp > threat.group ) {
                return "group";
            } else {
                return "trivial";
            }
        };
    }
})();
