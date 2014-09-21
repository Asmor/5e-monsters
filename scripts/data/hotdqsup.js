/* global registerMonster */
/* global registerSource */
"use strict";

(function () {
	var sourceName = "HotDQ supplement",
		i, toAdd;

	registerSource(sourceName, false);

	toAdd = [
		[ "Acolyte", 4 ],
		[ "Adult Blue Dragon", 4 ],
		[ "Adult White Dragon", 5 ],
		[ "Air Elemental", 5 ],
		[ "Assassin", 6 ],
		[ "Bandit", 6 ],
		[ "Berserker", 6 ],
		[ "Bullywug", 7 ],
		[ "Commoner", 7 ],
		[ "Crocodile", 7 ],
		[ "Cultist", 7 ],
		[ "Deer", 7 ],
		[ "Doppelganger", 8 ],
		[ "Elk", 8 ],
		[ "Ettercap", 9 ],
		[ "Gargoyle", 9 ],
		[ "Giant Centipede", 9 ],
		[ "Giant Frog", 10 ],
		[ "Giant Lizard", 10 ],
		[ "Giant Spider", 10 ],
		[ "Gray Ooze", 11 ],
		[ "Griffon", 11 ],
		[ "Guard", 11 ],
		[ "Helmed Horror", 11 ],
		[ "Hobgoblin", 12 ],
		[ "Hobgoblin Captain", 12 ],
		[ "Knight", 12 ],
		[ "Kobold", 13 ],
		[ "Lizardfolk", 13 ],
		[ "Mage", 13 ],
		[ "Noble", 13 ],
		[ "Ogre", 14 ],
		[ "Orc", 14 ],
		[ "Otyugh", 14 ],
		[ "Peryton", 15 ],
		[ "Priest", 15 ],
		[ "Roper", 15 ],
		[ "Rug of Smothering", 16 ],
		[ "Scout", 16 ],
		[ "Shambling Mound", 16 ],
		[ "Specter", 17 ],
		[ "Spy", 17 ],
		[ "Stirge", 17 ],
		[ "Stone Giant", 18 ],
		[ "Stone Golem", 18 ],
		[ "Swarm of Insects", 18 ],
		[ "Swarm of Rats", 19 ],
		[ "Troglodyte", 19 ],
		[ "Troll", 19 ],
		[ "Vampire", 20 ],
		[ "Vampire Spawn", 21 ],
		[ "Veteran", 21 ],
		[ "Violet Fungus", 21 ],
		[ "Will-o'-Wisp", 22 ],
		[ "Winged Kobold", 23 ],
		[ "Wyvern", 23 ],
		[ "Yuan-ti Malison", 23 ],
		[ "Yuan-ti Pureblood", 24 ],
	];

	for ( i = 0; i < toAdd.length; i++ ) {
		registerMonster(toAdd[i][0], sourceName, toAdd[i][1]);
	}
}());
