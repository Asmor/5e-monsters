
describe('Encounter Service', function() {
  beforeEach(module("app"));

  var encounter;
  
  beforeEach(inject(function(_encounter_) {
    encounter = _encounter_;
  }));
    
  describe('adjustedExp', function() {
    
    it('should exist', function() {
      expect(encounter.adjustedExp).toBeDefined();
    });
    
    it('should return multiple', function() {
      encounter.qty = 1;
      encounter.exp = 100;
      expect(encounter.adjustedExp).toEqual(100);
    });
  });
  
  describe('difficulty', function() {
    
    beforeEach(function() {
      encounter.playerCount = 4;
      encounter.partyLevel = {
        easy: 101,
        medium: 201,
        hard: 301,
        deadly: 401
      };
    });
      
    it('should return false if the adjusted exp is zero', function() {
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
        encounter.qty = 1;
        // Multiply by player count because if we change the qty it will change the multiplier
        encounter.exp = run.exp * encounter.playerCount;
        
        expect(encounter.difficulty).toEqual(run.result);
      });
    });
  });
});
  