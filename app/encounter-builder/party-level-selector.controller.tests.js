describe('PartyLevelSelectorController', function() {
  var ctrl, scope;

  beforeEach(function() {
    bard.appModule('app');
    bard.inject(this, '$controller', '$rootScope', 'playerLevels', 'partyInfo');
    
    scope = $rootScope.$new();
    createController();
  });

  function createController() {
    ctrl = $controller('PartyLevelSelectorController', {playerLevels: playerLevels, partyInfo: partyInfo});
  }

  describe('removePartyLevel', function() {
    it('should remove the given element', function() {
      var level = {
        level: {},
        playerCount: 2
      };
      partyInfo.partyLevels = [
        level
      ];

      partyInfo.freeze = sinon.stub();

      ctrl.removePartyLevel(level);
      expect(partyInfo.partyLevels.length).toEqual(0);
      expect(partyInfo.freeze).toHaveBeenCalled();
    });
  });
});