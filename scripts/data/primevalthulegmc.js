(function() {
	"use strict";

	angular.module('app')
		.factory('primevalthulegmcSource', Source);

	function Source() {
		return {
			name: "Primeval Thule Gamemaster's Companion",
			shortName: "ThuleGM",
			initialState: true,
			contents: [
				[ "3aa474b6-f6b6-429f-bc2a-76fbfa3d76bd", 14 ], // Thulean Chimera
				[ "bb4350a6-9d82-4ae2-b722-04847b465f61", 15 ], // Thulean Manticore
				[ "1783dc58-0a43-4c52-9fbb-66a0c35a446e", 16 ], // Pale Hand Reaver
				[ "6de43730-b5a7-4f0a-aa92-d94a94c28741", 17 ], // Sword Weird
				[ "3e067b55-bd1a-425e-aae0-a0adbb1c145b", 17 ], // Prince of the Pale Hand
				[ "95c8a285-abf6-41aa-b3b4-9b0d8d3f2904", 18 ], // Bronze Lion
				[ "815fb4dd-ac17-439d-9153-9119ba7f68f5", 18 ], // Scorpion Helot
				[ "00016fd0-4f98-4eea-90cd-7c9461376e05", 19 ], // Red Chimera
				[ "303eb3ae-2872-4b77-b496-bb3a52762811", 19 ], // Lioness of Nergal
				[ "fd8abecd-454d-4585-ba60-d7dd7ac54cb3", 20 ], // Tcho-Tcho Cannibal
				[ "f5813b49-1665-456d-827d-6edb80d75c72", 21 ], // Tcho-Tcho Lama
				[ "f8b7fbc4-42ed-4647-94f2-8977d23a26bb", 21 ], // Tcho-Tcho Watcher
				[ "73b97ac0-db84-4d2a-b426-958a0b74166e", 22 ], // Yga-Ygo, The Dweller in Dreams
				[ "fe27811d-000f-4462-8e63-157770fbb5b5", 23 ], // Dream-Seeker of Yga-Ygo
			],
		}
	}
})();