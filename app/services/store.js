(function() {
	"use strict";

	angular.module("app")
		.factory("store", StoreService);

	function StoreService() {
		var store = {
			get: function (key, callback) {
				var data;
				var raw = localStorage[key];

				if (raw) {
					try {
						data = JSON.parse(localStorage[key]);
					} catch (ex) {
						console.warn("Unable to parse stored value for " + key);
						data = undefined;
					}
				}

				callback(data);
			},
			set: function (key, data) {
				localStorage[key] = JSON.stringify(data);
			},
		};

		return store;
	};
})();
