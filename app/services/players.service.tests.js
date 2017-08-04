
describe('Players service tests', function() {
    var returnVal;

    beforeEach(function() {
        bard.appModule('app');
        bard.inject(this, '$rootScope', '$q', 'players', 'store');

        store.get = sinon.stub().returns($q.when([]));
    });

    describe('initialize', function() {
        it('calls store and gets data', function() {
            var testPlayers = [ { id: 1 } ];
            store.get.withArgs('5em-players').returns($q.when(testPlayers));
            players.initialize();
            sinon.assert.calledWith(store.get, '5em-players');
            $rootScope.$apply();
            expect(players.parties).toEqual(testPlayers);
        });
    });  
});
    