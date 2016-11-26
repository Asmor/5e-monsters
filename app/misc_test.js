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

	describe('partialFactory', function() {
		it('should be callable', inject(function(misc) {
			expect(misc.partialFactory).toBeDefined();
			var factory = misc.partialFactory("app/encounter-builder/partials/");
			expect(factory).toBeDefined();
		}));

		it('should return html', inject(function(misc) {
			var factory = misc.partialFactory("app/encounter-builder/partials/");
			expect(factory('current-encounter')).toBeDefined();
			expect(factory('current-encounter')).toBe("app/encounter-builder/partials/current-encounter.html");
		}));
	})
});