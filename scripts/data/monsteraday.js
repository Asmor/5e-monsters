"use strict";

define({
	name: "Monster-A-Day",
	initialState: false,
	contents: [
		[ "59dc127f-c93a-5f71-8b77-735936fb4ca0", 0, "https://www.reddit.com/r/monsteraday/comments/3hhz6e/day_1_grave_titan/"], // Grave Titan
		[ "2e38eaec-d231-51d2-beb3-da82cb7a1d44", 0, "https://www.reddit.com/r/monsteraday/comments/3hhz8l/day_2_rat_hermit/"], // Rat Hermit
		[ "adbfd507-fff1-5649-9ee0-517bdeedad61", 0, "https://www.reddit.com/r/monsteraday/comments/3hlub7/day_3_morphlit/"], // Morphlit
		[ "e01aaafc-acdd-56a9-8fcf-f8baa248c75a", 0, "https://www.reddit.com/r/monsteraday/comments/3hqoeo/day_4_selachian/"], // Selachian
		[ "d985884d-650f-564f-845a-6a1d5ed04a1a", 0, "https://www.reddit.com/r/monsteraday/comments/3hvcf6/day_5_kraken_hatchling/"], // Kraken Hatchling
		[ "076fbeb4-e49f-5e35-9e99-78d229bf7ad2", 0, "https://www.reddit.com/r/monsteraday/comments/3hzslo/day_6_pustuloid/"], // Pustuloid
		[ "f78ce030-6101-5b66-abbb-0a1bde8f7277", 0, "https://www.reddit.com/r/monsteraday/comments/3i3ctv/day_7_herald_of_rot/"], // Herald of Rot
		[ "3fd4bc9b-3562-570b-a7ea-820fa582baad", 0, "https://www.reddit.com/r/monsteraday/comments/3i7xyy/day_8_priest_of_blight/"], // Priest of Blight
		[ "bb017345-9b98-56c7-aed1-da6dd50c2d9a", 0, "https://www.reddit.com/r/monsteraday/comments/3icp48/day_9_monks_of_the_five_spires/"], // Fire Spire Initiate
		[ "8c7a6f49-37be-5531-a58f-f3ec9da6fa17", 0, "https://www.reddit.com/r/monsteraday/comments/3icp48/day_9_monks_of_the_five_spires/"], // Master of the Five Spires
		[ "29e80beb-2c3a-50b3-b679-20618b641f0e", 0, "https://www.reddit.com/r/monsteraday/comments/3ihkod/day_10_myr/"], // Myr
		[ "54c92db5-42cf-534a-8418-8d73b6f5c0ab", 0, "https://www.reddit.com/r/monsteraday/comments/3im98d/day_11_myr_battlesphere/"], // Myr Battlesphere
		[ "7aacbba6-e9fa-560a-83c5-c89cbb3dbcb4", 0, "https://www.reddit.com/r/monsteraday/comments/3iqsbv/day_12_fusion_elemental/"], // Fusion Elemental
		[ "6aaea83f-cd45-5042-ac24-f586fcecdfad", 0, "https://www.reddit.com/r/monsteraday/comments/3iv4zk/day_13_fallen_angel/"], // Fallen Angel
		[ "2f241d46-9f14-5991-a9a1-ce6fd8692c74", 0, "https://www.reddit.com/r/monsteraday/comments/3iz4a1/day_14_bone_golem/"], // Bone Golem
		[ "d437a412-3128-54af-a952-addebebab87c", 0, "https://www.reddit.com/r/monsteraday/comments/3j3u2p/day_15_sliver/"], // Sliver
		[ "f8fef1f5-258b-588e-9557-ff8e5bff5a78", 0, "https://www.reddit.com/r/monsteraday/comments/3j8n9t/day_16_armor_and_might_slivers/"], // Might Sliver
		[ "f77c175f-506d-557c-aef5-2f170ab90f0d", 0, "https://www.reddit.com/r/monsteraday/comments/3j8n9t/day_16_armor_and_might_slivers/"], // Armour Sliver
		[ "50576b80-6e26-5f03-bda5-a3dba5ca0700", 0, "https://www.reddit.com/r/monsteraday/comments/3jdpx6/day_17_winged_and_virulent_slivers/"], // Winged Sliver
		[ "2adf3d0a-8617-5b52-99ea-de9477a51309", 0, "https://www.reddit.com/r/monsteraday/comments/3jdpx6/day_17_winged_and_virulent_slivers/"], // Virulent Sliver
		[ "a9792b74-860b-59ea-be7c-1cc44139b2ef", 0, "https://www.reddit.com/r/monsteraday/comments/3jic37/day_18_crystalline_and_spitting_slivers/"], // Spitting Sliver
		[ "51a0186f-dbcd-520d-8f01-382aa2d0621f", 0, "https://www.reddit.com/r/monsteraday/comments/3jic37/day_18_crystalline_and_spitting_slivers/"], // Crystalline Sliver
		[ "6c980cfc-5e86-58c7-ad36-9f4f30b69cf7", 0, "https://www.reddit.com/r/monsteraday/comments/3jmqxr/day_19_sliver_queen/"], // Sliver Queen
		[ "6ba203b8-fcd8-531c-8132-63d661d3d6be", 0, "https://www.reddit.com/r/monsteraday/comments/3jr66s/day_20_fern_lizard/"], // Fern Lizard
		[ "5e68c5f1-4be0-53a3-b437-50e7afc8913a", 0, "https://www.reddit.com/r/monsteraday/comments/3jv169/day_21_luck_dragon/"], // Luck Dragon
		[ "db18b7ac-74da-56d2-94ac-576dd41bbe9c", 0, "https://www.reddit.com/r/monsteraday/comments/3jzoao/day_22_gnoll_deathknight/"], // Gnoll Deathknight
		[ "9ab66078-0d51-5ad0-b367-7b11ec247696", 0, "https://www.reddit.com/r/monsteraday/comments/3k44u9/day_23_gnoll_deathmage_and_fiendish_hyena/"], // Fiendish Hyena
		[ "39d9c50f-5bc2-5de1-bea6-80e84dd86bd9", 0, "https://www.reddit.com/r/monsteraday/comments/3k44u9/day_23_gnoll_deathmage_and_fiendish_hyena/"], // Gnoll Deathmage
		[ "5c7a660e-febe-5253-bdb3-00334c886ece", 0, "https://www.reddit.com/r/monsteraday/comments/3k9k4n/day_24_kobold_bully/"], // Kobold Bully
		[ "8c408eef-4955-517b-a780-e604acee19b0", 0, "https://www.reddit.com/r/monsteraday/comments/3sl0ij/updated_day_25_kobold_bully_with_bonus_monster_by/"], // Kobold Commander
		[ "1bc1f162-c67a-5d1a-bfd5-cb8c27acae60", 0, "https://www.reddit.com/r/monsteraday/comments/3kfc3r/day_25_kobold_shaman/"], // Kobold Shaman
		[ "65866bec-846e-5717-89e7-1b593b41d78e", 0, "https://www.reddit.com/r/monsteraday/comments/3sl07f/updated_day_25_kobold_shaman_with_bonus_monster/"], // Kobold Soldier
		[ "3dca68a1-1e17-5291-a474-602075da5ee0", 0, "https://www.reddit.com/r/monsteraday/comments/3kkb95/day_26_kobold_hero/"], // Kobold Hero
		[ "46c49f1e-ece4-5713-a7d9-ece62dd64d0e", 0, "https://www.reddit.com/r/monsteraday/comments/3koi6v/day_27_spirit/"], // Spirit
		[ "3bf8b6d5-48b9-5c67-abce-08864204d0bc", 0, "https://www.reddit.com/r/monsteraday/comments/3ksvec/day_28_baneling/"], // Baneling
		[ "f14e1cac-3f0b-5312-8927-720f4130e960", 0, "https://www.reddit.com/r/monsteraday/comments/3kxhr5/day_29_pact_devil/"], // Pact Devil
		[ "46f4e1d3-315b-5682-8c38-3445af06b159", 0, "https://www.reddit.com/r/monsteraday/comments/3l2bm1/day_30_truesong_bards/"], // Truesong Dancer
		[ "d6000051-ecfd-5bf6-a7b2-8377bbacf114", 0, "https://www.reddit.com/r/monsteraday/comments/3l2bm1/day_30_truesong_bards/"], // Truesong Dirge
		[ "4b87c32b-ed76-5713-b651-cdd186b4ee51", 0, "https://www.reddit.com/r/monsteraday/comments/3l6z5t/day_31_leonin/"], // Leonin
		[ "35022402-2e9b-5902-b195-31e3e3128775", 0, "https://www.reddit.com/r/monsteraday/comments/3lboj2/day_32_tuskaloth/"], // Tuskaloth
		[ "984ffc6a-48c5-5752-ab64-17b0c8e9b09f", 0, "https://www.reddit.com/r/monsteraday/comments/3lga4m/day_33_clockwork_dragon/"], // Clockwork Dragon
		[ "c6d2824b-0c27-508d-ad1c-c9c6e045a8e8", 0, "https://www.reddit.com/r/monsteraday/comments/3lkpfr/day_34_arcanamite/"], // Arcanamite
		[ "86c8a930-7053-51af-9feb-a250233acf62", 0, "https://www.reddit.com/r/monsteraday/comments/3lol76/day_35_gazellean/"], // Gazellean
		[ "98a0cb71-6791-541f-90d7-fc586010e839", 0, "https://www.reddit.com/r/monsteraday/comments/3ltrtn/day_36_spellskite/"], // Spellskite
		[ "7f6ee622-ec69-52a8-a9de-62dd94df77ac", 0, "https://www.reddit.com/r/monsteraday/comments/3lyhsw/day_37_troll_boar/"], // Troll Boar
		[ "1d99298b-976a-53eb-9100-1bc9cd2d37e0", 0, "https://www.reddit.com/r/monsteraday/comments/3m33t3/day_38_grove_guardian/"], // Grove Guardian
		[ "212bc756-ae05-5452-b3b0-b7b3197b9384", 0, "https://www.reddit.com/r/monsteraday/comments/3m7l6o/day_39_silverpaw_paladin_and_dog/"], // Silverpaw Dog
		[ "1500c9b6-65c4-5cb6-965f-454b09d853b1", 0, "https://www.reddit.com/r/monsteraday/comments/3m7l6o/day_39_silverpaw_paladin_and_dog/"], // Silverpaw Paladin
		[ "2c052371-15a4-5859-a35c-5e3a044de76a", 0, "https://www.reddit.com/r/monsteraday/comments/3mctof/day_40_dream_eater/"], // Dream Eater
		[ "6fb8d0a0-aa8a-53c6-afef-133981179bd7", 0, "https://www.reddit.com/r/monsteraday/comments/3mh4se/day_41_coven_horror/"], // Coven Horror
		[ "d983d439-66ba-512a-bb0f-4fbd5e512baf", 0, "https://www.reddit.com/r/monsteraday/comments/3ml17i/day_42_burning_skeleton/"], // Burning Skeleton
		[ "393c286b-0c0e-581f-a2fb-3711d00382a6", 0, "https://www.reddit.com/r/monsteraday/comments/3mpzye/day_43_eldrazi_scion/"], // Eldrazi Scion
		[ "361e1f3d-3ca0-5c56-b651-e4fe1da80d29", 0, "https://www.reddit.com/r/monsteraday/comments/3mutdt/day_44_brood_monitor/"], // Brood Monitor
		[ "df831f20-8493-59ea-9708-cb21adbe068c", 0, "https://www.reddit.com/r/monsteraday/comments/3mza7d/day_45_brood_butcher/"], // Brood Butcher
		[ "1e871052-ad86-5143-9643-1eb60e1a9c37", 0, "https://www.reddit.com/r/monsteraday/comments/3n4hkn/day_46_sire_of_stagnation/"], // Sire of Stagnation
		[ "715fa170-48c8-5b1c-8473-62fa7bd8fe77", 0, "https://www.reddit.com/r/monsteraday/comments/3n8wqq/day_47_ulamog_the_ceaseless_hunger/"], // Ulamog, the Ceaseless Hunger
		[ "ea36ebf6-3fb3-5098-b38f-77e66298954d", 0, "https://www.reddit.com/r/monsteraday/comments/3nctcd/day_48_tentaghoul/"], // Tentaghoul
		[ "9490dc31-e70b-5585-a185-bb43445262b9", 0, "https://www.reddit.com/r/monsteraday/comments/3ngo6q/day_49_death_widow/"], // Death Widow
		[ "63473bc9-006e-52b2-8a8a-f69a2be556de", 0, "https://www.reddit.com/r/monsteraday/comments/3nl5wp/day_50_screecher/"], // Screecher
		[ "c1080389-7eb6-5f7c-a6d8-1db800992f82", 0, "https://www.reddit.com/r/monsteraday/comments/3npsf8/day_51_gladeborn_rangers/"], // Gladeborn Trapper
		[ "b024b624-9bbe-5f0a-9b02-027fc42365ac", 0, "https://www.reddit.com/r/monsteraday/comments/3npsf8/day_51_gladeborn_rangers/"], // Gladeborn Hunter
		[ "ae587e7a-dcd7-5c4b-b4d7-eeae5b167a8b", 0, "https://www.reddit.com/r/monsteraday/comments/3nur5w/day_52_spider_skull/"], // Spider Skull
		[ "385b9e74-056e-5f8f-af84-82a8a3f369c1", 0, "https://www.reddit.com/r/monsteraday/comments/3nzdh1/day_53_swarm_of_squirrels/"], // Swarm of Squirrels
		[ "90f3f751-373a-5d25-ba22-1d03e39398bf", 0, "https://www.reddit.com/r/monsteraday/comments/3o41vx/day_54_ginormous_squirrel/"], // Ginormous Squirrel
		[ "e1d6d3fc-8f5f-5aba-b531-471f5659051c", 0, "https://www.reddit.com/r/monsteraday/comments/3o8i97/day_55_verdalin/"], // Verdalin
		[ "837f7fa0-d9a6-5a3a-a99a-1df012f90a39", 0, "https://www.reddit.com/r/monsteraday/comments/3oc713/day_56_owlbear_matron/"], // Owlbear Matron
		[ "a896ebd5-dbb4-5efa-a3ef-90de48d771e8", 0, "https://www.reddit.com/r/monsteraday/comments/3ogkel/day_57_snow_spider/"], // Snow Spider
		[ "85985297-b434-5c7a-9a03-39dca982c613", 0, "https://www.reddit.com/r/monsteraday/comments/3olui8/day_58_winter_sprite/"], // Winter Sprite
		[ "6159d5f3-547e-5a37-9519-cf0d0237f350", 0, "https://www.reddit.com/r/monsteraday/comments/3oqgxh/day_59_wight_walker/"], // Wight Walker
		[ "abb92d58-da93-557d-a0fe-e9088b1a3f56", 0, "https://www.reddit.com/r/monsteraday/comments/3ovbhb/day_60_ice_golem/"], // Ice Golem
		[ "f48f3757-ba7f-5476-80ba-a09c3042543d", 0, "https://www.reddit.com/r/monsteraday/comments/3p02np/day_61_frost_giant_jarl/"], // Frost Giant Jarl
		[ "44750eef-c3ac-51b1-b62f-5538630d38df", 0, "https://www.reddit.com/r/monsteraday/comments/3p4fvb/day_62_rusalka/"], // Rusalka
		[ "7f2bcc7b-9b97-5091-8309-77cac5232369", 0, "https://www.reddit.com/r/monsteraday/comments/3p8foi/day_63_clockwork_pest/"], // Clockwork Pest
		[ "c378b19d-65dc-5c65-866e-485f893a69cd", 0, "https://www.reddit.com/r/monsteraday/comments/3pd73a/day_64_froghoul/"], // Froghoul
		[ "3ebf14e5-778b-5dfc-a261-5ea9d291f6f9", 0, "https://www.reddit.com/r/monsteraday/comments/3pi58x/day_65_azure_sorcerers/"], // Azure Enchanter
		[ "caa85158-2825-5bde-9efd-645058ba6816", 0, "https://www.reddit.com/r/monsteraday/comments/3pi58x/day_65_azure_sorcerers/"], // Azure Mind Scupltor
		[ "f00c0b0d-3f6a-5072-afd4-53517987af03", 0, "https://www.reddit.com/r/monsteraday/comments/3pn9gi/day_66_infestation_swarm/"], // Infestation Swarm
		[ "2effdaec-6978-55c6-a67d-a85a55f3983b", 0, "https://www.reddit.com/r/monsteraday/comments/3psbbl/day_67_living_spellbook/"], // Living Spellbook
		[ "8489ece9-af4a-5494-b040-1796f3040318", 0, "https://www.reddit.com/r/monsteraday/comments/3px4wr/day_68_war_titan/"], // War Titan
		[ "a5182d00-2561-5858-9202-81b512fc19ee", 0, "https://www.reddit.com/r/monsteraday/comments/3q1gtw/day_69_magma_bear/"], // Magma Bear
		[ "c9e17c19-2e1c-52a7-af0b-a3e4e909a8be", 0, "https://www.reddit.com/r/monsteraday/comments/3q5njk/day_70_caustic_crawler/"], // Caustic Crawler
		[ "737d6217-c3da-57e6-85c9-c7f1546a74ce", 0, "https://www.reddit.com/r/monsteraday/comments/3qaafe/day_71_evil_doll/"], // Evil Doll
		[ "ee032904-c71c-553b-b3ac-f3b267dc6914", 0, "https://www.reddit.com/r/monsteraday/comments/3qf9kq/day_72_gillman/"], // Gill-man
		[ "ec9f15d5-6c20-5c82-964a-c75a3739098c", 0, "https://www.reddit.com/r/monsteraday/comments/3qkvws/day_73_masked_killer/"], // Masked Killer
		[ "4fe1572b-5acb-55d9-9773-be0aa79d0c62", 0, "https://www.reddit.com/r/monsteraday/comments/3qq341/day_74_headless_horseman/"], // Headless Horseman
		[ "3a01c90d-aae7-531a-9491-af8f00f720b1", 0, "https://www.reddit.com/r/monsteraday/comments/3quzlc/day_75_pumpkin_king/"], // Pumpkin King
		[ "ab1e249e-377f-53c8-b508-a0c78fe3b1bc", 0, "https://www.reddit.com/r/monsteraday/comments/3qzcso/day_76_winged_ape/"], // Winged Ape
		[ "e514a47e-37bf-5f24-88c1-f27d22ce589b", 0, "https://www.reddit.com/r/monsteraday/comments/3r3co3/day_77_feyote/"], // Feyote
		[ "da89e087-058e-5d11-b7df-85a3cdd7a9a6", 0, "https://www.reddit.com/r/monsteraday/comments/3r8fmp/day_78_scorpikis/"], // Scorpikis
		[ "e2b67f99-65e9-584e-9189-6506c71971ba", 0, "https://www.reddit.com/r/monsteraday/comments/3rdrry/day_79_chronomancers/"], // Ancient Chronomancer
		[ "52f02835-820d-5dc6-9c86-14b11dd11532", 0, "https://www.reddit.com/r/monsteraday/comments/3rdrry/day_79_chronomancers/"], // Timeless Chronomancer
		[ "0db8adb1-5dfb-517a-95bc-2bc16851c552", 0, "https://www.reddit.com/r/monsteraday/comments/3rin2p/day_80_hawkfox/"], // Hawkfox
		[ "b5ba63d2-4eb9-5328-98e9-3cd51ea24dc5", 0, "https://www.reddit.com/r/monsteraday/comments/3rnhq1/day_81_sylvan_stalker/"], // Sylvan Stalker
		[ "123f6378-24e4-5b67-bebe-2f4b5ebb3c3d", 0, "https://www.reddit.com/r/monsteraday/comments/3rsad4/day_82_werewolf_alpha/"], // Werewolf Alpha
		[ "cb35c29c-3459-5048-b75b-14e92d9b1bfc", 0, "https://www.reddit.com/r/monsteraday/comments/3rx71v/day_83_technothug/"], // Technothug
		[ "78580f59-20b6-5dfa-b358-6423529dd856", 0, "https://www.reddit.com/r/monsteraday/comments/3s0lep/day_84_chainer_geist/"], // Chainer Geist
		[ "b1f4e1b6-1da1-5da1-92f3-090bf8640d7c", 0, "https://www.reddit.com/r/monsteraday/comments/3s5md9/day_85_bullywug_shaman/"], // Bullywug Shaman
		[ "7f1cd765-a57b-5a3b-8e43-662a54e14d6e", 0, "https://www.reddit.com/r/monsteraday/comments/3sasfq/day_86_goblin_alchemist_and_ritualist/"], // Goblin Alchemist
		[ "ee072afa-6337-557e-b9d0-d817210423dd", 0, "https://www.reddit.com/r/monsteraday/comments/3sasfq/day_86_goblin_alchemist_and_ritualist/"], // Goblin Ritualist
		[ "10f2d054-d274-526a-8097-9f3921abc1c2", 0, "https://www.reddit.com/r/monsteraday/comments/3sfio5/day_87_lizardfolk_monk/"], // Lizardfolk Monk
		[ "f193a293-ade1-5b5f-98f4-b34980bd2cdc", 0, "https://www.reddit.com/r/monsteraday/comments/3sk53c/day_88_orc_berserker/"], // Orc Berserker
		[ "81295b69-4438-5c59-9622-6a1f31ac8115", 0, "https://www.reddit.com/r/monsteraday/comments/3sonx0/day_89_orc_hand_of_gruumsh/"], // Orc Hand of Gruumsh
		[ "4b78c693-794c-5e30-a23c-e33f8c65dc75", 0, "https://www.reddit.com/r/monsteraday/comments/3ssksc/day_90_crystal_elemental/"], // Crystal Elemental
		[ "27d3cf23-0e72-5c9b-9a94-628c561529e4", 0, "https://www.reddit.com/r/monsteraday/comments/3swk7b/day_91_armed_skeleton/"], // Armed Skeleton
		[ "197fcb81-d34e-55e5-abc5-9a1275cf017f", 0, "https://www.reddit.com/r/monsteraday/comments/3t1u2d/day_92_dire_anglerfish/"], // Dire Anglerfish
		[ "1f81997d-fd0a-5ea9-b813-baab00fd9676", 0, "https://www.reddit.com/r/monsteraday/comments/3t6n4i/day_93_grim_sea_pirates/"], // Pirate Axe Thrower
		[ "dc7cf588-46c1-56d4-97cb-7c86cd1055b9", 0, "https://www.reddit.com/r/monsteraday/comments/3t6n4i/day_93_grim_sea_pirates/"], // Pirate Chain Swinger
		[ "f16c46ce-12e0-56e1-a295-85938fa93bc7", 0, "https://www.reddit.com/r/monsteraday/comments/3tbisl/day_94_crowlock/"], // Crowlock
		[ "a3bfe860-8cc3-5ce3-8afe-986a55461553", 0, "https://www.reddit.com/r/monsteraday/comments/3tgj7n/day_95_vodyanoy/"], // Vodyanoy
		[ "7f194628-94f6-579c-862b-ac98afc84cd2", 0, "https://www.reddit.com/r/monsteraday/comments/3tlb1z/day_96_crystalline_dragon/"], // Crystalline Dragon
		[ "30890370-b47a-53c9-bf60-303294d9fc09", 0, "https://www.reddit.com/r/monsteraday/comments/3tplf0/day_97_beast_of_ill_omen/"], // Beast of Ill Omen
		[ "f48a544b-f17d-5541-852d-afad6438e907", 0, "https://www.reddit.com/r/monsteraday/comments/3tubf2/day_98_chamaelean/"], // Chamaelean
		[ "c7ee7278-4db9-5dcb-9259-bdaaf26e1b3d", 0, "https://www.reddit.com/r/monsteraday/comments/3tymld/day_99_phelddagrif/"], // Phelddagrif
		[ "fb44e9eb-1edd-59f5-bbce-9ac84f631e71", 0, "https://www.reddit.com/r/monsteraday/comments/3u3mkx/day_100_stone_strix/"], // Stone Strix
	],
});
