
describe('Encounter Service', function() {
  beforeEach(function() {
    bard.appModule('app');
    bard.inject(this, '$rootScope', 'encounter', 'store', '$q', 'playerLevels', 'randomEncounter', 'misc', 'partyInfo');

    store.get = sinon.stub();
    randomEncounter.getRandomEncounter = sinon.stub();
    misc.getMultiplier = sinon.stub().returns(1);
  });
  
  describe('initialize', function() {
    it('should load info from current encounter token', function() {
      var groupInfo = {
        groups: {
          "A": 1,
          "B": 2
        }
      };
      store.get.withArgs("5em-encounter").returns($q.when(groupInfo));
      encounter.initialize();
      $rootScope.$apply();
      expect(encounter.groups).toEqual({});
    });
  });

  describe('adjustedExp', function() {
    it('should exist', function() {
      expect(encounter.adjustedExp).toBeDefined();
    });
    
    it('should return zero if exp is not a number', function() {
      encounter.groups = {};
      expect(encounter.adjustedExp).toEqual(0);
    });

    it('should return exp', function() {
      encounter.qty = 1;
      encounter.groups = {
        "A": {
          qty: 1,
          monster: {
            cr: {
              exp: 100
            }
          }
        }
      };
      expect(encounter.adjustedExp).toEqual(100);
    });

    it('should return multiplied exp', function() {
      misc.getMultiplier.onFirstCall().returns(1.5);
      encounter.qty = 2;
      encounter.groups = {
        "A": {
          qty: 2,
          monster: {
            cr: {
              exp: 100
            }
          }
        }
      };

      expect(encounter.adjustedExp).toEqual(300);
    });
  });
  
  describe('difficulty', function() {

    beforeEach(function() {
      partyInfo.partyLevels = [{
        playerCount: 4,
        level: {
          'easy': 101,
          'medium': 201,
          'hard': 301,
          'deadly': 401
        }
      }];
    });
      
    it('should return false if the adjusted exp is zero', function() {
      encounter.groups = {};
      expect(encounter.difficulty).toEqual(false);
    });
    
    [
      {exp: 100, result: ""},
      {exp: 200, result: "Easy"},
      {exp: 300, result: "Medium"},
      {exp: 400, result: "Hard"},
      {exp: 500, result: "Deadly"}
    ].forEach(function(run) {
      it('should be ' + run.result, function() {
        var playerCount = 4;
        encounter.qty = 1;

        // Multiply by player count because if we change the qty it will change the multiplier
        encounter.groups = {
          "A": {
            qty: 1,
            monster: {
              cr: {
                exp: run.exp * playerCount
              }
            }
          }
        };

        expect(encounter.difficulty).toEqual(run.result);
      });
    });
  });

  describe('generateRandom', function() {
    it('should add random monsters to encounter', function() {
      var targetDifficulty = 'easy',
        targetExp = 1600,
        filters = {},
        playerCount = 4;
      
      partyInfo.partyLevels = [{
        playerCount: playerCount,
        level: {
          'easy': 400,
          'medium': 600,
          'hard': 800,
          'deadly': 1000
        }
      }];
      
      var monsterA = { 
        id: "golem",
        cr: {
          exp: 100
        }
      },
      monsterB = {
        id: "goblin",
        cr: {
          exp: 50
        }
      };
      var monsters = [
        { monster: monsterA, qty: 1 },
        { monster: monsterB, qty: 2}
      ];
      randomEncounter.getRandomEncounter.withArgs(playerCount, targetExp, filters).returns(monsters);

      encounter.generateRandom(filters, targetDifficulty);

      expect(randomEncounter.getRandomEncounter).toHaveBeenCalled();
      var expectedGroups = {
        "golem": {
          qty: 1,
          monster: monsterA
        },
        "goblin": {
          qty: 2,
          monster: monsterB
        }
      };
      expect(encounter.groups).toEqual(expectedGroups);
      expect(encounter.qty).toEqual(3);
      expect(encounter.exp).toEqual(200);
    });

    it('should default to medium difficulty', function() {
      var playerCount = 4;
      var targetExp = 1600,
        filters = {};
      
      partyInfo.partyLevels = [{
        playerCount: playerCount,
        level: {
          'easy': 200,
          'medium': 400,
          'hard': 800,
          'deadly': 1600
        }
      }];
      
      randomEncounter.getRandomEncounter.withArgs(playerCount, targetExp, filters).returns([]);

      encounter.generateRandom(filters);

      expect(randomEncounter.getRandomEncounter).toHaveBeenCalledWith(playerCount, targetExp, filters);
    });
  });

  describe('add', function() {
    beforeEach(function() {
      encounter.reset();
    });

    it('should default qty to 1 if none provided ', function() {
      var monster = {
        id: "ELEMENTAL",
        cr: {
          exp: 500
        }
      };

      encounter.add(monster);

      var expectedGroups = {
        "ELEMENTAL": {
          qty: 1,
          monster: monster
        }
      };

      expect(encounter.groups).toEqual(expectedGroups);
      expect(encounter.qty).toEqual(1);
      expect(encounter.exp).toEqual(500);
      expect(encounter.reference).toBeNull();
    });

    it('should add monster to groups and update all cumulative properties', function() {
      var monster = {
        id: "ELEMENTAL",
        cr: {
          exp: 500
        }
      };

      encounter.add(monster, 2);

      var expectedGroups = {
        "ELEMENTAL": {
          qty: 2,
          monster: monster
        }
      };

      expect(encounter.groups).toEqual(expectedGroups);
      expect(encounter.qty).toEqual(2);
      expect(encounter.exp).toEqual(1000);
      expect(encounter.reference).toBeNull();
    });
  });
    
  describe('qty', function() {
    it('should give correct total quantity', function() {
      var monsterA = { 
        id: "golem",
        cr: {
          exp: 100
        }
      },
      monsterB = {
        id: "goblin",
        cr: {
          exp: 50
        }
      };

      encounter.add(monsterA, 1);
      encounter.add(monsterB, 2);

      expect(encounter.qty).toEqual(3);
    });
  });

  describe('exp', function() {
    it('should be undefined if there are no monsters in the encounter', function() {
      expect(encounter.exp).not.toBeDefined();
    });

    it('should give correct total exp', function() {
      var monsterA = { 
        id: "golem",
        cr: {
          exp: 100
        }
      },
      monsterB = {
        id: "goblin",
        cr: {
          exp: 50
        }
      };

      encounter.add(monsterA, 2);
      encounter.add(monsterB, 1);

      expect(encounter.exp).toEqual(250);
    });
  });

  describe('threat', function() {
    it('should be correct when party size is normal', function() {
      partyInfo.partyLevels = [{
        playerCount: 4,
        level: {
          'easy': 100,
          'medium': 200,
          'hard': 300,
          'deadly': 400
        }
      }];

      expect(encounter.threat.deadly).toEqual(1600);
      expect(encounter.threat.hard).toEqual(1200);
      expect(encounter.threat.medium).toEqual(800);
      expect(encounter.threat.easy).toEqual(400);
      expect(encounter.threat.pair).toEqual(800 / 3);
      expect(encounter.threat.group).toEqual(800 / 8);
      expect(encounter.threat.trivial).toEqual(800 / 20);
    });

    it('should be correct when party size is small', function() {
      partyInfo.partyLevels = [{
        playerCount: 2,
        level: {
          'easy': 100,
          'medium': 200,
          'hard': 300,
          'deadly': 400
        }
      }];

      expect(encounter.threat.deadly).toEqual(800 / 1.5);
      expect(encounter.threat.hard).toEqual(600 / 1.5);
      expect(encounter.threat.medium).toEqual(400 / 1.5);
      expect(encounter.threat.easy).toEqual(200 / 1.5);
      expect(encounter.threat.pair).toEqual(400 / 4);
      expect(encounter.threat.group).toEqual(400 / 10);
      expect(encounter.threat.trivial).toEqual(400 / 24);
    });

    it('should be correct when party size is large', function() {
      partyInfo.partyLevels = [{
        playerCount: 6,
        level: {
          'easy': 100,
          'medium': 200,
          'hard': 300,
          'deadly': 400
        }
      }];

      expect(encounter.threat.deadly).toEqual(2400 / 0.5);
      expect(encounter.threat.hard).toEqual(1800 / 0.5);
      expect(encounter.threat.medium).toEqual(1200 / 0.5);
      expect(encounter.threat.easy).toEqual(600 / 0.5);
      expect(encounter.threat.pair).toEqual(1200 / 2);
      expect(encounter.threat.group).toEqual(1200 / 6);
      expect(encounter.threat.trivial).toEqual(1200 / 16);
    });
  });
});