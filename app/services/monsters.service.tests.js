'use strict';

describe('monsters tests', function() {
	beforeEach(module('app'));

	describe('api', function() {
		it('should have correct methods', inject(function(monsters) {
			expect(monsters.all).toBeDefined();
			expect(monsters.all.length).toBeGreaterThan(0);
			expect(_.isObject(monsters.byCr)).toBe(true);
			expect(_.keys(monsters.byCr).length).toBeGreaterThan(0);
			expect(_.isObject(monsters.byId)).toBe(true);
			expect(_.keys(monsters.byId).length).toBeGreaterThan(0);
			expect(_.isFunction(monsters.check)).toBe(true);
		}));
	})
})