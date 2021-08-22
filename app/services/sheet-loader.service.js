(function() {
	"use strict";

	angular.module("app").factory("googleSheetLoader", googleSheetService);

	googleSheetService.$inject = ["$q", "$http"];
	function googleSheetService($q, $http) {
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
			loadIndex: partialLoader.bind(null, $q, $http),
		};
	}

	// Heavily modified version of my gs-loader script
	var partialLoader = (function () {
		var jsonpcount = 0;
		var sheets = {};

        // LNN: Version to setup the GoogleSheets v4 API
        function getSheetsJsonFromAPI($q, $http, url){

            var deferred = $q.defer();

            $http.get(url)
                .success(function (data){
                    deferred.resolve(data)
                });

            return deferred.promise

        };

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

        // LNN: Uses the v4 of the Google Sheets API to return the same format as the v3 code
		function parseLineAPI4Data(ws, data) {
            // Slice the column headers
			var columnHeaders = {};

			// Iterate over each row from the 1st data (2nd row) onward
			data.slice(1).forEach(function (line) {
				var parsedObject = {};
				// Iterate over each column of the line, hidden under a "values" key
				line.values.forEach(function (cellData, columnIndex) {
				    // Cell data in formattedValue
				    // "effectiveValue" is a function of cell data type, e.g 'stringValue' or 'numberValue'
				    // formattedValue seems to be a consistent string
					var val = cellData.formattedValue;
					// Grab the column name
					var col = data[0].values[columnIndex].formattedValue;

					parsedObject[col] = val;

				});
				ws.push(parsedObject);
			});
		}

		function loadIndex($q, $http, id) {
			var url = "https://sheets.googleapis.com/v4/spreadsheets/" + id + "?key=AIzaSyCrZ0HaEQGNvEChWhgCUE2DwzImwQVaW6U&includeGridData=True"

			// Step 1: Get a list of all the worksheets in the spreadsheet
//			return getSheetsJsonp($q, url)  // Old Method
			return getSheetsJsonFromAPI($q, $http, url)
			.then(function (indexData) {
			    return $q.all(indexData).then(function (indexData) {
                    return {
                        // Sheets API does not get last modified timestamp. The Drive API might
                        // Assume need fresh for now to get it working, may change later (LNN: August 20, 2021)
    //					timestamp: indexData.timestamp,
                        timestamp: new Date(30000, 0),  // Assuming some ludicrous year to force reload
    //					loadSheets: loadSheets.bind(null, $q, indexData),  // Old method
                        loadSheets: loadSheetsFromData.bind(null, indexData),
                    };
				});
		    });
		}

        function loadSheetsFromData(indexData) {
            // No need for promise here since we already got data from index
			var worksheets = {};
            indexData.sheets.forEach(function (worksheet) {
				var name = worksheet.properties.title;  // Sheet Title
				var ws = worksheets[name] = [];
				// Sheet data in [data][0][rowData]
				parseLineAPI4Data(ws, worksheet.data[0].rowData)
			});
			return worksheets;
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
		function load($q, $http, id, args) {
			args = args || {};
			if ( args.noCache ) {
				delete sheets[id];
			}

			sheets[id] = sheets[id] || loadIndex($q, $http, id);

			return sheets[id];
		}

		return load;
	}());
})();
