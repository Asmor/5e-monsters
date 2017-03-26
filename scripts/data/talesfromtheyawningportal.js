(function() {
	"use strict";

	angular.module('app')
		.factory("talesfromtheyawningportalSource", Source);

	function Source() {
		return {
			name: "Tales from the Yawning Portal",
			shortName: "Yawn",
			initialState: true,
			contents: [ 
				[ "0855a70f-ba7f-4e30-a584-cfa59be1eed3", 230 ], // Animated Table
				[ "efca8fda-9530-4c93-980b-7f3373403b94", 230 ], // Barghest (from Volo's)
				[ "96100b59-4807-4e18-abcb-de21528ae642", 231 ], // Centaur Mummy
				[ "fbe8bd0e-da21-4096-a08f-49d414fbeaa9", 231 ], // Champion (from Volo's)
				[ "8a3f9129-d373-451e-b8f3-ced663c2d754", 232 ], // Choker
				[ "e207f392-8307-4b67-968b-f49fe8ba7cf2", 232 ], // Conjurer (from Volo's)
				[ "4f5b3ea3-ac78-45e3-a226-6c3ef60b6c15", 233 ], // Deathlock Wight
				[ "4e8c2d21-858a-41c8-86e9-b1cf2c324baa", 233 ], // Dread Warrior
				[ "a05d907e-787b-4b4c-8ada-0b0dd970af84", 234 ], // Duergar Spy
				[ "ccf03973-5098-478b-9573-6cd0d039b226", 234 ], // Enchanter (from Volo's)
				[ "a39711ac-adde-4465-8b28-f2a0247def78", 235 ], // Evoker (from Volo's)
				[ "8411c027-a31e-4859-b0ca-65fd3a6a64c8", 235 ], // Giant Crayfish
				[ "4393e301-f4ca-4530-a4be-f3fab6d61479", 235 ], // Giant Ice Toad
				[ "c51945ec-2e38-4269-852e-e52a7c9510da", 236 ], // Giant Lightning Eel
				[ "3638bace-4250-4ec1-97f3-1e253e8feeb5", 236 ], // Giant Skeleton
				[ "22ffc860-f4b8-4128-b2fb-42fd308728c5", 236 ], // Giant Subterranean Lizard
				[ "2a5bb149-69ba-42e2-99e7-862d4a1197ba", 237 ], // Greater Zombie
				[ "fd3b4e47-8210-4d3a-9571-431c164c2747", 237 ], // Illusionist (from Volo's)
				[ "47e4ae88-edfc-4cc1-ab61-f36be1d6293b", 238 ], // Kalka-Kylla
				[ "d3c2f1e1-beb5-40ef-a990-e951720af189", 238 ], // Kelpie
				[ "42921ee2-bcd9-4563-9c86-809079af569b", 239 ], // Leucrotta
				[ "c8a6a3f0-2ee7-4785-8962-39c4acbbf5d0", 239 ], // Malformed Kraken
				[ "69b0d522-7ad1-4909-86f5-a8f716afd9d0", 240 ], // Martial Arts Adept (from Volo's)
				[ "b7125ade-88a0-43c3-84b8-4b3daa877051", 240 ], // Nereid
				[ "c3ccfd43-a212-4181-b175-c65ff82a6fcc", 241 ], // Necromancer (from Volo's)
				[ "12dc575b-58b0-4466-8906-828a818bea14", 241 ], // Ooze Master
				[ "b1c1ce38-ab06-4c44-becf-51850d2e39b2", 242 ], // Sea Lion
				[ "8a734438-bee6-4693-aa8c-a500e5fe4d33", 242 ], // Sharwyn Hucrele
				[ "60df13db-3d5c-4d7d-a980-1d2402c93ac8", 243 ], // Sir Braford
				[ "a77d2fee-8fb6-47ae-9bd0-7fdcbaab0ef0", 243 ], // Siren
				[ "ab165193-ec76-45ab-83e5-009a90cee15b", 244 ], // Tarul Var
				[ "ee8ffb63-36c2-4826-907f-4d0e2ffb590f", 245 ], // Tecuziztecatl
				[ "83c50b79-039c-47ea-aaef-2bbc26cc144d", 245 ], // Thayan Apprentice
				[ "4fd142a2-f48c-46d6-ab1a-a0ab4845ea90", 246 ], // Thayan Warrior
				[ "ae3b4ca1-eeae-4ffe-b9b1-df5c29e26544", 246 ], // Thorn Slinger
				[ "583e060b-a8a2-48e4-8474-cdcdf09da2fa", 247 ], // Transmuter (from Volo's)
				[ "83e32b85-664f-4b54-b9e0-9986056f2dd7", 247 ], // Vampiric Mist
				[ "5dbf10f4-1638-441d-8157-e127a98a9b78", 248 ], // White Maw
				[ "4456897b-e915-4845-b561-e17f939d8d97", 248 ], // Yusdrayl
			],
		}
	}
})();
