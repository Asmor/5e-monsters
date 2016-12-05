
describe('store tests', function() {
    beforeEach(module('app'));

    describe('store.get', function() {
        var $rootScope, store, localStorageService, $window;
        
        beforeEach(inject(function(_$rootScope_, _store_, _localStorageService_, _$window_) {
            $rootScope = _$rootScope_;
            store = _store_;
            localStorageService = _localStorageService_;
            $window = _$window_;
        }));
        
        it('should return local storage value', function(done) {
            spyOn($window.localStorage, 'getItem').and.callThrough();
            spyOn(localStorageService, 'get').and.returnValue({ my: 'encounter'});
            
            store.get('5e-test').then(function (data) {
                expect($window.localStorage.getItem).not.toHaveBeenCalled();
                expect(data).toBeDefined();
                expect(data.my).toBe("encounter");
                done();
            });
            $rootScope.$apply();
        });
            
    });
        
});
    
    