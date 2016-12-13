
describe('Players service tests', function() {
    var returnVal;
    var mockStore = {
        get: function() {}
    };
    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.value('store', mockStore);
    }));

    describe('thaw tests', function() {
        var $scope, players;

        beforeEach(inject(function (_$rootScope_, $q, $injector) {
            $scope = _$rootScope_.$new();
            
            spyOn(mockStore, 'get').and.returnValue($q.when([
                {id: 1}
            ]));
            players = $injector.get('players');
        }));
            
        it('calls store and gets data', function() {
            expect(mockStore.get).toHaveBeenCalledWith('5em-players');
            $scope.$digest();
            expect(players.parties).toEqual([ { id: 1 } ]);
        });
    });  
});
    