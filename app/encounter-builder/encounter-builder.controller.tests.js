
describe('Encounter Builder Controller', function() {
  
  var scope;
  beforeEach(function() {
    bard.appModule('app');
    bard.inject(this, '$controller', '$rootScope', 'store', 'actionQueue', 'encounter', 'monsters', 'sources', '$q');

    scope = $rootScope.$new();
    actionQueue.clear = sinon.stub();
    sources.filters = ['filter'];
    store.get = sinon.stub().returns($q.when({}));
  });

  var ctrl;

  function createController() {
    ctrl = $controller('EncounterBuilderController', {$scope: scope, actionQueue: actionQueue});
  }

  describe('activate', function() {
    
    it('should clear action queue', function() {
      createController();
      expect(actionQueue.clear).toHaveBeenCalled();
    });
    
    it('should init filters', function() {
      createController();
      expect(ctrl.filters).toEqual({
        source: ['filter'],
        pageSize: 10
      })
    });
    
    it('should thaw filters', function() {
      createController();
      expect(store.get).toHaveBeenCalledWith('5em-filters');
    });
      
  });

});
