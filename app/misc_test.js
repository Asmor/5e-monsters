'use strict';

describe('misc test', function() {
	beforeEach(module("app"));

	describe('levels', function() {
		it('should have correct methods', inject(function(misc) {
			expect(misc.levels).toBeDefined();
			expect(misc.levels[0]).toBeDefined();
			expect(misc.levels[19]).toBeDefined();
		}));
	});
});