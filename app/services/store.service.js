(function() {
	"use strict";

	angular.module("app")
		.factory("store", StoreService);

	StoreService.$inject = ['$q', 'localStorageService'];

	function StoreService($q, localStorageService) {
		var store = {
			get: function (key) {
				return $q(function(resolve, reject) {
					var data;

					try {
						data = localStorageService.get(key);
						resolve(data);
					} catch (ex) {
						data = undefined;
						reject("Unable to parse stored value for " + key);
					}
				});
			},
			set: function (key, data) {
				localStorageService.set(key, data);
			},
			remove: function (key) {
				return localStorageService.remove(key);
			},
			hasKey: function (key) {
				return _.indexOf(localStorageService.keys(), key) >= 0;
			}
		};

		return store;
	};
})();
