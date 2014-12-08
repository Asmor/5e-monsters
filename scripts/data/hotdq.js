"use strict";

define([
	"scripts/monster.js",
	"scripts/misc.js",
	"scripts/data/monsters",
], function (monsterLib, miscLib) {
	var sourceName = "Hoard of the Dragon Queen",
		i, toAdd;

	miscLib.registerSource(sourceName, true);

	toAdd = [
		[ "f495d63f-f936-4985-a2d3-6a8ec2a20fb0", 88 ], // Ambush Drake
		[ "ddb767bf-4484-4d5e-b54d-b03a6f9c6795", 89 ], // Dragonclaw
		[ "3bb548b6-e049-4355-84cb-47bc1d94620a", 89 ], // Dragonwing
		[ "8f11d800-1103-492b-ae24-320ef1013644", 91 ], // Guard Drake
	];

	for ( i = 0; i < toAdd.length; i++ ) {
		monsterLib.registerMonster(toAdd[i][0], sourceName, toAdd[i][1]);
	}
});
