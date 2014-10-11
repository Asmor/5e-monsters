/* exported Services */
/* global NO_MONSTERS */
/* global NO_PLAYERS */
/* global READY */
/* global alignments */
/* global checkMonster */
/* global crList */
/* global d */
/* global environments */
/* global generateRandomEncounter */
/* global getMultiplier */
/* global getShuffledMonsterList */
/* global levels */
/* global monsters */
/* global monstersById */
/* global partialFactory */
/* global sourceFilters */
/* global sources */
/* global tags */
/* global sizes */
/* global types */
"use strict";

var Services = {
	account: function ($rootScope) {
		var fb = new Firebase("https://resplendent-torch-9803.firebaseio.com"),
			account = {
				fb: fb,
				login: function (args) {
					if ( args.with && args.with.match(/^(github|google|twitter)$/) ) {
						fb.authWithOAuthPopup(args.with, function (error, authData) {
							$rootScope.$apply(function () {
								if ( typeof args.callback === "function" ) {
									args.callback(error, authData);
								}
							});
						});
					} else if ( args.anonymous ) {
						fb.authAnonymously(function (error, authData) {
							$rootScope.$apply(function () {
								if ( typeof args.callback === "function" ) {
									args.callback(error, authData);
								}
							});
						});
					} else {
						fb.authWithPassword({
							// Not currently implemented in app
							email: args.email,
							password: args.password,
						}, function (error) {
							$rootScope.$apply(function () {
								if ( typeof args.callback === "function" ) {
									args.callback(error);
								}
							});
						});
					}
				},
				logout: function () {
					fb.unauth();
				},
				userScope: {
					get: function (key, callback) {
						if ( ! account.loginProvider ) {
							// If they're not already logged in, log them in anonymously
							account.login({
								anonymous: true,
								callback: function () {
									getUserScopeValue(key, callback);
								}
							});
						} else {
							getUserScopeValue(key, callback);
						}
					},
					set: function (key, data) {
						var o = {};
						o[key] = data;

						if ( ! account.loginProvider ) {
							// If they're not already logged in, log them in anonymously
							account.login({
								anonymous: true,
								callback: function () {
									setUserScopeValue(key, data);
								}
							});
						}

						setUserScopeValue(key, data);
					},
				},
			};
			

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

		function getUserScopeValue(key, callback) {
			var authData = fb.getAuth();

			if ( !authData || !callback ) {
				return;
			}

			fb.child([ "user", authData.uid, key ].join("/")).once('value', function (value) {
				callback(value.val());
			});
		}

		function setUserScopeValue(key, data) {
			var authData = fb.getAuth(),
				o = {};

			if ( !authData ) {
				return;
			}

			o[key] = data;

			fb.child([ "user", authData.uid, key ].join("/")).set(data);
		}

		return account;
	},
	actionQueue: function () {
		var actionQueue = {
				actions: [],
				currentInstruction: "",
				clear: function () {
					actionQueue.actions.length = 0;
					actionQueue.currentInstruction = "";
				},
				next: function ($state) {
					if ( actionQueue.actions.length ) {
						var current = actionQueue.actions.shift();
						actionQueue.currentInstruction = current.message || "";

						$state.go(current.state);
						return true;
					}

					return false;
				},
				queue: function (nextState, message) {
					actionQueue.actions.push({ state: nextState, message: message });
				},
		};

		return actionQueue;
	},
	combat: function (store, encounter, players, monsters, util) {
		var combat = {
			active: 0,
			combatants: [],
			delta: 0,
			addMonster: function (monster, qty) {
				qty = qty || 1;

				var i, name;

				for ( i = 0; i < qty; i++ ) {
					name = [ monster.name ];

					if ( qty > 1 ) {
						name.push( i + 1 );
					}

					combat.combatants.push({
						type: "enemy",
						name: name.join(" "),
						ac: monster.ac,
						hp: monster.hp,
						initiativeMod: monster.init,
						initiative: 10 + monster.init,
						id: monster.id,
					});
				}
			},
			addLair: function () {
				combat.combatants.push({
					type: "lair",
					name: "Lair",
					iniativeMod: 0,
					initiative: 20,
					fixedInitiative: true,
					noHp: true,
				});
			},
			addPlayer: function (player) {
				combat.combatants.push({
					type: "player",
					name: player.name,
					initiativeMod: player.initiativeMod,
					initiative: player.initiative,
					hp: player.hp,
					damage: player.damage,
				});
			},
			applyDelta: function (combatant, multiplier) {
				multiplier = multiplier || 1;
				// Make sure damage is initialized
				combatant.damage = combatant.damage || 0;

				combatant.damage += combat.delta * multiplier;
				combat.delta = 0;

				// Damage can't reduce you below 0
				if ( combatant.damage > combatant.hp ) {
					combatant.damage = combatant.hp;
				}

				// Damage can't be negative
				if ( combatant.damage < 0 ) {
					combatant.damage = 0;
				}

				if ( combatant.type === "player" ) {
					players.setDamage(combatant.name, combatant.damage);
				}
			},
			begin: function () {
				combat.combatants.sort(function (a, b) {
					return b.initiative - a.initiative;
				});

				combat.combatants[combat.active].active = true;
			},
			init: function () {
				combat.combatants.length = 0;
				combat.active = 0;
				combat.delta = 0;

				var monsterIds = Object.keys(encounter.groups),
					lair = false,
					i, monster, qty, player,
					retValue = 0;

				if ( ! monsterIds.length ) {
					// If there aren't any monsters, we can't run an encounter
					retValue |= NO_MONSTERS;
				}

				if ( ! players.selectedParty ) {
					// If there aren't any players, we can't run the encounter either...
					retValue |= NO_PLAYERS;
				}

				if ( retValue ) {
					return retValue;
				}

				for ( i = 0; i < players.selectedParty.length; i++ ) {
					player = players.selectedParty[i];
					combat.addPlayer({
						name: player.name,
						initiativeMod: player.initiativeMod,
						initiative: player.initiativeMod + 10,
						hp: player.hp,
						damage: player.damage,
					});
				}

				for ( i = 0; i < monsterIds.length; i++ ) {
					monster = monsters.byId[monsterIds[i]];
					qty = encounter.groups[monsterIds[i]].qty;
					lair = lair || monster.lair;

					combat.addMonster(monster, qty);
				}

				if ( lair ) {
					combat.addLair();
				}

				return READY;
			},
			nextTurn: function () {
				combat.combatants[combat.active].active = false;
				combat.active = ( combat.active + 1 ) % combat.combatants.length;
				combat.combatants[combat.active].active = true;
			},
			rollInitiative: function (combatant) {
				combatant.initiative = util.d(20) + combatant.initiativeMod;
				combatant.initiativeRolled = true;
			},
		};

		combat.init();

		return combat;
	},
	encounter: function ($rootScope, store, library, metaInfo, monsters, players, util) {
		var encounter = {
				getMultiplier: getMultiplier,
				groups: {},
				partyLevel: metaInfo.levels[0],
				playerCount: 4,
				reference: null,
				threat: {},
				add: function (monster, qty) {
					if ( typeof qty === "undefined" ) {
						qty = 1;
					}

					encounter.groups[monster.id] = encounter.groups[monster.id] || {
						qty: 0,
						monster: monster,
					};

					encounter.groups[monster.id].qty += qty;
					encounter.qty += qty;
					encounter.exp += monster.cr.exp * qty;

					updateLibrary();

					freeze();
				},
				generateRandom: function (filters) {
					var monsters = generateRandomEncounter(encounter.playerCount, encounter.partyLevel, filters),
						i;

					encounter.reset();

					for ( i = 0; i < monsters.length; i++ ) {
						encounter.add( monsters[i].monster, monsters[i].qty );
					}
				},
				randomize: function (monster, filters) {
					var monsterList = util.getShuffledMonsterList(monster.cr.string),
						qty = encounter.groups[monster.id].qty;

					while ( monsterList.length ) {
						// Make sure we don't roll a monster we already have
						if ( encounter.groups[monsterList[0].name] ) {
							monsterList.shift();
							continue;
						}

						if ( monsters.check( monsterList[0], filters, { skipCrCheck: true } ) ) {
							encounter.remove(monster, true);
							encounter.add( monsterList[0], qty );
							return;					
						} else {
							monsterList.shift();
						}
					}
				},
				recalculateThreatLevels: function () {
					var count = encounter.playerCount,
						level = encounter.partyLevel,
						mediumExp = count * level.medium,
						singleMultiplier  = 1,
						pairMultiplier    = 1.5,
						groupMultiplier   = 2,
						trivialMultiplier = 2.5;

					if ( count < 3 ) {
						// For small groups, increase multiplier
						singleMultiplier  = 1.5;
						pairMultiplier    = 2;
						groupMultiplier   = 2.5;
						trivialMultiplier = 3;
					} else if ( count > 5 ) {
						// For large groups, reduce multiplier
						singleMultiplier  = 0.5;
						pairMultiplier    = 1;
						groupMultiplier   = 1.5;
						trivialMultiplier = 2;
					}

					encounter.threat.deadly  = count * level.deadly / singleMultiplier;
					encounter.threat.hard    = count * level.hard / singleMultiplier;
					encounter.threat.medium  = mediumExp / singleMultiplier;
					encounter.threat.easy    = count * level.easy / singleMultiplier;
					encounter.threat.pair    = mediumExp / ( 2 * pairMultiplier );
					encounter.threat.group   = mediumExp / ( 4 * groupMultiplier );
					encounter.threat.trivial = mediumExp / ( 8 * trivialMultiplier );

					freeze();
				},
				remove: function (monster, removeAll) {
					encounter.groups[monster.id].qty--;
					encounter.qty--;
					encounter.exp -= monster.cr.exp;
					if ( encounter.groups[monster.id].qty === 0 ) {
						delete encounter.groups[monster.id];
					} else if ( removeAll ) {
						// Removing all is implemented by recurively calling this function until the qty is 0
						encounter.remove(monster, true);
					}

					updateLibrary();

					freeze();
				},
				reset: function (storedEncounter) {
					encounter.reference = null;
					encounter.qty = 0;
					encounter.exp = 0;
					encounter.groups = {};
					encounter.threat = {};

					if (storedEncounter) {
						Object.keys(storedEncounter.groups).forEach(function (id) {
							encounter.add(
								monsters.byId[id],
								storedEncounter.groups[id]
							);
						});

						encounter.reference = storedEncounter;

						freeze();
					}

					encounter.recalculateThreatLevels();
				},
		};

		Object.defineProperty(encounter, "adjustedExp", {
			get: function () {
				var qty = encounter.qty,
					exp = encounter.exp,
					multiplier = encounter.getMultiplier(encounter.playerCount, qty);

				return Math.floor(exp * multiplier);
			},
		});

		Object.defineProperty(encounter, "difficulty", {
			get: function () {
				var exp = encounter.adjustedExp,
					count = encounter.playerCount,
					level = encounter.partyLevel;

				if ( exp === 0 ) {
					return false;
				}

				if ( exp <= ( count * level.easy ) ) {
					return "Easy";
				} else if ( exp <= ( count * level.medium ) ) {
					return "Medium";
				} else if ( exp <= ( count * level.hard ) ) {
					return "Hard";
				} else if ( exp <= ( count * level.deadly ) ) {
					return "Deadly";
				} else {
					return "Ludicrous";
				}
			},
		});

		thaw();
		encounter.recalculateThreatLevels();

		function freeze() {
			var o = {
				groups: {},
				partyLevel: encounter.partyLevel.level,
				playerCount: encounter.playerCount,
			};

			Object.keys(encounter.groups).forEach(function (monsterId) {
				o.groups[monsterId] = encounter.groups[monsterId].qty;
			});

			store.set("5em-encounter", o);
		}

		function thaw() {
			encounter.reset();

			store.get("5em-encounter", function (frozen) {
				if ( !frozen ) {
					return;
				}

				encounter.partyLevel = levels[frozen.partyLevel - 1]; // level 1 is index 0, etc
				encounter.playerCount = frozen.playerCount;

				frozen.groups = frozen.groups || {};

				Object.keys(frozen.groups).forEach(function (monsterId) {
					var monster = monsters.byId[monsterId];

					if ( !monster ) {
						console.warn("Can't find", monsterId);
						return;
					}

					encounter.add(monster, frozen.groups[monsterId]);
				});

				if (!$rootScope.$$phase) {
					$rootScope.$apply();
				}
			});
		}

		function updateLibrary() {
			if ( !encounter.reference ) {
				return;
			}

			encounter.reference.groups = {};

			Object.keys(encounter.groups).forEach(function (id) {
				encounter.reference.groups[id] = encounter.groups[id].qty;
			});

			library.update();
		}

		return encounter;
	},
	library: function ($rootScope, store) {
		var library = {
				encounters: [],
				remove: function (storedEncounter) {
					library.encounters.splice(library.encounters.indexOf(storedEncounter), 1);

					freeze();
				},
				store: function (encounter) {
					 for ( var i = 0; i < library.encounters.length; i++ ) {
					 	if ( angular.equals(encounter, library.encounters[i]) ) {
					 		return library.encounters[i];
					 	}
					 }

					library.encounters.push(encounter);
					freeze();

					return encounter;
				},
				update: function () {
					freeze();
				}
		};

		thaw();

		function freeze() {
			store.set("5em-library", library.encounters);
		}

		function thaw() {
			store.get("5em-library", function (frozen) {
				if (frozen) {
					library.encounters = frozen;

					if (!$rootScope.$$phase) {
						$rootScope.$apply();
					}
				}
			});
		}

		window.library = library;
		return library;
	},
	metaInfo: function () {
		return {
			alignments: alignments,
			crList: crList,
			environments: environments,
			levels: levels,
			tags: tags,
			sizes: sizes,
			types: types,
		};
	},
	monsters: function () {
		return {
			all: monsters.sort(function (a, b) {
				return (a.name > b.name) ? 1 : -1;
			}),
			byId: monstersById,
			check: checkMonster,
		};
	},
	players: function ($rootScope, store) {
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

		thaw();

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
					//                       1       2               3              4
					m = parties[i][j].match(/(.*?)\s+([-+]?\d+)\s+(?:(\d+)\s*\/\s*)?(\d+)\s*$/);

					if ( m ) {
						parties[i][j] = {
							name: m[1],
							initiativeMod: parseInt(m[2]),
							damage: (m[3]) ? m[4] - m[3] : 0,
							hp: parseInt(m[4]),
						};
					} else {
						console.warn("Can't match:", parties[i][j]);
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
						(p.initiativeMod >= 0) ? "+" + p.initiativeMod : p.initiativeMod,
						p.hp - p.damage,
						"/",
						p.hp,
					].join(" "));
				}

				newRaw[i] = newRaw[i].join("\n");
			}

			rawText = newRaw.join("\n\n");
		}

		function freeze() {
			store.set("5em-players", parties);
		}

		function thaw() {
			store.get("5em-players", function (frozen) {
				if (frozen) {
					parties = frozen;
					partiesDirty = false;
					rawDirty = true;

					if (!$rootScope.$$phase) {
						$rootScope.$apply();
					}
				}
			});
		}

		return players;
	},
	store: function (account) {
		var store = {
			get: function (key, callback) {
				account.userScope.get(key, callback);
			},
			set: function (key, data) {
				account.userScope.set(key, data);
			},
		};

		return store;
	},
	sources: function () {
		return {
			all: sources,
			filters: sourceFilters,
		};
	},
	util: function () {
		return {
			d: d,
			getShuffledMonsterList: getShuffledMonsterList,
			partialFactory: partialFactory,
		};
	},
};