describe('PartyLevel Service', function() {
  beforeEach(function() {
    bard.appModule('app');
    bard.inject(this, '$rootScope', 'partyInfo', 'encounter', 'store', '$q', 'playerLevels', 'randomEncounter');

    bard.mockService(store, {
      get: sinon.stub(),
      hasKey: sinon.stub(),
      remove: sinon.stub(),
      set: sinon.stub()
    });
    randomEncounter.getRandomEncounter = sinon.stub();
  });
  
  describe('initialize', function() {
    var level;
    beforeEach(function() {
      level = {
          level: 4,
          easy: 1,
          medium: 2,
          hard: 3,
          deadly: 4
        };
      playerLevels[4] = level;
    });

    it('should load info from party info token', function() {
      var groupInfo = {
        level: 4,
        playerCount: 6
      };
      store.hasKey.withArgs("5em-party-info").returns(true);
      store.get.withArgs("5em-party-info").returns($q.when([groupInfo]));
      partyInfo.initialize();
      $rootScope.$apply();
      expect(partyInfo.partyLevels[0].level).toEqual(level);
      expect(partyInfo.partyLevels[0].level.level).toEqual(4);
      expect(partyInfo.totalPlayerCount).toEqual(6);
      expect(store.get.withArgs("5em-encounter")).not.toHaveBeenCalled();
    });

    it('should load encounter token if it exists and convert it', function() {
      var groupInfo = {
        groups: {},
        partyLevel: 4,
        playerCount: 4
      };
      store.hasKey.withArgs("5em-party-info").returns(false);
      store.get.withArgs("5em-encounter").returns($q.when(groupInfo));
      partyInfo.initialize();
      $rootScope.$apply();
      expect(partyInfo.partyLevels[0].level).toEqual(level);
      expect(partyInfo.totalPlayerCount).toEqual(4);
      expect(store.get).not.toHaveBeenCalledWith("5em-party-info");
      expect(store.set).toHaveBeenCalledWith("5em-party-info", [{
        level: 4,
        playerCount: 4
      }]);
      expect(store.remove).not.toHaveBeenCalled();
    });

    it('should remove token if it is no longer in use', function() {
      store.hasKey.withArgs("5em-party-info").returns(false);
      store.hasKey.withArgs("5em-current-encounter").returns(true);
      var groupInfo = {
        groups: {},
        partyLevel: 4,
        playerCount: 4
      };
      store.get.withArgs("5em-encounter").returns($q.when(groupInfo));
      partyInfo.initialize();
      $rootScope.$apply();
      expect(store.remove).toHaveBeenCalledWith("5em-encounter");
    });
  });

  describe('freeze', function() {
    it('should save as array', function() {
      partyInfo.partyLevels = [
        {
          level: {
            level: 4,
            easy: 100
          },
          playerCount: 4
        },
        {
          level: {
            level: 3,
            easy: 75
          },
          playerCount: 1
        }
      ];

      partyInfo.freeze();
      expect(store.set).toHaveBeenCalledWith('5em-party-info', 
      [{
        level: 4,
        playerCount: 4
      },
      {
        level: 3,
        playerCount: 1
      }]);
    });
  });

  describe('totalPlayerCount', function() {
    it('sum of all party levels', function() {
      partyInfo.partyLevels = [
        { playerCount: 2 },
        { playerCount: 4 }
      ];
      expect(partyInfo.totalPlayerCount).toEqual(6);
    });
  });

  describe('totalPartyExpLevels', function() {
    beforeEach(function() {
      partyInfo.partyLevels = [{}];
      partyInfo.partyLevels[0].level = {
        easy: 2,
        medium: 4,
        hard: 6,
        deadly: 8
      };
      partyInfo.partyLevels[0].playerCount = 4;
    });

    it('should calculate total exp levels map', function() {
      var totalExp = partyInfo.totalPartyExpLevels;
      expect(totalExp).toBeDefined();
      expect(totalExp.easy).toEqual(8);
      expect(totalExp.medium).toEqual(16);
      expect(totalExp.hard).toEqual(24);
      expect(totalExp.deadly).toEqual(32);
    });

    it('should calculate with multiple levels', function() {
      partyInfo.partyLevels.push({
        level: {
          level: 1,
          easy: 2,
          medium: 4,
          hard: 6,
          deadly: 8
        },
        playerCount: 2
      });

      var totalExp = partyInfo.totalPartyExpLevels;
      expect(totalExp).toBeDefined();
      expect(totalExp.easy).toEqual(12);
      expect(totalExp.medium).toEqual(24);
      expect(totalExp.hard).toEqual(36);
      expect(totalExp.deadly).toEqual(48);
    });
    
  });
});