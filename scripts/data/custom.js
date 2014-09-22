/* global registerMonster */
/* global registerSource */
"use strict";

(function () {
	var sourceName = "Custom",
		i, toAdd;

	registerSource(sourceName, false);

	toAdd = [
		[ "CR 0" ],
		[ "CR 1/8" ],
		[ "CR 1/4" ],
		[ "CR 1/2" ],
		[ "CR 1" ],
		[ "CR 2" ],
		[ "CR 3" ],
		[ "CR 4" ],
		[ "CR 5" ],
		[ "CR 6" ],
		[ "CR 7" ],
		[ "CR 8" ],
		[ "CR 9" ],
		[ "CR 10" ],
		[ "CR 11" ],
		[ "CR 12" ],
		[ "CR 13" ],
		[ "CR 14" ],
		[ "CR 15" ],
		[ "CR 16" ],
		[ "CR 17" ],
		[ "CR 18" ],
		[ "CR 19" ],
		[ "CR 20" ],
		[ "CR 21" ],
		[ "CR 22" ],
		[ "CR 23" ],
		[ "CR 24" ],
		[ "CR 25" ],
		[ "CR 26" ],
		[ "CR 27" ],
		[ "CR 28" ],
		[ "CR 29" ],
		[ "CR 30" ],
	];

	for ( i = 0; i < toAdd.length; i++ ) {
		registerMonster(toAdd[i][0], sourceName, toAdd[i][1]);
	}
}());