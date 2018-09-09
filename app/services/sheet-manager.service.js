(function() {
"use strict";

angular.module("app").factory("sheetManager", sheetManager);

var sheetMetaData = {
	"1I5W-x8QOcP2siGCPIhWWzKGWt4vyBivYLbmkv_G1B24": { name: "Official", timestamp: 0 },
	"1YR8NBDp8BP4Lz-CWChh6-8dOPN7aYV_dRD6g9ZBvNqM": { name: "Third-Party", timestamp: 0 },
	"1x6xC8fHZ6N6M2wOuwPTNdn0ObCPtdqeIBtXaLjHBMYQ": { name: "Community", timestamp: 0 },
};
var remove = ["19ngAA7d1eYKiBtKTsg8Qcsq_zhDSBzEMxXS45eCdd7I"];
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
	var googleSheetLoader = args.googleSheetLoader;
	var timestamp = args.timestamp;

	return googleSheetLoader.loadIndex(sheetId)
	.then(function (sheetIndex) {
		var remoteTimestamp = Date.parse(sheetIndex.timestamp);
		if (logging) console.log("Loaded sheetIndex, remote timestamp:", remoteTimestamp);

		if ( remoteTimestamp > timestamp ) {
			if (logging) console.log("We're out of date", timestamp);
			// We're out of date, load remotely
			return sheetIndex.loadSheets()
				.then(function (sheetData) {
					if (logging) console.log("Sheet data loaded", sheetData);
					updateTimestamp({
						store: store,
						sheetId: sheetId,
						timestamp: remoteTimestamp,
					});

					var cacheId = generateCacheId(sheetId);
					store.set(cacheId, sheetData);
					return sheetData;
				});
		} else {
			if (logging) console.log("We're fresh", timestamp);
			// Our data are fresh, load from cache
			return loadFromCache({
				store: store,
				sheetId: sheetId,
			});
		}
	})
	.catch(function () {
		if (logging) console.log("There was an error live loading");
		return loadFromCache({
			store: store,
			sheetId: sheetId,
		});
	})
	;
}

function updateTimestamp(args) {
	var store = args.store;
	var sheetId = args.sheetId;
	var timestamp = args.timestamp;

	sheetMetaData[sheetId].timestamp = timestamp;
	saveMetaData(store);
}

function insertSheet(args) {
	var sheetId = args.sheetId;
	var store = args.store;
	var googleSheetLoader = args.googleSheetLoader;
	var monsters = args.monsters;
	var custom = args.custom;
	var name = args.name;

	if (logging) console.log("Processing sheet", args);
	var sheetPromise;
	if ( !sheetMetaData[sheetId] ) {
		sheetMetaData[sheetId] = {
			name: name,
			timestamp: 0,
			custom: custom,
		};
		saveMetaData(store);
	}
	var timestamp = sheetMetaData[sheetId].timestamp;

	if ( navigator.onLine ) {
		if (logging) console.log("We're online");
		sheetPromise = loadLive({
			store: store,
			sheetId: sheetId,
			googleSheetLoader: googleSheetLoader,
			timestamp: timestamp,
		});
	} else {
		if (logging) console.log("We're offline");
		sheetPromise = loadFromCache({
			store: store,
			sheetId: sheetId,
		});
	}

	sheetPromise.then(function (sheets) {
		if (logging) console.log("Got sheets!", sheets);
		monsters.loadSheet({
			sheets: sheets,
			sheetId: sheetId,
			custom: custom,
		});
	});
}

function saveMetaData(store) {
	if (logging) console.log("Storing sheetMetaData", sheetMetaData);
	store.set(sheetMetaStorageKey, sheetMetaData);
}

sheetManager.$inject = ["$q", "googleSheetLoader", "monsters", "store"];
function sheetManager($q, googleSheetLoader, monsters, store) {
	$q.all([
		store.get(sheetMetaStorageKey).catch(function () { return null; }),
		store.get(legacySheetDataKey).catch(function () { return []; }),
	])
	.then(function (stored) {
		var cachedMetaData = stored[0];
		var legacySheetData = stored[1];
		// sheetMetaData is initialized to default values; if we have cached data, overwrite the
		// defaults
		if ( cachedMetaData ) {
			// integrate in all the default IDs in case any are new since last time metadata were cached
			Object.keys(sheetMetaData).forEach(function (sheetId) {
				if ( !cachedMetaData[sheetId] ) {
					cachedMetaData[sheetId] = sheetMetaData[sheetId];
				}
			});
			sheetMetaData = cachedMetaData;
		}

		// For compatibility reasons, may need to remove access to some sheets
		remove.forEach(function (sheetId) {
			delete sheetMetaData[sheetId];
		});

		// Integrate legacy data into the sheetMetaData
		(legacySheetData || []).forEach(function (legacyData) {
			sheetMetaData[legacyData.id] = {
				name: legacyData.name,
				timestamp: 0,
				custom: true,
			};
		});

		// Clear out legacy data now that they've been integrated
		store.set(legacySheetDataKey, []);

		// Finally, parse the sheets!
		Object.keys(sheetMetaData).forEach(function (sheetId) {
			var timestamp = sheetMetaData[sheetId].timestamp;
			var custom = sheetMetaData[sheetId].custom;
			// If it's a custom sheet and it's never been loaded before, enable it by default
			var enbleByDefault = custom && !timestamp;

			insertSheet({
				sheetId: sheetId,
				store: store,
				googleSheetLoader: googleSheetLoader,
				monsters: monsters,
				custom: enbleByDefault,
			});
		});
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
				googleSheetLoader: googleSheetLoader,
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
