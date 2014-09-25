/* global registerMonster */
/* global registerSource */
"use strict";

(function () {
	var sourceName = "Player's Handbook",
		i, toAdd;

	registerSource(sourceName, true);

	toAdd = [
		[ "Bat", 304 ],
		[ "Black Bear", 304 ],
		[ "Boar", 304 ],
		[ "Brown Bear", 304 ],
		[ "Cat", 305 ],
		[ "Constrictor Snake", 305 ],
		[ "Crocodile", 305 ],
		[ "Dire Wolf", 305 ],
		[ "Frog", 305 ],
		[ "Giant Eagle", 306 ],
		[ "Giant Spider", 306 ],
		[ "Hawk", 306 ],
		[ "Imp", 306 ],
		[ "Lion", 307 ],
		[ "Mastiff", 307 ],
		[ "Mule", 307 ],
		[ "Owl", 308 ],
		[ "Panther", 308 ],
		[ "Poisonous Snake", 308 ],
		[ "Pseudodragon", 308 ],
		[ "Quasit", 309 ],
		[ "Rat", 309 ],
		[ "Raven", 309 ],
		[ "Reef Shark", 309 ],
		[ "Riding Horse", 310 ],
		[ "Skeleton", 310 ],
		[ "Sprite", 310 ],
		[ "Tiger", 311 ],
		[ "Warhorse", 311 ],
		[ "Wolf", 311 ],
		[ "Zombie", 311 ],
	];

	for ( i = 0; i < toAdd.length; i++ ) {
		registerMonster(toAdd[i][0], sourceName, toAdd[i][1]);
	}
}());
