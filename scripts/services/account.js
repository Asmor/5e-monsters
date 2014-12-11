"use strict";

define(function () {
	return ["$rootScope", function ($rootScope) {
		var fb = new Firebase("https://resplendent-torch-9803.firebaseio.com"),
			account = {
				fb: fb,
				login: function (args) {
					if ( args.with && args.with.match(/^(github|google|twitter)$/) ) {
						fb.authWithOAuthPopup(args.with, function (error, authData) {
							if (error) {
								console.warn("Failed to login", error);
							} else {
								$rootScope.$apply(function () {
									if ( typeof args.callback === "function" ) {
										args.callback(error, authData);
									}
									updateUserScope();
								});
							}
						});
					} else if ( args.anonymous ) {
						fb.authAnonymously(function (error, authData) {
							if (error) {
								console.warn("Failed to login", error);
							} else {
								$rootScope.$apply(function () {
									if ( typeof args.callback === "function" ) {
										args.callback(error, authData);
									}
									updateUserScope();
								});
							}
						});
					} else {
						fb.authWithPassword({
							// Not currently implemented in app
							email: args.email,
							password: args.password,
						}, function (error) {
							if (error) {
								console.warn("Failed to login", error);
							} else {
								$rootScope.$apply(function () {
									if ( typeof args.callback === "function" ) {
										args.callback(error);
									}
									updateUserScope();
								});
							}
						});
					}
				},
				logout: function () {
					fb.unauth();
					updateUserScope();
				},
				userScope: {
					set: function (key, data) {
						var o = {};
						o[key] = data;

						setUserScopeValue(key, data);
					},
					logout: function () {
						fb.unauth();
						updateUserScope();
					},
					userScope: {
						set: function (key, data) {
							var o = {};
							o[key] = data;

							setUserScopeValue(key, data);
						},
						watch: function (key, callback) {
							watchUserScopeValue(key, callback);
						},
					},
				},
			},
			watches = {},
			watchedScopes = [],
			userScope;

		Object.defineProperty(account, "loginProvider", {
			get: function () {
				var authData = fb.getAuth();

				if ( !authData ) {
					return null;
				}

				return authData.provider;
			},
		});

		Object.defineProperty(account, "userId", {
			get: function () {
				var authData = fb.getAuth();

				if ( !authData ) {
					return null;
				}

				return authData.uid;
			},
		});

		updateUserScope();

		function clearAllWatches() {
			while ( watchedScopes.length ) {
				watchedScopes.pop().off();
			}
		}

		function setupAllWatches() {
			clearAllWatches();

			Object.keys(watches).forEach(function (key) {
				setupWatch(key, watches[key]);
			});
		}

		function setupWatch(key, callback) {
			if ( userScope ) {
				var watchScope = userScope.child(key);
				watchScope.on("value", function (value) {
					callback(value.val());
				});

				watchedScopes.push(watchScope);
			}
		}

		function setUserScopeValue(key, data) {
			if ( userScope ) {
				userScope.child(key).set(data);
			}
		}

		function updateUserScope() {
			var authData = fb.getAuth();

			userScope = null;
			clearAllWatches();

			if ( !authData ) {
				return;
			}

			userScope = fb.child([ "user", authData.uid ].join("/"));

			setupAllWatches();
		}

		function watchUserScopeValue(key, callback) {
			watches[key] = callback;

			setupWatch(key, callback);
		}

		return account;
	}];
});
