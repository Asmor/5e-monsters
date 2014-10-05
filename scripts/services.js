/* exported Services */
/* global alignments */
/* global checkMonster */
/* global crList */
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
	encounter: function () {
		return {
			generateRandom: generateRandomEncounter,
			freeze: function (encounter) {
				var o = {
					exp: encounter.exp,
					groups: {},
					partyLevel: encounter.partyLevel.level,
					playerCount: encounter.playerCount,
					qty: encounter.qty,
				};

				Object.keys(encounter.groups).forEach(function (monsterId) {
					o.groups[monsterId] = encounter.groups[monsterId].qty;
				});

				return o;
			},
			thaw: function (encounter) {
				var o = {
					exp: encounter.exp,
					groups: {},
					partyLevel: levels[encounter.partyLevel - 1], // level 1 is index 0, etc
					playerCount: encounter.playerCount,
					qty: encounter.qty,
					threat: {},
				};

				Object.keys(encounter.groups).forEach(function (monsterId) {
					if ( !monstersById[monsterId] ) {
						console.log("Can't find", monsterId);
						return;
					}

					o.groups[monsterId] = {
						qty: encounter.groups[monsterId],
						monster: monstersById[monsterId],
					};
				});

				return o;
			}
		};
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
	party: function () {
		return {
			getMultiplier: getMultiplier,
		};
	},
	sources: function () {
		return {
			all: sources,
			filters: sourceFilters,
		};
	},
	util: function () {
		return {
			getShuffledMonsterList: getShuffledMonsterList,
			partialFactory: partialFactory,
		};
	},
};