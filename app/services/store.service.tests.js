
describe('store tests', function() {
    beforeEach(function() {
        bard.appModule('app');
        bard.inject(this, '$rootScope', 'store', '$q', '$window', 'localStorageService');

        sinon.spy($window.localStorage, 'getItem');
        bard.mockService(localStorageService, {
            get: sinon.stub(),
            keys: sinon.stub()
        });
    });

    afterEach(function() {
        $window.localStorage.getItem.restore();
    })

    describe('store.get', function() {
        it('should return local storage value', function(done) {
            localStorageService.get.returns({ my: 'encounter'});
            
            store.get('5e-test').then(function (data) {
                expect($window.localStorage.getItem).not.toHaveBeenCalled();
                expect(data).toBeDefined();
                expect(data.my).toEqual("encounter");
                done();
            });
            $rootScope.$apply();
        });
    });

    describe('store.hasKey', function() {
       it('should return true if key is in local storage', function() {
           localStorageService.keys.returns([ 'mykey' ]);
           expect(store.hasKey('mykey')).toEqual(true);
       });

       it('should return false if key is missing', function() {
           localStorageService.keys.returns([ ]);
           expect(store.hasKey('mykey')).toEqual(false);
       });
    });
});
    
    