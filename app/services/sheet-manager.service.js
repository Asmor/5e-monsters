(function() {
"use strict";

angular.module("app").factory("sheetManager", sheetManager);

var sheetMetaData = {
	"./json/se_sources.json": { name: "Official", revision: 0, monstersJson: "./json/se_monsters.json" },
	"./json/se_third_party_sources.json": { name: "Third Party", revision: 0, monstersJson: "./json/se_third_party_monsters.json" },
	"./json/se_community_sources.json": { name: "Community", revision: 0, monstersJson: "./json/se_community_monsters.json"},
};
var sheetMetaStorageKey = "5em-sheet-meta";
var sheetCachePartialKey = "5em-sheet-cache";
var legacySheetDataKey = "5em-custom-content";
var logging = false;

function generateCacheId(sheetId) {
	return [sheetCachePartialKey, sheetId].join(":");
}

function loadFromCache(args) {
	if (logging) console.log("Loading from cache");
	var store = args.store;
	var sheetId = args.sheetId;
	var cacheId = generateCacheId(sheetId);

	return store.get(cacheId);
}

function loadLive(args) {
	if (logging) console.log("Loading live");
	var store = args.store;
	var sheetId = args.sheetId;
	var revision = args.revision;

	return fetch(args.sheetId)
		.then(r => r.json())
		.then(async (json) => {
			let sheetData = {
				Sources: json
			}
			return sheetData;
		}).then(sheetData => {
			return fetch(sheetMetaData[sheetId].monstersJson)
				.then(r => r.json())
				.then(json => {
					sheetData.Monsters = json;
					var cacheId = generateCacheId(sheetId);
					store.set(cacheId, sheetData);
					return sheetData;
				})
		});
}

function insertSheet(args) {
	var sheetId = args.sheetId;
	var store = args.store;
	var monsters = args.monsters;
	var custom = args.custom;
	var name = args.name;

	if (logging) console.log("Processing sheet", args);
	var sheetPromise;
	if ( !sheetMetaData[sheetId] ) {
		sheetMetaData[sheetId] = {
			name: name,
			revision: 0,
			custom: custom,
		};
		saveMetaData(store);
	}
	var revision = sheetMetaData[sheetId].revision;

	if ( navigator.onLine ) {
		if (logging) console.log("We're online");
		sheetPromise = loadLive({
			store: store,
			sheetId: sheetId,
			revision: revision,
		});
	} else {
		if (logging) console.log("We're offline");
		sheetPromise = loadFromCache({
			store: store,
			sheetId: sheetId,
		});
	}

	return sheetPromise.then(function (sheets) {
		if (logging) console.log("Got sheets!", sheets);
		monsters.loadSheet({
			sheets: sheets,
			sheetId: sheetId,
			custom: custom
		});
	});
}

function saveMetaData(store) {
	if (logging) console.log("Storing sheetMetaData", sheetMetaData);
	store.set(sheetMetaStorageKey, sheetMetaData);
}

sheetManager.$inject = ["$q", "monsters", "store"];
function sheetManager($q, monsters, store) {
	$q.all([
		store.get(sheetMetaStorageKey).catch(function () { return null; }),
		store.get(legacySheetDataKey).catch(function () { return []; }),
	])
	.then(async function (stored) {
		var cachedMetaData = stored[0];
		// sheetMetaData is initialized to default values; if we have cached data, overwrite the defaults
		if ( cachedMetaData ) {
			// integrate in all the default IDs in case any are new since last time metadata were cached
			Object.keys(sheetMetaData).forEach(function (sheetId) {
				if ( !cachedMetaData[sheetId] ) {
					cachedMetaData[sheetId] = sheetMetaData[sheetId];
				}
			});
			sheetMetaData = cachedMetaData;
		}

		let promises = [];
		// Finally, parse the sheets!
		Object.keys(sheetMetaData).forEach(function (sheetId) {
			var revision = sheetMetaData[sheetId].revision;
			var custom = sheetMetaData[sheetId].custom;
			// If it's a custom sheet and it's never been loaded before, enable it by default
			var enableByDefault = custom && !revision;

			promises.push(insertSheet({
				sheetId: sheetId,
				store: store,
				monsters: monsters,
				custom: enableByDefault
			}));
		});
		await Promise.allSettled(promises).then(() => {
			window.dispatchEvent(new CustomEvent("content-loaded"));
		})
	});

	return {
		addContent: function (name, url) {
			if ( !name || !url ) {
				console.log("No name or URL");
				return;
			}

			var idMatch = url.match(/\b([-a-z0-9_]{44})\b/i);

			if ( !idMatch ) {
				console.log("No id");
				return;
			}

			var id = idMatch[1];

			if ( sheetMetaData[id] ) {
				console.log("Duplicate ID");
				return;
			}

			insertSheet({
				sheetId: id,
				name: name,
				custom: true,
				store: store,
				monsters: monsters,
			});

			return true;
		},
		getSheetMetaData: function () {
			return sheetMetaData;
		},
		removeContent: function (id) {
			if ( !sheetMetaData[id] ) {
				return;
			}

			delete sheetMetaData[id];
			saveMetaData(store);
			monsters.removeSheet(id);
		},
	};
}
}());
