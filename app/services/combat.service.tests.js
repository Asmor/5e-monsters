'use strict';

describe('combat tests', function() {
	beforeEach(module('app'));

	var combat;

	beforeEach(inject(function(_combat_) {
		combat = _combat_;
	}));

	describe('api', function() {
		it('should have correct methods', function() {
			expect(combat.rollInitiative).toBeDefined();
		});
	});

	
	describe('roll initiative', function() {
		
		it('should set values on the combatant', function() {
			// Between 0 and 19
			spyOn(_, 'random').and.returnValue(9);
			
			var combatant = {
				initiative: 0,
				initiativeMod: 2
			};

			combat.rollInitiative(combatant);
			expect(combatant.initiative).toEqual(12);
			expect(combatant.initiativeRolled).toBeTruthy();
		});

		afterEach(function () {
			_.random.and.callThrough();
		});
	});
});