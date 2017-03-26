Kobold Fight Club
=================

An encounter builder and combat manager for D&D 5th edition

Nothing special needed to run it. Just open index.html in firefox. You can run it in Chrome as well, but you'll need to start a webserver because Chrome doesn't like running this sort of stuff from file:///

## Node Commands
- npm install - Install necessary dependencies
- npm run start - Start an http server for debugging on localhost
- npm run build-css - Compile sass into css
- npm run watch-css - Watch folder for changes and run build-css if needed

* Contributing content to Kobold Fight Club

Links:
* Master sheet: https://docs.google.com/spreadsheets/d/19ngAA7d1eYKiBtKTsg8Qcsq_zhDSBzEMxXS45eCdd7I/
* Template: https://docs.google.com/spreadsheets/d/1_cFPf4OGh9QC0WN-cvEWGBNYzCTw--GnPQLzpibkOwk/

1. Make a copy of the template
	1. Go to the template
	2. Make sure you're logged into a Google account
	3. Click File -> Make a copy
2. There are two sheets in the template. You'll need to fill out both sheets.
	* See the master sheet for examples of how to fill out the sheets
	* Specific notes for **Monsters** sheet
		* **fid** must be unique for each monster, and should be derived from the monster's (exact!) name. The format of fid is "source.name", where source is a short code for the source the monster comes from and name is its name, with all special characters removed and dashes seperating words. For example, consider these two monsters:
			* Aerisi Kalinoth
				* fid: `apoc.aerisi-kalinoth`
			* Aerisi Kalinoth (in lair)
				* fid: `apoc.aerisi-kalinoth-in-lair`
			* These are actually the same monster, except one is the monster in its lair and one is not. Since the monster has a higher CR in its lair, it gets a separate entry.
			* This monster is in the Princes of the Apocalypse supplement. All monsters from this supplement use the `apoc` code, which I chose arbitrarily. The important thing when choosing this code is that it is unique (no two sources should have the same code).
			* If a monster is in multiple sources, choose the "most important" one and use the code from that. For example, all the monsters in the basic rules are also in the Monster Manual, which is the more important source, so they all use the `mm` code.
			* Finally, note how "Aerisi Kalinoth (in lair)" is translatd to `aerisi-kalinoth-in-lair`. All punctuation is removed, hyphens are placed between each word, and it's written entirely lower-case.
		* The **alignment** field is very flexible. Whatever you write will be presented to the user as-is in the alignment field in KFC. However, it will also attempt to parse what you've written to determine what alignments are allowed. You can include multiple alignments by separating them by commas or the word or. You can also use terms like "any good", "non-evil", etc.
		* **environments** is a comma-separated list of environments the monster can be found in. Allowed environments are:
			* aquatic
			* arctic
			* cave
			* coast
			* desert
			* dungeon
			* environment
			* forest
			* grassland
			* hill
			* mountain
			* planar
			* ruins
			* swamp
			* underdark
			* underground
			* underwater
			* urban
			* swamp
		* **lair**, **legendary**, and **unique** are all qualities the monster entry might have. If a monster has that quality, you should put that word in that column (e.g. if a monster is unique, write "unique" in that column). Otherwise leave that column blank.
			* **lair** means the monster is being encountered in its lair. Often monsters will have a different CR when in their lair, so you'll have two entries for the monster; one in lair, one not. You should also include (in lair) at the end of the monster's name for the row where it's in its lair.
			* **legendary** means the monster has legendary actions.
			* **unique** means the monster is a unique individual, rather than a type of monster. Unique monsters will never be chosen for a random encounter. Typically these are NPCs in adventures, demon lords, named monsters, etc.
		* **sources** is a comma-separated list of sources where the monster can be found, in the format "Full Source Name: Where". Examples:
			* `Basic Rules v1: 54, HotDQ supplement: 7, Monster Manual: 345`
				* Located in those 3 sources, at each of those pages. Note that the page numbers are not preceeded by "p.". They should just be numbers.
			* `Monster-A-Day: https://www.reddit.com/r/monsteraday/comments/3rdrry/day_79_chronomancers/`
				* In this case the monster comes from a website, and we give a specific URL. KFC will provide a link to the monster.
	* Specific notes for **Sources** sheet
		* **name** is the full name of the source, and should exactly match the name of the source as you used it in the monsters sheet. If the names don't match exactly, monsters won't be linked to their sources correctly.
		* **short name** is the short name for the source. This is used on narrow screens such as phones. It should be something easily identifiable and unique. It may be the same as the fid code, but doesn't have to be. Examples:
			* Monster Manual: `MM`
			* Monster-A-Day: `MAD`
			* Curse of Strahd: `Strahd`
			* Fifth Edition Foes: `5eF`
			* Primeval Thule Campaign Setting: `ThuleCS`
3. Once you're done, share the sheet with me at itoltz@gmail.com
