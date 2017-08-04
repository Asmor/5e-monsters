'use strict';

describe('data tests', function () {
	beforeEach(module('app'));

	describe('check methods', function() {
		it('should have correct methods', inject(function (monsterData) {
			expect(monsterData.monsters).toBeDefined();
			expect(monsterData.monsters.length).toBeGreaterThan(0);
			expect(monsterData.sources.length).toEqual(18);
		}));
	});
});