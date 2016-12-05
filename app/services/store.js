(function() {
	"use strict";

	angular.module("app")
		.factory("store", StoreService);

	StoreService.$inject = ['$q', '$log', 'localStorageService'];

	function StoreService($q, $log, localStorageService) {
		var store = {
			get: function (key) {
				return $q(function(resolve, reject) {
					var data;

					try {
						data = localStorageService.get(key);
						resolve(data);
					} catch (ex) {
						$log.warn("Unable to parse stored value for " + key);
						data = undefined;
						reject("Unable to parse stored value for " + key);
					}
				});
			},
			set: function (key, data) {
				$log.debug("Setting store value for: " + key);
				localStorageService.set(key, data);
			},
		};

		return store;
	};
})();
