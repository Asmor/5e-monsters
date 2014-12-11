"use strict";

define(function () {
	return ["account", function (account) {
		var store = {
			get: function (key, callback) {
				account.userScope.watch(key, callback);
			},
			set: function (key, data) {
				account.userScope.set(key, data);
			},
		};

		return store;
	}];
});