(function() {
	"use strict";

	angular.module("app").factory("googleSheetLoader", googleSheetService);

	googleSheetService.$inject = ["$q"];
	function googleSheetService($q) {
		// Loads a published google sheet by ID. Example usage:
		// googleSheetService(sheetId).then(function (data) {})

		// data will be an object. The keys of this object are names of sheets from the workbook
		// (e.g. "Sheet1"). The value for each of those keys is an array of objects. Each of those
		// objects is one row from that sheet, with keys based on the header row from that sheet.

		// Example:
		// {
		// 	"Sheet1": [
		// 		{ "name": "Ancient Red Dragon", "alignment": "Chaotic evil" }
		// 	]
		// }

		// Two important things to note:

		// 1: The column names from the header row will have illegal characters like spaces removed,
		// and will be entirely lowercased

		// 2: Empty cells will be omitted from the individual objects lacking entries for those
		// cells
		return {
			loadIndex: partialLoader.bind(null, $q),
		};
	}

	// Heavily modified version of my gs-loader script
	var partialLoader = (function () {
		var jsonpcount = 0;
		var sheets = {};

		// Get AJAX using jsonp
		function getSheetsJsonp($q, url) {
			var callbackName = "__jsonpcallback" + jsonpcount++;

			var deferred = $q.defer();

			window[callbackName] = function jsonpCallback(data) {
				var timestamp = data.feed.updated.$t;
				deferred.resolve({
					timestamp: timestamp,
					data: data.feed.entry
				});
				delete window[callbackName];
			};

			var script = document.createElement("script");
			script.src = url + "?alt=json-in-script&callback=" + callbackName;
			script.addEventListener("load", function () {
				this.parentNode.removeChild(this);
			}, false);

			document.head.appendChild(script);

			return deferred.promise;
		}

		function parseLine(ws, data) {
			data.forEach(function (line) {
				var parsedObject = {};
				Object.keys(line).forEach(function (key) {
					var val = line[key].$t;

					if ( !val ) { return; }

					// The fields that contain the cell values are named "gsx$colName"
					var match = key.match(/^gsx\$(.+)/);

					if ( !match ) { return; }

					var col = match[1];

					parsedObject[col] = val;

				});
				ws.push(parsedObject);
			});
		}

		function loadIndex($q, id) {
			var url = "https://spreadsheets.google.com/feeds/worksheets/" + id + "/public/full";

			// Step 1: Get a list of all the worksheets in the spreadsheet
			return getSheetsJsonp($q, url)
			.then(function (indexData) {
				return {
					timestamp: indexData.timestamp,
					loadSheets: loadSheets.bind(null, $q, indexData.data),
				};
			});
		}

		function loadSheets($q, indexData) {
			var worksheetPromises = [];
			var worksheets = {};

			indexData.forEach(function (worksheet) {
				var name = worksheet.title.$t;
				var ws = worksheets[name] = [];

				// Step 2: For each worksheet, parse its listfeed
				worksheet.link.some(function (link) {
					if ( link.rel.match(/listfeed/) ) {
						worksheetPromises.push(
							getSheetsJsonp($q, link.href)
							.then(function (sheetData) {
								// Don't care about timestamp of individual sheets
								return sheetData.data;
							})
							.then(parseLine.bind(null, ws))
						);
						return true;
					}
				});
			});

			return $q.all(worksheetPromises)
			.then(function () {
				return worksheets;
			});
		}

		// Cache results for each id
		function load($q, id, args) {
			args = args || {};
			if ( args.noCache ) {
				delete sheets[id];
			}

			sheets[id] = sheets[id] || loadIndex($q, id);

			return sheets[id];
		}

		return load;
	}());
})();
