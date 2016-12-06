(function() {
	"use strict";

	angular.module('app')
		.factory('princessupplementSource', Source);

	function Source() {
		return {
			name: "Princes of the Apocalypse Online Supplement v1.0",
			shortName: "ApocSup",
			initialState: false,
			contents: [
				[ "0cd9a2e0-16bc-4c84-86c8-feb035c0b5d6", 6 ], // arakocra
				[ "43385a8d-759b-4f44-a712-d46069b8dd88", 6 ], // boleth
				[ "925ae71b-869a-4067-aed6-803e50dc3e41", 7 ], // dult Black Dragon
				[ "ac41ad48-6631-413e-8e68-6e29696c8f35", 7 ], // dult Bronze Dragon
				[ "789c33ef-c5f6-484d-8bfe-5c520e7d3f82", 8 ], // nkheg
				[ "f42ac24e-7196-4ba4-ae4a-3e34a744d3de", 8 ], // ssassin
				[ "1180c9bd-d7e3-48d7-8087-79a936ab01d3", 9 ], // zer
				[ "f0109337-c855-4795-946c-93c92d97df29", 9 ], // andit Captain
				[ "b8148f95-9e1c-45b9-aabf-78d11ad0ee25", 9 ], // arlgura
				[ "e5612386-a501-4f25-afd2-8cd9977ec4af", 10 ], // Black Pudding
				[ "6b6b6245-cc31-4950-8ec4-91e06b56a282", 10 ], // Bulette
				[ "c20e65d5-8e5b-4f3b-845e-fb12a8342260", 11 ], // Chuul
				[ "3624bf90-c532-4e42-b97e-66cf22005a1a", 11 ], // Cloaker
				[ "ddb5a9fe-4323-479f-86b1-79d810a0ff69", 12 ], // Cloud Giant
				[ "2a0c5d92-fca1-4a81-a702-3c45f230b5fe", 12 ], // Crawling Claw
				[ "57f917eb-d654-4a66-b1ca-400245e59fc8", 12 ], // Cult Fanatic
				[ "c3b998ee-064e-4034-aaac-8e3d8dcb4eae", 13 ], // Dao
				[ "f113bf67-3a28-494e-b74b-d495c2ca4d8c", 13 ], // Darkmantle
				[ "dd4a1c24-730a-467c-ac2f-8417fac0fdf8", 13 ], // Deep Gnome (Svirfneblin)
				[ "bd3dbe66-519f-4aaf-96a0-4058b8910af6", 14 ], // Djinni
				[ "5a1662ec-9630-404e-8f37-7c79e9f9f450", 14 ], // Dragon Turtle
				[ "a2a7ae70-c46a-48b8-9a5f-d3b1c82b91b5", 15 ], // Drow Mage
				[ "aa328a81-cbcb-4800-96d4-3f9f7cc021f3", 15 ], // Druid
				[ "3dabeab2-dbcb-4915-a633-797f17fe5f4d", 16 ], // Duergar
				[ "82d58511-f0e1-4e2c-a4fc-8908210146a1", 16 ], // Dust Mephit
				[ "56fac8a2-3ef7-4ed6-bf94-df506191ed77", 16 ], // Efreeti
				[ "2d0d5297-dd18-4bd7-85e9-0759e4a6bb8b", 17 ], // Ettin
				[ "20207713-fef6-4f14-a3b0-1417d18d755a", 17 ], // Fire Snake
				[ "1e738fdf-524b-4127-b5b9-916758a8b52a", 17 ], // Galeb Duhr
				[ "73113f3b-87d9-46a3-90a8-38ab64ba2dab", 18 ], // Ghast
				[ "a07c63be-7fd9-441a-bbe0-469a0e732bbb", 18 ], // Gnoll Pack Lord
				[ "58efcfe3-54aa-4680-82c0-4ac9cf417bcd", 18 ], // Grell
				[ "89e0d155-e208-41f0-86fc-af2a62eb4c73", 19 ], // Half-Ogre
				[ "82ec416b-64ff-4738-b308-9cd44ef5957d", 19 ], // Helmed Horror
				[ "ba7bbb9e-2a12-4e4b-b90c-0d8e90f0898d", 19 ], // Hezrou
				[ "5341cb95-c090-4295-ba1d-83d978988a10", 20 ], // Hobgoblin Captain
				[ "3e4d8e86-de04-4ccb-aee2-2f4049b6769b", 20 ], // Hook Horror
				[ "85ca0247-73d6-43c3-b25d-4a9026586669", 20 ], // Ice Mephit
				[ "ee83fc27-4e79-4a9d-96ec-909aed739470", 21 ], // Invisible Stalker
				[ "977db5ba-5f5a-4a4d-851a-854696a05c01", 21 ], // Jackalwere
				[ "0d1a69f3-7416-4bd7-9166-4e7b0fdd0af3", 21 ], // Kenku
				[ "5bb857a3-c242-4b8e-9ad7-08134220a539", 22 ], // Kuo-toa
				[ "ef27b3eb-48e1-4415-a176-5df27a41d84f", 22 ], // Kuo-toa Archpriest
				[ "18f26ee3-cb25-4a4b-a37e-eeef773cb3ad", 23 ], // Kuo-toa Whip
				[ "a5dc844c-9763-4ce9-81e9-c83ec00976af", 23 ], // Lich
				[ "e94dadeb-692d-43cf-8d59-91f1624c795d", 24 ], // Lizardfolk Shaman
				[ "9e448cc3-7e92-4af8-8610-601efd00aef8", 24 ], // Lizard King/Queen
				[ "1f7aa396-edd4-47f6-88b6-f98793df12e5", 25 ], // Magma Mephit
				[ "f9b4996c-a11c-4f18-ab8b-fa627f384da7", 25 ], // Magmin
				[ "8e619f31-7241-4022-91a2-de617597b090", 25 ], // Merrow
				[ "911a2153-0fc4-48bd-bb68-4d36ef72cb3c", 26 ], // Mezzeloth
				[ "edc88a1f-98d9-44f8-b376-e3b11cb24401", 26 ], // Mud Mephit
				[ "f9a076f4-da7e-457a-912e-9fe8d752ef3e", 26 ], // Noble
				[ "4ec385e4-55ea-4d7b-af20-513227375d22", 27 ], // Nycaloth
				[ "06db3698-ec58-48d4-867a-f6fdd875823b", 27 ], // Oni
				[ "18e67457-97e5-4efc-bb6c-084a910fbbd1", 28 ], // Orc Eye of Gruumsh
				[ "33072b76-ec36-4c54-9318-83d04d6ef44d", 28 ], // Orog
				[ "df1f8a95-9f6b-4699-af85-da4368f16cfd", 28 ], // Peryton
				[ "cc49ec49-caa4-404b-92e6-9e7b4604cb12", 28 ], // Piercer
				[ "0de2b8ec-9d78-497b-83a3-e7eb530a4c85", 29 ], // Purple Worm
				[ "89ebcb90-c381-450d-a303-e1cb0f470a6a", 29 ], // Revenant
				[ "8e7f5fd8-557c-4176-aee8-2a894afb6b99", 30 ], // Roper
				[ "0245be52-98ed-441c-b7b6-823866ac50b0", 30 ], // Rust Monster
				[ "15cade7d-8730-49a3-bd2b-643a9a62d8c4", 30 ], // Salamander
				[ "14f5f317-1640-4254-b8d7-4d2dadb97394", 31 ], // Scout
				[ "6e15161a-e1b2-4a0c-94b0-db75d2e6ccb3", 31 ], // Sea Hag
				[ "c4551c2c-c686-4105-83f6-87c873f8809f", 31 ], // Shadow
				[ "d356934b-d78b-49bf-9ce0-b9fb9946eb64", 32 ], // Shadow Demon
				[ "212a9d4e-60b7-4c1e-ac1c-67f26855e878", 32 ], // Shield Guardian
				[ "bdda67cb-ae81-4107-860a-eee6456ea92b", 32 ], // Smoke Mephit
				[ "3a005074-e1df-4b63-88a4-3dd4edbd237a", 33 ], // Specter
				[ "e91d49d6-b139-4457-bd9c-45fd656ec408", 33 ], // Sprite
				[ "a9524fbf-b1e5-4ca4-9f79-f4e494f93bcb", 33 ], // Spy
				[ "d28e71ee-8388-4534-bb38-209de47bbe5e", 34 ], // Steam Mephit
				[ "183f147b-1fa5-4495-8641-d655c57dbd07", 34 ], // Tribal Warrior
				[ "6d5a54d5-176b-46f6-988e-db5ff8176fab", 34 ], // Troglodyte
				[ "ea840106-9d27-453c-9ded-c93725740323", 35 ], // Umber Hulk
				[ "36f309b0-7f49-44ac-aba7-6a7405e58545", 35 ], // Vampire Spawn
				[ "595c04c7-7c4d-442a-932a-22be86d294c9", 35 ], // Veteran
				[ "667b4af5-1335-4f33-bd19-34d947603dc9", 36 ], // Violet Fungus
				[ "993c1b2c-ea24-45c5-9c1d-a862d1f6b440", 36 ], // Vrock
				[ "0414cbe7-742c-4df8-9d4a-51dd1d37210e", 36 ], // Water Weird
				[ "59408dc1-6bee-467c-9e7e-108d7870d5a7", 37 ], // Wereboar
				[ "16d4afb3-8246-4709-8308-58d620849408", 37 ], // Will-o'-Wisp
				[ "77cbc6b6-3936-4dad-b575-7c45e81e22f9", 38 ], // Xorn
				[ "3f6ed5da-bf09-4f65-bfd2-b012ebb01648", 38 ], // Young Red Dragon
			],
		}
	}
})();
