'use strict';

describe('monsterTable', function() {
    beforeEach(module("app"));

    var ctrl, encounter;

    beforeEach(inject(function($controller) {
        var $scope = {};
        encounter = {
            threat: {
                group: 1,
                pair: 2,
                easy: 3,
                medium: 4,
                hard: 5,
                deadly: 6
            }
        };
        ctrl = $controller('monsterTableController', { encounter: encounter, monsters: {} });
    }))

    describe('dangerZone', function() {
        it('returns null if no monster provided', function() {
            expect(ctrl.dangerZone(null)).toBeNull();
        });

        var monster;
        beforeEach(function() {
            monster = {
                cr: {
                    exp: 0
                }
            };
        })

        it('returns deadly if greater than deadly threat', function() {
            monster.cr.exp = 6.5;  
            expect(ctrl.dangerZone(monster)).toEqual("deadly");
        });

        it('returns hard if greater than hard threat', function() {
            monster.cr.exp = 5.5;
            expect(ctrl.dangerZone(monster)).toEqual("hard");
        });

        it('returns medium if greater than medium threat', function() {
            monster.cr.exp = 4.5;
            expect(ctrl.dangerZone(monster)).toEqual("medium");
        });

        it('returns easy if greater than easy threat', function() {
            monster.cr.exp = 3.5;
            expect(ctrl.dangerZone(monster)).toEqual("easy");
        });

        it('returns pair if greater than pair threat', function() {
            monster.cr.exp = 2.5;
            expect(ctrl.dangerZone(monster)).toEqual("pair");
        });

        it('returns group if greater than group threat', function() {
            monster.cr.exp = 1.5;
            expect(ctrl.dangerZone(monster)).toEqual("group");
        });

        it('returns trivial for anything else', function() {
            expect(ctrl.dangerZone(monster)).toEqual("trivial");
        });
    })
});