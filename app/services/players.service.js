(function () {
	"use strict";

	angular.module("app")
		.factory("players", PlayersService);

	PlayersService.$inject = ["$rootScope", "store"];

	function PlayersService($rootScope, store) {
		var players = {
				selectedParty: null,
				selectParty: function (party) {
					players.selectedParty = party;
				},
				setDamage: function (name, damage) {
					for ( var i = 0; i < players.selectedParty.length; i++ ) {
						if ( players.selectedParty[i].name === name ) {
							players.selectedParty[i].damage = damage;
							rawDirty = true;
							freeze();
							return;
						}
					}
				},
				initialize: initialize
			},
			rawDirty = true,
			rawText = "",
			partiesDirty,
			parties = [];

		window.players = players;

		Object.defineProperty(players, "raw", {
			get: function () {
				if ( rawDirty ) {
					compileRaw();
				}

				return rawText;
			},
			set: function (value) {
				rawText = value;
				partiesDirty = true;
			},
		});

		Object.defineProperty(players, "parties", {
			get: function () {

				if ( partiesDirty ) {
					compileParties();
				}

				return parties;
			}
		});

		function compileParties() {
			var i, j, m;
			partiesDirty = false;
			parties = rawText.split(/\n\n+/);

			for ( i = 0; i < parties.length; i++ ) {
				parties[i] = parties[i].split("\n");
				for ( j = 0; j < parties[i].length; j++ ) {
					// 1: Name
					// 2: Initiative mod
					// 3: Remaining HP (optional)
					// 4: Max HP
					//                       1       2                   3              4
					m = parties[i][j].match(/(.*?)\s+([-+]?\d+[!]?)\s+(?:(\d+)\s*\/\s*)?(\d+)\s*$/);

					if ( m ) {
						parties[i][j] = {
							name: m[1],
							initiativeMod: parseInt(m[2].replace(/!$/, '')),
							advantageOnInitiative: m[2].endsWith('!'),
							damage: (m[3]) ? m[4] - m[3] : 0,
							hp: parseInt(m[4]),
						};
					}
				}

			}

			rawDirty = true;
			freeze();
		}

		function compileRaw() {
			var i, j, newRaw = [], p;
			rawDirty = false;
			
			for ( i = 0; i < players.parties.length; i++ ) {
				newRaw[i] = [];

				for ( j = 0; j < players.parties[i].length; j++ ) {
					p = players.parties[i][j];
					newRaw[i].push([
						p.name,
						((p.initiativeMod >= 0) ? "+" + p.initiativeMod : p.initiativeMod) + (p.advantageOnInitiative ? '!' : ''),
						p.hp - p.damage,
						"/",
						p.hp,
					].join(" "));
				}

				newRaw[i] = newRaw[i].join("\n");
			}

			rawText = newRaw.join("\n\n");
		}

		function initialize() {
			thaw();
		}

		function freeze() {
			store.set("5em-players", parties);
		}

		function thaw() {
			store.get("5em-players").then(function (frozen) {
				if (frozen) {
					parties = frozen;
					partiesDirty = false;
					rawDirty = true;
				}
			});
		}

		return players;
	}
})();
