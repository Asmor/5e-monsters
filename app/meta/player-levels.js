(function() {
'use strict';

  angular
    .module('app')
    .value('playerLevels', {
      1: { level: 1,    budget: 300,	easy: 25,	medium: 50,		hard: 75,	deadly: 100 },
      2: { level: 2,    budget: 600,	easy: 50,	medium: 100,	hard: 150,	deadly: 200 },
      3: { level: 3,    budget: 1200,	easy: 75,	medium: 150,	hard: 225,	deadly: 400 },
      4: { level: 4,    budget: 1700,	easy: 125,	medium: 250,	hard: 375,	deadly: 500 },
      5: { level: 5,    budget: 3500,	easy: 250,	medium: 500,	hard: 750,	deadly: 1100 },
      6: { level: 6,    budget: 4000,	easy: 300,	medium: 600,	hard: 900,	deadly: 1400 },
      7: { level: 7,    budget: 5000,	easy: 350,	medium: 750,	hard: 1100,	deadly: 1700 },
      8: { level: 8,    budget: 6000,	easy: 450,	medium: 900,	hard: 1400,	deadly: 2100 },
      9: { level: 9,    budget: 7500,	easy: 550,	medium: 1100,	hard: 1600,	deadly: 2400 },
      10: { level: 10,  budget: 9000,	easy: 600,	medium: 1200,	hard: 1900,	deadly: 2800 },
      11: { level: 11,  budget: 10500,	easy: 800,	medium: 1600,	hard: 2400,	deadly: 3600 },
      12: { level: 12,  budget: 11500,	easy: 1000,	medium: 2000,	hard: 3000,	deadly: 4500 },
      13: { level: 13,  budget: 13500,	easy: 1100,	medium: 2200,	hard: 3400,	deadly: 5100 },
      14: { level: 14,  budget: 15000,	easy: 1250,	medium: 2500,	hard: 3800,	deadly: 5700 },
      15: { level: 15,  budget: 18000,	easy: 1400,	medium: 2800,	hard: 4300,	deadly: 6400 },
      16: { level: 16,  budget: 20000,	easy: 1600,	medium: 3200,	hard: 4800,	deadly: 7200 },
      17: { level: 17,  budget: 25000,	easy: 2000,	medium: 3900,	hard: 5900,	deadly: 8800 },
      18: { level: 18,  budget: 27000,	easy: 2100,	medium: 4200,	hard: 6300,	deadly: 9500 },
      19: { level: 19,  budget: 30000,	easy: 2400,	medium: 4900,	hard: 7300,	deadly: 10900 },
      20: { level: 20,  budget: 40000,	easy: 2800,	medium: 5700,	hard: 8500,	deadly: 12700 }
    });
})();