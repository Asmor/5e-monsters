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
      expect(partyInfo.partyLevel).toEqual(level);
      expect(partyInfo.partyLevel.level).toEqual(4);
      expect(partyInfo.playerCount).toEqual(6);
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
      expect(partyInfo.partyLevel).toEqual(level);
      expect(partyInfo.playerCount).toEqual(4);
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
      partyInfo.partyLevel = {
        level: 4
      };
      partyInfo.playerCount = 4;

      partyInfo.freeze();
      expect(store.set).toHaveBeenCalledWith('5em-party-info', 
      [{
        level: 4,
        playerCount: 4
      }]);
    });
  });
});