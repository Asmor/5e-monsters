/* global registerMonster */
/* global registerSource */
"use strict";

(function () {
	var sourceName = "Monster Manual",
		i, toAdd;

	registerSource(sourceName, true);

	toAdd = [
		[ "0cd9a2e0-16bc-4c84-86c8-feb035c0b5d6", 12 ], // Aarakocra
		[ "43385a8d-759b-4f44-a712-d46069b8dd88", 13 ], // Aboleth
		[ "52386d70-24c8-461a-ba1f-4fbaccc6d446", 306 ], // Abominable Yeti
		[ "f88906c2-146d-4abb-8537-8bf5e1d0ac97", 342 ], // Acolyte
		[ "925ae71b-869a-4067-aed6-803e50dc3e41", 88 ], // Adult Black Dragon
		[ "437ddd59-2aa8-489f-bc2e-e9845a935947", 84 ], // Adult Blue Dracolich
		[ "0a70230e-18d8-49e3-898a-49e740acb4a2", 91 ], // Adult Blue Dragon
		[ "02616673-2113-4e70-82fc-729b766d3c58", 105 ], // Adult Brass Dragon
		[ "ac41ad48-6631-413e-8e68-6e29696c8f35", 108 ], // Adult Bronze Dragon
		[ "43984f24-324e-4656-ae7a-aeaaa14d74be", 112 ], // Adult Copper Dragon
		[ "99872957-920d-4007-a66b-0f5922ba584d", 114 ], // Adult Gold Dragon
		[ "1182dfb4-3b70-4ce0-a41c-c5ff1ca6ad21", 94 ], // Adult Green Dragon
		[ "a27291de-91c5-4b8e-9ffe-5055e90cc6cd", 98 ], // Adult Red Dragon
		[ "4002e3ba-63b1-48a8-87d1-044a319cb02d", 117 ], // Adult Silver Dragon
		[ "4218c74b-27c2-45be-abde-e23ad4223061", 101 ], // Adult White Dragon
		[ "071f1203-f6e6-4fcf-928c-b9cdeb256b2b", 124 ], // Air Elemental
		[ "4dfdcf3d-5bdc-4d4d-a55c-6a9149d97079", 79 ], // Allosaurus
		[ "19a2039e-4cc1-4181-96d2-5f33d5d75764", 87 ], // Ancient Black Dragon
		[ "3e861d52-a964-4c84-8ffc-44a814e3070b", 90 ], // Ancient Blue Dragon
		[ "75ff17b1-4f33-49ca-ae07-80088c028ea5", 104 ], // Ancient Brass Dragon
		[ "49924bb6-804f-4150-870b-b14b85716129", 107 ], // Ancient Bronze Dragon
		[ "e06dae63-02d4-41c4-b910-0831ca111514", 110 ], // Ancient Copper Dragon
		[ "d830724d-8d58-4464-af65-3befceb878bf", 113 ], // Ancient Gold Dragon
		[ "67f50578-6e21-4e73-9d47-5a34d5d340c4", 93 ], // Ancient Green Dragon
		[ "fa6112d9-803c-4c9e-b995-41cb04b8872d", 97 ], // Ancient Red Dragon
		[ "867fd8db-72d8-4bc7-8d8a-272afe0c42c6", 116 ], // Ancient Silver Dragon
		[ "44702dbb-036c-4eee-923e-565cf17e77ac", 100 ], // Ancient White Dragon
		[ "f0faeb6f-9112-467a-bf48-b4fb5e2f4b26", 281 ], // Androsphinx
		[ "3c5a63ab-b94f-4451-aa2a-02545b381797", 19 ], // Animated Armor
		[ "789c33ef-c5f6-484d-8bfe-5c520e7d3f82", 21 ], // Ankheg
		[ "935a62a6-3538-4ea8-a06c-adddef096e56", 79 ], // Ankylosaurus
		[ "0788c447-ada3-4bc2-aa38-bc9e08b186d4", 317 ], // Ape
		[ "f9ee20cb-0dff-4585-8f5f-95141f86f9dc", 313 ], // Arcanaloth
		[ "d4aec3c5-0b0a-4fff-b77b-fe7c900d7d31", 342 ], // Archmage
		[ "f42ac24e-7196-4ba4-ae4a-3e34a744d3de", 343 ], // Assassin
		[ "0966d112-1f88-45cc-b018-c03103c2b3a0", 317 ], // Awakened Shrub
		[ "98e6eb4b-4998-4a6c-9366-09a82b0c3028", 317 ], // Awakened Tree
		[ "62b74702-7ffa-4827-83dc-b97dec26690a", 317 ], // Axe Beak
		[ "1180c9bd-d7e3-48d7-8087-79a936ab01d3", 22 ], // Azer
		[ "f3d4a9b6-622b-4c6c-b809-df565839699c", 318 ], // Baboon
		[ "e4ca5f7e-4218-4083-a8e0-009b24bd66cb", 318 ], // Badger
		[ "e99e9430-d387-4c3f-8168-cfd6257174a1", 55 ], // Balor
		[ "f0109337-c855-4795-946c-93c92d97df29", 344 ], // Bandit Captain
		[ "d9d4ae84-bf86-4b94-9806-1b32f5cc69aa", 343 ], // Bandit
		[ "59a79db3-22c9-457f-bcb0-990013e4057a", 23 ], // Banshee
		[ "f9fe17c3-2688-4434-98fc-1321b8e1d48d", 70 ], // Barbed Devil
		[ "b8148f95-9e1c-45b9-aabf-78d11ad0ee25", 56 ], // Barlgura
		[ "fca1066d-9c2c-4745-972c-a4e19376bab7", 24 ], // Basilisk
		[ "afee8041-1219-4d31-931d-3c3a08b0b449", 318 ], // Bat
		[ "f32f1817-8310-41f0-8a83-0d39a5d464c3", 70 ], // Bearded Devil
		[ "05a1b5f9-d2de-44ba-b292-b7b63fca6826", 25 ], // Behir
		[ "81191c85-cef0-4782-9e4e-70accdae757e", 316 ], // Beholder Zombie
		[ "a97f037f-85d9-47a4-8eae-814eb5176810", 28 ], // Beholder
		[ "095cd054-da20-44b7-a511-b22c42a5b201", 28 ], // Beholder (in lair)
		[ "8f6ae154-74f1-4ae2-b165-54f109fa2733", 344 ], // Berserker
		[ "a233bc77-4107-456a-89d2-9d91b4ada1a2", 318 ], // Black Bear
		[ "db95bd5e-565b-44fa-8bdb-0732ce4d3b67", 88 ], // Black Dragon Wyrmling
		[ "e5612386-a501-4f25-afd2-8cd9977ec4af", 241 ], // Black Pudding
		[ "92452019-5b58-4f07-acdc-89be2ab34c2f", 318 ], // Blink Dog
		[ "2fd54197-cb28-4dcd-b0b3-adfc90de53f6", 319 ], // Blood Hawk
		[ "15c821b4-abed-42f4-bbcd-2035edec5aad", 91 ], // Blue Dragon Wyrmling
		[ "36879d12-0c10-4f48-beff-bc39984968c7", 276 ], // Blue Slaad
		[ "14ef11ed-2340-46de-a4eb-e9932f839f5d", 319 ], // Boar
		[ "d6d8860b-6c94-4056-b02d-d4161206d24c", 71 ], // Bone Devil
		[ "dd409232-47c5-4cc2-adcf-c13ef6b3b489", 233 ], // Bone Naga
		[ "03e32c50-a660-4314-b701-393153a80fcd", 106 ], // Brass Dragon Wyrmling
		[ "1fac16f9-7b5f-4d8f-85b9-fcecacd16d2a", 109 ], // Bronze Dragon Wyrmling
		[ "197d96a0-a8c4-48be-af3d-6174ac281afb", 319 ], // Brown Bear
		[ "2dad5420-04bb-4921-9857-34700a52f413", 33 ], // Bugbear
		[ "bab41d17-f80f-4b5f-abf9-792b03bb98ef", 33 ], // Bugbear Chief
		[ "6b6b6245-cc31-4950-8ec4-91e06b56a282", 34 ], // Bulette
		[ "c8328817-b3e9-4c24-984b-f278678bc3a4", 35 ], // Bullywug
		[ "1f3ad1ff-6606-4f75-ae2a-02293de88198", 36 ], // Cambion
		[ "67f7d07c-5002-4768-9586-3ed988bec1e9", 320 ], // Camel
		[ "9c9180b5-4e30-424b-9823-a8375131ffe7", 37 ], // Carrion Crawler
		[ "8db064e4-cca6-4757-b558-a7f122ddf06f", 320 ], // Cat
		[ "a9212953-cb55-4b5d-80ff-c3703fc5cb0e", 38 ], // Centaur
		[ "9c4a2dce-bc31-4644-88d1-a590d19c8b47", 72 ], // Chain Devil
		[ "b2d9646e-cd3b-4045-803f-aedf158216a2", 57 ], // Chasme
		[ "a11e72bd-d81b-4826-901d-d2101c287b1e", 39 ], // Chimera
		[ "c20e65d5-8e5b-4f3b-845e-fb12a8342260", 40 ], // Chuul
		[ "7272ad74-80e0-4170-a9af-8566bc84d236", 168 ], // Clay Golem
		[ "3624bf90-c532-4e42-b97e-66cf22005a1a", 41 ], // Cloaker
		[ "ddb5a9fe-4323-479f-86b1-79d810a0ff69", 154 ], // Cloud Giant
		[ "6782e851-fe66-4e6f-abd2-2de17c0f4db9", 42 ], // Cockatrice
		[ "a5f5b9e0-71af-4788-a471-7135557c8321", 345 ], // Commoner
		[ "5ed4761c-b22d-4873-9ad3-31344c34819b", 320 ], // Constrictor Snake
		[ "b226d74a-b4ea-48cf-b510-48e6de7fc765", 111 ], // Copper Dragon Wyrmling
		[ "37abaf7a-e840-4ea1-b34f-334f13a6a7ca", 43 ], // Couatl
		[ "a92307d2-e938-4ee2-aee7-36eae63e2fc9", 320 ], // Crab
		[ "2a0c5d92-fca1-4a81-a702-3c45f230b5fe", 44 ], // Crawling Claw
		[ "604dfa7a-4b77-4633-a3ce-83e2c073e0d4", 320 ], // Crocodile
		[ "57f917eb-d654-4a66-b1ca-400245e59fc8", 345 ], // Cult Fanatic
		[ "51bea60c-7686-4bc7-8964-46c75e6953ff", 345 ], // Cultist
		[ "1c299dc6-ea10-4314-bc9a-0f40fe4dbfab", 45 ], // Cyclops
		[ "c3b998ee-064e-4034-aaac-8e3d8dcb4eae", 143 ], // Dao
		[ "f113bf67-3a28-494e-b74b-d495c2ca4d8c", 46 ], // Darkmantle
		[ "3f109065-752c-496c-9169-b2ab3399126b", 321 ], // Death Dog
		[ "e4c765b3-445f-475b-853d-d27b6d4d12fe", 47 ], // Death Knight
		[ "47c0a532-6d34-4cf9-9d89-ffc4b8575898", 29 ], // Death Tyrant
		[ "efc8bf04-0f28-4c53-80fd-38e4f6404231", 29 ], // Death Tyrant (in lair)
		[ "7eee83ee-5f71-458a-b0c7-ac04fd78301f", 278 ], // Death Slaad
		[ "dd4a1c24-730a-467c-ac2f-8417fac0fdf8", 164 ], // Deep Gnome (Svirfneblin)
		[ "ba54ab80-5007-4695-9f82-003a88cfdeeb", 321 ], // Deer
		[ "7678ccea-6973-4647-afa0-a0f1957392df", 48 ], // Demilich
		[ "ccb1f0eb-3037-40f3-bbe0-1f63f89ba71c", 48 ], // Demilich (in lair)
		[ "44738bcb-dfb3-4ce0-bf2e-836df2601fdd", 49 ], // Demilich (Acererak)
		[ "d315f181-effc-499e-947b-caf6eeec524a", 49 ], // Demilich (Acererak in lair)
		[ "c7e54573-9829-490d-9c8f-4874cb14ba3d", 16 ], // Deva
		[ "9a507770-7644-4486-b73e-ca04b78d2e43", 321 ], // Dire Wolf
		[ "6169f0f9-4bc6-4453-8d20-a7ceed20dbbd", 81 ], // Displacer Beast
		[ "bd3dbe66-519f-4aaf-96a0-4058b8910af6", 144 ], // Djinni
		[ "738ff802-57e5-4f73-89cb-5def2b527fc0", 82 ], // Doppelganger
		[ "46979307-705f-43e6-be68-7f72c936b1ba", 321 ], // Draft Horse
		[ "5a1662ec-9630-404e-8f37-7c79e9f9f450", 119 ], // Dragon Turtle
		[ "84860c36-652d-44df-bd00-905303a4e589", 57 ], // Dretch
		[ "cd17abab-5062-4ab5-9a1c-df53d3962a87", 120 ], // Drider
		[ "197e15f8-c5f7-41ac-a47a-a92144e2bfac", 128 ], // Drow Elite Warrior
		[ "a2a7ae70-c46a-48b8-9a5f-d3b1c82b91b5", 129 ], // Drow Mage
		[ "525d2a5a-4fba-4183-926e-4cca39164da4", 129 ], // Drow Priestess of Lolth
		[ "e28ee68c-d06b-411c-9ed5-423a151d6697", 128 ], // Drow
		[ "aa328a81-cbcb-4800-96d4-3f9f7cc021f3", 346 ], // Druid
		[ "ca145277-a157-4591-af02-3d5a3cfe3368", 121 ], // Dryad
		[ "3dabeab2-dbcb-4915-a633-797f17fe5f4d", 122 ], // Duergar
		[ "1c8b43c4-f7ad-40cb-b5c6-ceab1f78c94f", 225 ], // Duodrone
		[ "82d58511-f0e1-4e2c-a4fc-8908210146a1", 215 ], // Dust Mephit
		[ "2b990f56-68e4-4c1c-8905-c1a05269beeb", 322 ], // Eagle
		[ "e5f96c20-3f6c-4374-90e8-89a3952f2562", 124 ], // Earth Elemental
		[ "56fac8a2-3ef7-4ed6-bf94-df506191ed77", 145 ], // Efreeti
		[ "45934b57-b2f7-4bce-bc98-0af4e1233b62", 322 ], // Elephant
		[ "eb4b6767-1035-48a2-8a66-b9e2572e2322", 322 ], // Elk
		[ "607299fd-9bfc-41da-983e-47a821eb35a9", 130 ], // Empyrean
		[ "17e723aa-5268-4ed7-8c54-113a4e6fb76c", 73 ], // Erinyes
		[ "1ae109e6-763a-46cd-b643-396c0e83da84", 131 ], // Ettercap
		[ "2d0d5297-dd18-4bd7-85e9-0759e4a6bb8b", 132 ], // Ettin
		[ "8e6e36dd-dabc-4fd9-ba4d-261b26baeb81", 133 ], // Faerie Dragon (red)
		[ "009bfc30-93b0-48f5-a403-269c8ace67bf", 133 ], // Faerie Dragon (orange)
		[ "83602f7b-43f6-4d20-ab7c-c2dd52990826", 133 ], // Faerie Dragon (yellow)
		[ "2f69eb5e-7c8c-4f6b-97f3-aab4ee7c5501", 133 ], // Faerie Dragon (green)
		[ "6a982eda-d984-429f-b6e0-8b3c28e2914f", 133 ], // Faerie Dragon (blue)
		[ "fd9e0821-7b20-4184-b292-e50d154b7f7b", 133 ], // Faerie Dragon (indigo)
		[ "d5edc918-ee9d-46dd-a780-fd6203e75228", 133 ], // Faerie Dragon (violet)
		[ "4630fbab-b0ca-41dc-9e42-3a69a737ff0e", 125 ], // Fire Elemental
		[ "cc07acfb-a623-43ec-8c23-70a0385eb481", 154 ], // Fire Giant
		[ "20207713-fef6-4f14-a3b0-1417d18d755a", 265 ], // Fire Snake
		[ "4665dbb1-cbc4-433a-a0df-0b6477d6f4fa", 134 ], // Flameskull
		[ "1a0097d3-c91a-4515-89cf-a63c4badc355", 169 ], // Flesh Golem
		[ "14d204ca-04d2-44d4-a644-2e1e9e2d9091", 135 ], // Flumph
		[ "6afa4798-b9c5-4139-adeb-55eaba3e9cdb", 322 ], // Flying Snake
		[ "35c699fb-a8d2-491f-9a73-206a61937297", 20 ], // Flying Sword
		[ "fdb52704-4bb5-4909-b55e-0f8ee199f877", 136 ], // Fomorian
		[ "303172de-265f-4046-bf47-2aff0f444f6e", 322 ], // Frog
		[ "8a2720eb-fb5c-4a79-8560-b3d1443d5e76", 155 ], // Frost Giant
		[ "1e738fdf-524b-4127-b5b9-916758a8b52a", 139 ], // Galeb Duhr
		[ "625ff3cf-c836-498f-bb9b-de25adb1c26d", 140 ], // Gargoyle
		[ "5ad9d340-d07d-48bf-8938-2d304730746d", 138 ], // Gas Spore
		[ "2230d3a4-822b-48b2-99f5-373ffb6695a8", 242 ], // Gelatinous Cube
		[ "73113f3b-87d9-46a3-90a8-38ab64ba2dab", 148 ], // Ghast
		[ "c15c8f1e-5e6c-4011-a994-683fbb0b18dd", 147 ], // Ghost
		[ "369e60c6-5792-4623-8e11-36951e652011", 148 ], // Ghoul
		[ "4115f79a-084f-4775-b821-2b7ce6fc60d6", 323 ], // Giant Ape
		[ "2a435613-2ac3-4486-90e6-e62e2efce0ec", 323 ], // Giant Badger
		[ "f96d5318-3768-4f78-b800-6cc36f474c0a", 323 ], // Giant Bat
		[ "bcc30ff0-0853-456b-961e-c23a7236b979", 323 ], // Giant Boar
		[ "98ec83af-5011-4e90-b17e-7885df911032", 323 ], // Giant Centipede
		[ "f2d2909a-895b-4f43-89eb-5a17a5f129c3", 324 ], // Giant Constrictor Snake
		[ "df3f2dc9-40e2-48f3-9d40-a62a57dd0492", 324 ], // Giant Crab
		[ "2408c546-fa02-40e0-9264-08d13fe5386c", 324 ], // Giant Crocodile
		[ "a02c80fc-b950-4e71-be07-2a3b28a126a4", 324 ], // Giant Eagle
		[ "68039952-d660-43e4-8949-ae6eb04606b6", 325 ], // Giant Elk
		[ "3b66d494-fe9b-411c-8e8e-d8f384c41ef8", 325 ], // Giant Fire Beetle
		[ "7a608516-9ef3-4bf3-85c6-45837c61a77e", 325 ], // Giant Frog
		[ "6589f3c5-4596-4fd4-b69c-94be539aade0", 326 ], // Giant Goat
		[ "d56e1457-2295-4bfd-b1d6-d84e53d6debc", 326 ], // Giant Hyena
		[ "b1e3ee1f-d616-412d-ab5e-10aad27b2476", 326 ], // Giant Lizard
		[ "0dcde23a-8100-4855-ac07-3388d1b8cc40", 326 ], // Giant Octopus
		[ "0f0d61e7-2a8f-47c6-b1c9-35d7390dd6bb", 327 ], // Giant Owl
		[ "ab030d7f-8e46-4167-bf36-45ff59a95665", 327 ], // Giant Poisonous Snake
		[ "dd4df726-a041-4058-ac44-225aab9be366", 327 ], // Giant Rat
		[ "ff4ee842-7c21-4d0e-b6ff-d72dc13913db", 327 ], // Giant Scorpion
		[ "2fe6b60e-017f-40fa-9746-44e5b9f6bb2d", 328 ], // Giant Sea Horse
		[ "4d78880d-7eae-4494-ac22-e0bf415e32ad", 328 ], // Giant Shark
		[ "ceff6967-7d2c-4b84-9e2a-df1d36a9a98c", 328 ], // Giant Spider
		[ "dfd9f55f-e53c-4abb-b761-144062af6d0d", 329 ], // Giant Toad
		[ "6b6e5aa1-bc01-4af6-b64a-8ac3f468eaf7", 329 ], // Giant Vulture
		[ "ff490947-a963-4c11-8a1c-f238f4f6ad27", 329 ], // Giant Wasp
		[ "a30c0261-68cd-4b59-8bf6-c47bbde26f36", 329 ], // Giant Weasel
		[ "f51ac131-dfc5-4672-a569-ab361ac31447", 330 ], // Giant Wolf Spider
		[ "3394673a-e802-409a-b0b2-8d3f972a86fc", 157 ], // Gibbering Mouther
		[ "54fd43f7-d101-461d-b6db-e64f095eed84", 160 ], // Githyanki Knight
		[ "a3e7690f-8fc3-4a63-ba8c-75edbdbd755b", 160 ], // Githyanki Warrior
		[ "09632ffa-87af-47aa-b906-1e343f742ab5", 161 ], // Githzerai Monk
		[ "3058ccdb-7705-4545-8b7d-a09345c676dc", 161 ], // Githzerai Zerth
		[ "681eb77f-9e46-4d7c-b96b-c850f1037dd0", 58 ], // Glabrezu
		[ "95c84527-c3f5-41df-a449-3f9c2cb56953", 346 ], // Gladiator
		[ "07256557-e839-43d0-b84b-e91f3e7866fc", 163 ], // Gnoll
		[ "e6e7eb98-e83c-4f36-ab56-35f50982c411", 163 ], // Gnoll Fang of Yeenoghu
		[ "a07c63be-7fd9-441a-bbe0-469a0e732bbb", 163 ], // Gnoll Pack Lord
		[ "4407c527-3be7-4010-b51d-a777203e49e1", 330 ], // Goat
		[ "9cf6c94e-b019-47e1-a746-ab4d02f684a9", 166 ], // Goblin
		[ "0ad711a0-1b8b-418c-836e-b95ff9abb066", 166 ], // Goblin Boss
		[ "524618b1-0d0d-4e12-bcf3-cb8d725c9ebc", 115 ], // Gold Dragon Wyrmling
		[ "7065db5f-03fc-4fc5-964d-8bdf5d47f701", 171 ], // Gorgon
		[ "776873f4-290b-4bf8-8d55-1d9b978791b0", 59 ], // Goristro
		[ "d82d19dd-2e7e-407f-9861-b7e2ee599e5c", 243 ], // Gray Ooze
		[ "7087acfe-930d-49b7-9fab-a0351650c7ce", 277 ], // Gray Slaad
		[ "41eb895f-32b5-4389-8e99-145545851edc", 95 ], // Green Dragon Wyrmling
		[ "9447b8b2-f96c-4607-b210-966d201d6da6", 177 ], // Green Hag
		[ "af9dbb65-ebf7-468e-9746-131a66a9facb", 177 ], // Green Hag (coven)
		[ "69a7ed5e-16a9-466d-90a9-867136fb9469", 277 ], // Green Slaad
		[ "58efcfe3-54aa-4680-82c0-4ac9cf417bcd", 172 ], // Grell
		[ "9ab9a61b-5298-44e9-8950-167e4a4e9c98", 173 ], // Grick
		[ "a227bfa9-bdbe-4a27-9e06-f4e65de57280", 173 ], // Grick Alpha
		[ "9084361f-6e4a-47ee-9e58-341f346278b2", 174 ], // Griffon
		[ "f3f05353-e662-4b51-bdf2-19e3be7769eb", 175 ], // Grimlock
		[ "2dfd127c-8844-4289-ac04-b4fe2f1656e4", 347 ], // Guard
		[ "9f2cb577-d9e2-48bb-ba99-6fc9ba74ec69", 234 ], // Guardian Naga
		[ "adf26741-67bd-4908-92e7-231a28374808", 282 ], // Gynosphinx
		[ "89e0d155-e208-41f0-86fc-af2a62eb4c73", 238 ], // Half-Ogre
		[ "1a52d02f-8c55-41cb-80c5-48127774767b", 180 ], // Half-Red Dragon Veteran
		[ "3279999e-4dd9-4149-8ce5-f0867c108d30", 181 ], // Harpy
		[ "d2ebaf9c-3be0-4c0c-ac98-c65e6d80b741", 330 ], // Hawk
		[ "5545c172-5478-4ac0-8db5-7b2c8e90394c", 182 ], // Hell Hound
		[ "82ec416b-64ff-4738-b308-9cd44ef5957d", 183 ], // Helmed Horror
		[ "ba7bbb9e-2a12-4e4b-b90c-0d8e90f0898d", 60 ], // Hezrou
		[ "c7296867-6041-418d-b255-b675639cfc2c", 155 ], // Hill Giant
		[ "5d506ff9-4a90-460e-82e4-68bdf0bac7cf", 184 ], // Hippogriff
		[ "127e4789-95e3-48e4-8937-7d85ccb3bea0", 186 ], // Hobgoblin
		[ "5341cb95-c090-4295-ba1d-83d978988a10", 186 ], // Hobgoblin Captain
		[ "3a5c21f3-f610-47ec-ba99-8ea6ceb9a5a2", 187 ], // Hobgoblin Warlord
		[ "733da9a7-a197-4be8-b8f0-00e492801eec", 188 ], // Homunculus
		[ "3e4d8e86-de04-4ccb-aee2-2f4049b6769b", 189 ], // Hook Horror
		[ "50a88400-dd98-40b7-a03a-4cbedd5730b8", 74 ], // Horned Devil
		[ "3cbfec14-c628-4140-82ce-8cb47cfcdb98", 330 ], // Hunter Shark
		[ "3e632ad7-8ffd-40b7-8a37-45386577bd45", 190 ], // Hydra
		[ "589c5ae5-bbbe-4753-a36a-53bfec6987b7", 331 ], // Hyena
		[ "ccc0b0de-f4e8-418d-b354-dbf6968413ee", 75 ], // Ice Devil
		[ "85ca0247-73d6-43c3-b25d-4a9026586669", 215 ], // Ice Mephit
		[ "c211c5fc-f71a-4e11-8c8b-71a6ae470eaa", 76 ], // Imp
		[ "8ccb4fb2-f8aa-421d-a60e-76255953b97a", 191 ], // Intellect Devourer
		[ "ee83fc27-4e79-4a9d-96ec-909aed739470", 192 ], // Invisible Stalker
		[ "d9f13daf-d1b1-490c-87a7-33e8d28bb4ee", 170 ], // Iron Golem
		[ "d8e388da-90a9-48b5-8d84-f969f5b98a73", 331 ], // Jackal
		[ "977db5ba-5f5a-4a4d-851a-854696a05c01", 193 ], // Jackalwere
		[ "0d1a69f3-7416-4bd7-9166-4e7b0fdd0af3", 194 ], // Kenku
		[ "7ff7ffda-0e4d-4989-9c61-455178874d43", 331 ], // Killer Whale
		[ "9094f81d-5fab-43c6-baf5-4a5acbe94b9b", 347 ], // Knight
		[ "baa3449e-bfd5-408d-8b7e-206a3bebf8ca", 195 ], // Kobold
		[ "db248a11-5c00-433b-91e5-606ac09a3df9", 197 ], // Kraken
		[ "ef27b3eb-48e1-4415-a176-5df27a41d84f", 200 ], // Kuo-toa Archpriest
		[ "18f26ee3-cb25-4a4b-a37e-eeef773cb3ad", 200 ], // Kuo-toa Whip
		[ "5bb857a3-c242-4b8e-9ad7-08134220a539", 199 ], // Kuo-toa
		[ "78334f11-4007-4c8d-a133-55c8581d13bf", 201 ], // Lamia
		[ "a423f6af-82f8-4716-9a32-03e6c21679b1", 76 ], // Lemure
		[ "a5dc844c-9763-4ce9-81e9-c83ec00976af", 202 ], // Lich
		[ "3a25a6fc-7a1d-4437-9010-213e7a9ec153", 202 ], // Lich (in lair)
		[ "2feb4531-2954-456c-bdf2-b320b1b8d1a3", 331 ], // Lion
		[ "c9c0dd9a-d2ce-449c-9bd8-46da79cacdc3", 332 ], // Lizard
		[ "9e448cc3-7e92-4af8-8610-601efd00aef8", 205 ], // Lizard King/Queen
		[ "5ec95d84-a847-496d-9cca-f4a3c13a81d1", 204 ], // Lizardfolk
		[ "e94dadeb-692d-43cf-8d59-91f1624c795d", 205 ], // Lizardfolk Shaman
		[ "dd58be51-e15c-4abb-8cf4-97263526d5d5", 347 ], // Mage
		[ "1f7aa396-edd4-47f6-88b6-f98793df12e5", 216 ], // Magma Mephit
		[ "f9b4996c-a11c-4f18-ab8b-fa627f384da7", 212 ], // Magmin
		[ "723492cc-2dc4-4c3e-b5a3-96b03dd30320", 332 ], // Mammoth
		[ "22a8a7af-8674-4308-9c7c-da4d02965093", 60 ], // Manes
		[ "70a0cbe2-5320-465d-afdf-7a4643da02fe", 213 ], // Manticore
		[ "b30c6226-cb44-4070-ba78-12bfcf3e8d9e", 146 ], // Marid
		[ "8e3f174d-372b-40b5-ac07-c5e4651d410c", 61 ], // Marilith
		[ "216f1424-504a-4c7f-8a0a-478bbf97f1ef", 332 ], // Mastiff
		[ "15a09594-1143-4b08-8f4e-0f5d9891b4d1", 214 ], // Medusa
		[ "620fe04b-ad34-4183-8af7-980b3609c482", 218 ], // Merfolk
		[ "8e619f31-7241-4022-91a2-de617597b090", 219 ], // Merrow
		[ "911a2153-0fc4-48bd-bb68-4d36ef72cb3c", 313 ], // Mezzoloth
		[ "ef5521a7-9b12-498b-907d-18acfdf73876", 220 ], // Mimic
		[ "699c0e8b-def1-41ff-a1bc-23d5315c973e", 222 ], // Mind Flayer Arcanist
		[ "00235a58-a598-495b-ba4e-7d56c15cbfc8", 222 ], // Mind Flayer
		[ "8e06aaf8-6a32-44d7-8c40-0b829ac94413", 273 ], // Minotaur Skeleton
		[ "852cfe83-a0d9-4170-86d7-e16b864ea7ef", 223 ], // Minotaur
		[ "36cf9acb-d215-4366-b8d8-cdd283bcaf82", 224 ], // Monodrone
		[ "edc88a1f-98d9-44f8-b376-e3b11cb24401", 216 ], // Mud Mephit
		[ "40e39910-dd75-41ac-a5b2-217d3d4e81de", 333 ], // Mule
		[ "f210a3a6-0a2d-4d9c-9ab0-0e837eb33749", 229 ], // Mummy Lord
		[ "d86cd0d2-a792-4585-809e-e59919189936", 228 ], // Mummy
		[ "13628cc9-ab44-4869-8bfd-cf155aca78c7", 232 ], // Myconid Adult
		[ "168dfe89-609f-4112-8925-25595fe88acd", 232 ], // Myconid Sovereign
		[ "4704981f-beb2-4b2a-98ce-30901162fe10", 230 ], // Myconid Sprout
		[ "fea2cf64-fbc7-45e9-b901-ede53d696bf3", 62 ], // Nalfeshnee
		[ "87ae63b6-4be9-43d7-a096-5556018c5999", 32 ], // Needle Blight
		[ "c419ea32-d524-462f-b65d-e88641fa177c", 178 ], // Night Hag
		[ "ff6fee89-50c4-4bbb-a2b0-07646c55b4e2", 178 ], // Night Hag (coven)
		[ "4ecef288-1f16-48b2-be23-f36b7fde5ced", 235 ], // Nightmare
		[ "f9a076f4-da7e-457a-912e-9fe8d752ef3e", 348 ], // Noble
		[ "ed0bb2d0-aef6-4a4b-a9cb-4a38045cc29c", 236 ], // Nothic
		[ "4ec385e4-55ea-4d7b-af20-513227375d22", 314 ], // Nycaloth
		[ "0474b4f6-5b72-46ac-9405-5e39b28750c2", 243 ], // Ochre Jelly
		[ "61154806-be2a-432b-953f-cd660073496b", 333 ], // Octopus
		[ "563daf80-0285-48c5-908b-2dc607550125", 316 ], // Ogre Zombie
		[ "545c030a-1674-4838-9d43-752db8265f87", 237 ], // Ogre
		[ "06db3698-ec58-48d4-867a-f6fdd875823b", 239 ], // Oni
		[ "18e67457-97e5-4efc-bb6c-084a910fbbd1", 247 ], // Orc Eye of Gruumsh
		[ "21ebdbb0-2305-4922-ae09-3c73eab5fb06", 246 ], // Orc War Chief
		[ "2fc71e84-7157-4d3f-9042-d9b17236f5f0", 246 ], // Orc
		[ "33072b76-ec36-4c54-9318-83d04d6ef44d", 247 ], // Orog
		[ "9dca97ac-f3fa-4be6-8a39-09291505f159", 248 ], // Otyugh
		[ "5b060b59-1142-4d65-9958-212dbce27820", 333 ], // Owl
		[ "293ad61d-ee17-4a20-954a-ab22f6edaa8d", 249 ], // Owlbear
		[ "777fa0ec-7cd3-497e-9a64-d5bf89ac6216", 333 ], // Panther
		[ "9f07db07-b9f9-4913-8603-3aeef1b217f3", 250 ], // Pegasus
		[ "8d7daed1-b832-454d-86cf-be5c99570402", 226 ], // Pentadrone
		[ "df1f8a95-9f6b-4699-af85-da4368f16cfd", 251 ], // Peryton
		[ "9f50717c-0766-4e2e-b218-7605ccb0d945", 334 ], // Phase Spider
		[ "cc49ec49-caa4-404b-92e6-9e7b4604cb12", 252 ], // Piercer
		[ "14742ff6-ed38-44f5-8e11-4ac74b20ba02", 77 ], // Pit Fiend
		[ "d851b9c3-0c0e-4378-a991-9b0d05c80931", 253 ], // Pixie
		[ "7de4388c-e067-4308-b02d-84ecb296aa6e", 17 ], // Planetar
		[ "633bf055-b509-4f7f-b4ca-5c14bbfeb919", 80 ], // Plesiosaurus
		[ "e23e499c-9022-482c-ae28-21790a692aab", 334 ], // Poisonous Snake
		[ "f2a7ac7e-972f-4956-908e-525eec2ae47c", 334 ], // Polar Bear
		[ "ed0ed3ff-2489-4a07-88f6-1e5e9b33580d", 279 ], // Poltergeist
		[ "18f9d16d-6151-45fc-b449-5ca10e66f49e", 335 ], // Pony
		[ "cc9e3c32-1c13-40a5-9d06-0ded81c4e3cb", 348 ], // Priest
		[ "ada98bc9-cb5c-4f02-8230-a349f85df99c", 254 ], // Pseudodragon
		[ "2bbec9af-7f96-40ed-84c8-9f5c98ae38c3", 80 ], // Pteranodon
		[ "0de2b8ec-9d78-497b-83a3-e7eb530a4c85", 255 ], // Purple Worm
		[ "06adb243-3e58-4b29-8fbe-34331bcb1b3e", 226 ], // Quadrone
		[ "fdecca35-c5ec-462b-958c-6c3f3b676158", 230 ], // Quaggoth Spore Servant
		[ "d9e9e29a-ba95-4740-86a8-927843168eb8", 256 ], // Quaggoth Thonot
		[ "0ff27a87-12ee-4196-a998-8d41c2ae1ee1", 256 ], // Quaggoth
		[ "05541b29-3f73-45f4-974c-6aabd25b4708", 63 ], // Quasit
		[ "33980992-7042-4c16-8ffb-d784114520d6", 335 ], // Quipper
		[ "018d5cba-4e7e-4519-b181-fb0bb7bf4474", 257 ], // Rakshasa
		[ "b01dae8d-020f-4ee2-a80a-de7cb133de53", 335 ], // Rat
		[ "cda02d73-dca4-45bb-92cb-ad2092a27ea5", 335 ], // Raven
		[ "e5d8b994-96ce-48e8-9cf2-5453b0d84959", 98 ], // Red Dragon Wyrmling
		[ "8ff160ae-eb45-4464-a436-e40c751cad1e", 276 ], // Red Slaad
		[ "75d4dfd5-8942-4661-b8a8-3fbcaec7d1ab", 336 ], // Reef Shark
		[ "148bab3f-70b0-45bb-af68-df93ae89c77f", 258 ], // Remorhaz
		[ "89ebcb90-c381-450d-a303-e1cb0f470a6a", 259 ], // Revenant
		[ "73254529-1dde-443a-9cbd-940157812fb1", 336 ], // Rhinoceros
		[ "e02034e2-fe58-4c02-bdb6-9a54baf6e86b", 336 ], // Riding Horse
		[ "77263f03-1681-4684-b9fe-8c089d8721a7", 260 ], // Roc
		[ "8e7f5fd8-557c-4176-aee8-2a894afb6b99", 261 ], // Roper
		[ "5defa2f6-bdb1-4439-8e3f-a0fe7ae78e31", 20 ], // Rug of Smothering
		[ "0245be52-98ed-441c-b7b6-823866ac50b0", 262 ], // Rust Monster
		[ "e8fb3a4e-52e3-4519-bfe4-2710fca7aca2", 336 ], // Saber-Toothed Tiger
		[ "791f3452-b13b-417b-923b-137e2f2073fa", 264 ], // Sahuagin Baron
		[ "c234a705-22a1-423d-99d2-73699bb0b58e", 264 ], // Sahuagin Priestess
		[ "cf012d1a-c0c3-4426-afca-8ef34b863071", 263 ], // Sahuagin
		[ "15cade7d-8730-49a3-bd2b-643a9a62d8c4", 266 ], // Salamander
		[ "f373bc88-ba01-4e6a-8889-580be0265c59", 267 ], // Satyr
		[ "24d24844-c27d-4261-b71e-bdca6de3f2f7", 268 ], // Scarecrow
		[ "d30a64ee-ac17-42e5-99ff-2186111615ad", 337 ], // Scorpion
		[ "14f5f317-1640-4254-b8d7-4d2dadb97394", 349 ], // Scout
		[ "6e15161a-e1b2-4a0c-94b0-db75d2e6ccb3", 179 ], // Sea Hag
		[ "0f788005-3e4c-47b0-8ffe-8266c424d825", 179 ], // Sea Hag (coven)
		[ "ec2f7099-286e-4384-990a-526cf70b1c55", 337 ], // Sea Horse
		[ "d356934b-d78b-49bf-9ce0-b9fb9946eb64", 64 ], // Shadow Demon
		[ "c4551c2c-c686-4105-83f6-87c873f8809f", 269 ], // Shadow
		[ "ea9c253b-1fe2-4e66-9331-61f6e3b02336", 270 ], // Shambling Mound
		[ "212a9d4e-60b7-4c1e-ac1c-67f26855e878", 271 ], // Shield Guardian
		[ "3aa695ea-6f7e-49bb-aef4-3153347c0fcc", 138 ], // Shrieker
		[ "def8e263-2dae-4ec5-b3b1-6150011ec485", 118 ], // Silver Dragon Wyrmling
		[ "3e946348-1cc2-405f-9975-5a4c09445750", 272 ], // Skeleton
		[ "68b382e5-a0a4-4b9b-bc57-d9684105296c", 276 ], // Slaad Tadpole
		[ "bdda67cb-ae81-4107-860a-eee6456ea92b", 217 ], // Smoke Mephit
		[ "6137fe73-562f-411b-8654-1e2d057a8da8", 18 ], // Solar
		[ "aadb1915-c3d4-4349-b9f2-5b7a10ab3f3d", 30 ], // Spectator
		[ "3a005074-e1df-4b63-88a4-3dd4edbd237a", 279 ], // Specter
		[ "5cf71994-66bd-433e-ae5f-d20071c48d85", 337 ], // Spider
		[ "0cf05453-f134-4a9a-8884-256965c0576b", 78 ], // Spined Devil
		[ "552f997f-6cf1-4150-8144-aea22f652471", 234 ], // Spirit Naga
		[ "e91d49d6-b139-4457-bd9c-45fd656ec408", 283 ], // Sprite
		[ "a9524fbf-b1e5-4ca4-9f79-f4e494f93bcb", 349 ], // Spy
		[ "d28e71ee-8388-4534-bb38-209de47bbe5e", 217 ], // Steam Mephit
		[ "b02dadd4-aa89-426c-ac9b-bfa07b8fe1fc", 284 ], // Stirge
		[ "c29cb38d-3b6a-459a-8643-843d256ab995", 156 ], // Stone Giant
		[ "235ac710-1418-4bda-b0e5-3ded0ccbe1f9", 170 ], // Stone Golem
		[ "ce9784dc-ee70-416b-955d-c554089ec044", 156 ], // Storm Giant
		[ "63a62f8f-06b8-4ae2-a746-9c42448399d0", 285 ], // Succubus/Incubus
		[ "c5cc5a1a-d412-40d3-9537-f22aa625f893", 337 ], // Swarm of Bats
		[ "e3b72f35-5e72-4bfa-b238-f22062184c1c", 338 ], // Swarm of Insects
		[ "c37dd213-9373-41af-9c87-e27513d16ec5", 338 ], // Swarm of Poisonous Snakes
		[ "d74a782b-6b71-4c9c-95d0-f8d61bb97e44", 338 ], // Swarm of Quippers
		[ "31c042ca-f348-4ba5-a749-bb659b296f8f", 339 ], // Swarm of Rats
		[ "adcec956-ebf2-42c3-9e60-4ec3f58c17e2", 339 ], // Swarm of Ravens
		[ "962c28e0-17f2-4fa9-b76c-0017f1768650", 286 ], // Tarrasque
		[ "28a1d46d-c0ae-4865-80d1-866629c4f817", 288 ], // Thri-kreen
		[ "9d458fc1-a489-49f8-9417-1c6c495d5e98", 350 ], // Thug
		[ "d0a5fb54-32bb-4704-ac1a-862a175d333b", 339 ], // Tiger
		[ "b4a2167a-3d19-466f-bcca-65bb10c00c69", 289 ], // Treant
		[ "183f147b-1fa5-4495-8641-d655c57dbd07", 350 ], // Tribal Warrior
		[ "75aa0080-9b95-4693-abfd-dc077ba0073a", 80 ], // Triceratops
		[ "8d9f2854-d059-4487-a326-ffd80b7ff95d", 225 ], // Tridrone
		[ "6d5a54d5-176b-46f6-988e-db5ff8176fab", 290 ], // Troglodyte
		[ "243e91ab-b859-44ce-a9cb-e14a055d1151", 291 ], // Troll
		[ "811f1a20-d074-4520-a8de-1e37bc53a00c", 32 ], // Twig Blight
		[ "49fb470b-4186-49a4-9794-05dfcdc8fe09", 80 ], // Tyrannosaurus Rex
		[ "17f653b5-f073-4638-855e-24d4c7f6c249", 314 ], // Ultraloth
		[ "ea840106-9d27-453c-9ded-c93725740323", 292 ], // Umber Hulk
		[ "fb6ed7bc-7f48-465b-8de0-083c4365d979", 294 ], // Unicorn
		[ "36f309b0-7f49-44ac-aba7-6a7405e58545", 298 ], // Vampire Spawn
		[ "7298a7a8-a523-49b7-8e60-26e6375cb87f", 298 ], // Vampire Spellcaster
		[ "1b36ddcf-1c1c-4238-a320-c602f74670f2", 298 ], // Vampire Warrior
		[ "f6277838-fcd7-4d25-b6a5-4049361e0978", 297 ], // Vampire
		[ "595c04c7-7c4d-442a-932a-22be86d294c9", 350 ], // Veteran
		[ "590ac204-e32e-4a8e-b4ea-1f7ca2c39851", 32 ], // Vine Blight
		[ "667b4af5-1335-4f33-bd19-34d947603dc9", 138 ], // Violet Fungus
		[ "993c1b2c-ea24-45c5-9c1d-a862d1f6b440", 64 ], // Vrock
		[ "b2f6a630-d8e2-42f5-8844-5a346f55c272", 339 ], // Vulture
		[ "33ec8ed0-0cd0-4def-9da6-761cf73206da", 273 ], // Warhorse Skeleton
		[ "8d0e875b-95f1-47a5-9d98-72ac4738c860", 340 ], // Warhorse
		[ "ef655c7f-1f59-4b56-8b52-3e96895cb20f", 125 ], // Water Elemental
		[ "0414cbe7-742c-4df8-9d4a-51dd1d37210e", 299 ], // Water Weird
		[ "3306e2fd-7249-45d6-abcd-1797c8d8ca30", 340 ], // Weasel
		[ "db897f13-24c8-4332-808f-682061af4b36", 208 ], // Werebear
		[ "59408dc1-6bee-467c-9e7e-108d7870d5a7", 209 ], // Wereboar
		[ "c8e2837f-ea3b-42a7-8a9b-84056d186006", 209 ], // Wererat
		[ "e63e1150-3b0b-46e0-a2cb-2a2f30cf5c69", 210 ], // Weretiger
		[ "80a17f83-7b94-497e-a10d-3dd1f3a8a889", 211 ], // Werewolf
		[ "c00182cb-df6f-42da-9193-e67eb119083c", 102 ], // White Dragon Wyrmling
		[ "76b14a0c-551e-4166-9e0a-e06bdb46623d", 300 ], // Wight
		[ "16d4afb3-8246-4709-8308-58d620849408", 301 ], // Will-o'-Wisp
		[ "e0b6446f-3791-479d-9e03-9a71c0de9f52", 195 ], // Winged Kobold
		[ "4da5597e-8f29-4fce-a4e7-d36ba2c5b6a7", 340 ], // Winter Wolf
		[ "9e4c024d-0b8b-40c7-9e4a-2b447450ab4e", 341 ], // Wolf
		[ "1d37bafc-ea8e-40e5-8546-475276cc903f", 341 ], // Worg
		[ "e0c0e8f0-bef8-4c76-872b-898a91c27969", 302 ], // Wraith
		[ "9b9d4516-f2ae-449d-80ba-0ce4e85438cc", 303 ], // Wyvern
		[ "77cbc6b6-3936-4dad-b575-7c45e81e22f9", 304 ], // Xorn
		[ "7686c9ce-acc2-4d30-8729-665c947c153d", 305 ], // Yeti
		[ "b6a29400-8010-4d35-b429-b65eb33de9c3", 65 ], // Yochlol
		[ "e1758345-1f6a-440c-bb64-d86ba7e96bfa", 88 ], // Young Black Dragon
		[ "5b5912af-1b34-45f7-adae-388645d0a500", 91 ], // Young Blue Dragon
		[ "04cd3926-8097-4020-87c1-74610125a529", 105 ], // Young Brass Dragon
		[ "994dda89-f812-4e4d-8996-40e877539101", 108 ], // Young Bronze Dragon
		[ "aec4cd35-e36f-41fd-a4a4-c19ab3d08218", 112 ], // Young Copper Dragon
		[ "f858036f-efe8-4f7f-af82-cfa836594474", 115 ], // Young Gold Dragon
		[ "d935c7ad-b765-4e72-8274-adb16a62aade", 94 ], // Young Green Dragon
		[ "3f6ed5da-bf09-4f65-bfd2-b012ebb01648", 98 ], // Young Red Dragon
		[ "ca105b5a-d47c-467a-b48f-bd25a9a33de4", 85 ], // Young Red Shadow Dragon
		[ "c10d36ba-73da-4718-bf7f-f078791639dd", 258 ], // Young Remorhaz
		[ "6c8026b5-6b8b-4b06-a3a8-78a4822d791f", 118 ], // Young Silver Dragon
		[ "3797b48d-5d9e-4e6b-ae4c-43fa4bfcf086", 101 ], // Young White Dragon
		[ "36d12747-408b-485c-859e-2d33b9c4d90e", 308 ], // Yuan-ti Abomination
		[ "718cb508-899e-46cd-8c26-6271fe470d62", 309 ], // Yuan-ti Malison
		[ "63edeedd-e398-4b1c-b4b8-557286512a8a", 310 ], // Yuan-ti Pureblood
		[ "ac42a801-316b-4f28-b552-592d7e751649", 316 ], // Zombie
	];

	for ( i = 0; i < toAdd.length; i++ ) {
		registerMonster(toAdd[i][0], sourceName, toAdd[i][1]);
	}
}());
