'use strict';

describe('monsters tests', function () {
	beforeEach(module('app'));

	describe('Monster list', function() {
		it('should have monsters', inject(function (monsterStats) {
			expect(monsterStats.length).toBeGreaterThan(0);
		}));

		it('should all be valid monsters', inject(function (monsterStats) {
			for (var i = 0; i < monsterStats.length; i++) {
				expect(monsterStats[i].id.length).toBeGreaterThan(0);
				expect(monsterStats[i].name.length).toBeGreaterThan(0);
				expect(monsterStats[i].cr).toMatch(/0|1\/8|1\/4|1\/2|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30/);
			}
		}));
	});
});