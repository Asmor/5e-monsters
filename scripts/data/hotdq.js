/* global registerMonster */
/* global registerSource */
"use strict";

(function () {
	var sourceName = "Hoard of the Dragon Queen",
		i, toAdd;

	registerSource(sourceName, true);

	toAdd = [
		[ "Ambush Drake", 88 ],
		[ "Dragonclaw", 89 ],
		[ "Dragonwing", 89 ],
		[ "Guard Drake", 91 ],
	];

	for ( i = 0; i < toAdd.length; i++ ) {
		registerMonster(toAdd[i][0], sourceName, toAdd[i][1]);
	}
}());
