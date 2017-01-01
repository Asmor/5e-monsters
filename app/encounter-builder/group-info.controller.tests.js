
describe('Group Info Controller', function() {
  beforeEach(module("app"));

  var ctrl;

  beforeEach(inject(function($controller, _encounter_) {
    var playerLevels = {
      1: {},
      2: {}
    };
    ctrl = $controller('GroupInfoController', {encounter: _encounter_, playerLevels: playerLevels});
  }));
  
  describe('inialization', function() {
    
    it('sets player levels', function() {
      expect(ctrl.levels).toEqual({1: {}, 2: {}});
    });
  });
});
  