(function () {
	/* global requirejs */
	"use strict";

	var myApp = angular
		.module("app", [
			"ui.router",
			"ngTouch",
			"angularUtils.directives.dirPagination",
			"LocalStorageModule"
		]);

	myApp.config(function(localStorageServiceProvider) {
		localStorageServiceProvider
    		.setPrefix('');
	});

	myApp.run(serviceInitialization);

	serviceInitialization.$inject = ['$log', 'encounter', 'players'];

	function serviceInitialization($log, encounter, players) {
		$log.log("Service initialization on app run");
		encounter.initialize();
		players.initialize();
	}
})();
(function() {
	'use strict';

	angular
		.module('app')
		.run(appRun);

	appRun.$inject = ['routerHelper'];

	function appRun(routerHelper) {
		var otherwise = "/encounter-builder";
		routerHelper.configureStates(getStates(), otherwise);
	}

	function getStates() {
		return [
			{
				state: "battle-setup",
				config: {
					url: "/battle-setup",
					templateUrl: "app/battle-setup/battle-setup.html",
					controller: 'BattleSetupController',
					controllerAs: "vm"
				}
			},
			{
				state: "battle-tracker",
				config: {
					url: "/fight",
					templateUrl: "app/battle-tracker/battle-tracker.html",
					controller: 'BattleTrackerController',
					controllerAs: "vm"
				}
			},
			{
				state: "encounter-builder",
				config: {
					url: "/encounter-builder",
					templateUrl: "app/encounter-builder/encounter-builder.html",
					controller: 'EncounterBuilderController',
					controllerAs: "vm"
				}
			},
			{
				state: "encounter-manager",
				config: {
					url: "/encounter-manager",
					templateUrl: "app/encounter-manager/encounter-manager.html",
					controller: 'EncounterManagerController',
					controllerAs: "vm"
				}
			},
			{
				state: "players",
				config: {
					url: "/players",
					templateUrl: "app/players/players.html",
					controller: 'PlayersController',
					controllerAs: "vm"
				}
			},
			{
				state: "players.manage",
				config: {
					url: "/manage",
					templateUrl: "app/players/manage.html",
					controller: 'ManagePlayersController',
					controllerAs: "vm"
				}
			},
						{
				state: "players.edit",
				config: {
					url: "/edit",
					templateUrl: "app/players/edit.html",
					controller: 'EditPlayersController',
					controllerAs: "vm"
				}
			},
			{
				state: "about",
				config: {
					url: "/about",
					templateUrl: "app/about/about.html",
					controller: angular.noop,
					controllerAs: "vm"
				}
			},
			{
				state: "test",
				config: {
					url: "/test",
					templateUrl: "app/test.html",
					controller: 'TestController',
					controllerAs: "vm"
				}
			}
		];
	}

})();


(function() {
	'use strict';

	angular
		.module('app')
		.controller('BattleSetupController', BattleSetupController);

	BattleSetupController.$inject = ['$state', 'actionQueue', 'combat', 'combatConstants', 'integration'];

	function BattleSetupController($state, actionQueue, combat, combatConstants, integration) {
		var vm = this;
		
		vm.combat = combat;

		vm.launchImpInit = integration.launchImpInit;

		activate();

		////////////////

		function activate() {
			var combatState = combat.init(),
				forward;

			if ( combatState & combatConstants.NO_PLAYERS ) {
				actionQueue.unshift("players.manage", "You must select a party");
				forward = true;
			}

			if ( combatState & combatConstants.NO_MONSTERS ) {
				actionQueue.unshift("encounter-manager", "You must select an encounter");
				forward = true;
			}

			if ( forward ) {
				// In the end, send them back here
				actionQueue.queue("battle-setup");

				actionQueue.next($state);
			}
		}
	}
})();

(function() {
'use strict';

    angular
        .module('app')
        .component('combatantSetup', {
            templateUrl: 'app/battle-setup/combatant-setup.html',
            controller: 'combatantSetupController',
            controllerAs: "vm",
            bindings: {
                combatant: '<'
            },
        });
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('combatantSetupController', CombatantSetupController);

    CombatantSetupController.$inject = ['combat'];
    function CombatantSetupController(combat) {
        var vm = this;
        vm.combat = combat;

        activate();

        ////////////////

        function activate() { }
    }
})();
(function() {
'use strict';

	angular
		.module('app')
		.controller('BattleTrackerController', BattleTrackerController);

	BattleTrackerController.$inject = ['$state', 'combat'];

	function BattleTrackerController($state, combat) {
		var vm = this;
		vm.combat = combat;

		activate();

		////////////////

		function activate() { 
			if ( !combat.combatants || !combat.combatants.length ) {
				$state.go("encounter-builder");
			}
			
			combat.begin();
		}
	}
})();
(function() {
'use strict';

    angular
        .module('app')
        .component('combatant', {
            templateUrl: 'app/battle-tracker/combatant.html',
            controller: CombatantController,
            controllerAs: 'vm',
            bindings: {
                combatant: '<'
            },
        });

    CombatantController.$inject = ['combat'];
    function CombatantController(combat) {
        var vm = this;
        vm.combat = combat;

        activate();

        ////////////////

        function activate() { }
    }
})();
(function () {
	"use strict";

	angular.module("app")
		.constant("combatConstants", {
			READY       : 1,
			NO_MONSTERS : 2,
			NO_PLAYERS  : 4
		})
		.constant("AppVersion", 1);
})();
(function() {
    'use strict';

    angular
        .module('app')
        .component('difficultyLegend', {
            bindings: {
                showHeader: '<'
            },
            controllerAs: 'vm',
            templateUrl: 'app/common/difficulty-legend.html'
        });
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('NumberInputController', NumberInputController);

    NumberInputController.$inject = [];

    function NumberInputController() {
        var vm = this;
        vm.modify = modify;
        vm.hideNegative = hideNegative;

        activate();

        ////////////////

        function activate() { }

        function modify(amt) {
            vm.value += amt;

            if ( vm.nonNegative && vm.value < 0 ) {
                vm.value = 0;
            }
        }

        function hideNegative() {
            return vm.nonNegative && vm.value === 0;
        }
    }
})();
(function() {
	"use strict";

	angular.module('app')
		.directive('numberInput', NumberInput);

	function NumberInput() {
		return {
			restrict: "E",
			scope: {},
			bindToController: {
				value: '=model',
				mods: '=buttons',
				nonNegative: '=nonNegative'
			},
			templateUrl: "app/common/number-input.html",
			controller: 'NumberInputController',
			controllerAs: 'vm'
		};
	}
})();

(function() { 
	"use strict";

	angular.module("app")
		.factory("monsterData", MonsterData);

	MonsterData.$inject = [
		"monsterStats",
		"basicrulesSource",
		"placeholderSource",
		"hotdqSource",
		"hotdqsupSource",
		"rotSource", 
		"curseofstrahdSource",
		"stormkingsthunderSource",  
		"monstermanualSource",
		"playershandbookSource",
		"princesSource",
		"princessupplementSource",
		"outoftheabyssSource",
		"monsteradaySource",
		"fiftheditionfoesSource",
		"primevalthuleSource",
		"primevalthulegmcSource",
		"tomeofbeastsSource", 
		"volosguidetomonstersSource"
	];

	function MonsterData(monsters) {
		var data = {
			monsters: monsters,
			sources: Array.prototype.slice.call(arguments, 1)
		};

		// require([
		// 	// Monsters MUST be the first dependency! All subsequent dependencies are assumed to be sources
		// 	// and passed as a slice
		// 	"scripts/data/monsters",
		// 	"scripts/data/basicrules",
		// 	"scripts/data/custom",
		// 	"scripts/data/hotdq",
		// 	"scripts/data/hotdqsup",
		// 	"scripts/data/rot", 
		// 	"scripts/data/curseofstrahd",
		// 	"scripts/data/stormkingsthunder",  
		// 	"scripts/data/monstermanual",
		// 	"scripts/data/playershandbook",
		// 	"scripts/data/princes",
		// 	"scripts/data/princessupplement",
		// 	"scripts/data/outoftheabyss",
		// 	"scripts/data/monsteraday",
		// 	"scripts/data/fiftheditionfoes",
		// 	"scripts/data/primevalthule",
		// 	"scripts/data/primevalthulegmc",
		// 	"scripts/data/tomeofbeasts", 
		// 	"scripts/data/volosguidetomonsters", 
		// ], function (monsters) {

		return data;
		// });
	}
})();


(function() {
	"use strict";

	angular.module("app")
		.factory('basicrulesSource', BasicRulesSource);

	function BasicRulesSource() {
		return {
			name: "Basic Rules v1",
			shortName: "Basic",
			initialState: false,
			contents: [
				[ "a27291de-91c5-4b8e-9ffe-5055e90cc6cd", 8 ], // Adult Red Dragon
				[ "071f1203-f6e6-4fcf-928c-b9cdeb256b2b", 9 ], // Air Elemental
				[ "4dfdcf3d-5bdc-4d4d-a55c-6a9149d97079", 9 ], // Allosaurus
				[ "3c5a63ab-b94f-4451-aa2a-02545b381797", 9 ], // Animated Armor
				[ "935a62a6-3538-4ea8-a06c-adddef096e56", 10 ], // Ankylosaurus
				[ "0788c447-ada3-4bc2-aa38-bc9e08b186d4", 10 ], // Ape
				[ "0966d112-1f88-45cc-b018-c03103c2b3a0", 10 ], // Awakened Shrub
				[ "98e6eb4b-4998-4a6c-9366-09a82b0c3028", 10 ], // Awakened Tree
				[ "62b74702-7ffa-4827-83dc-b97dec26690a", 11 ], // Axe Beak
				[ "f3d4a9b6-622b-4c6c-b809-df565839699c", 11 ], // Baboon
				[ "e4ca5f7e-4218-4083-a8e0-009b24bd66cb", 11 ], // Badger
				[ "59a79db3-22c9-457f-bcb0-990013e4057a", 11 ], // Banshee
				[ "fca1066d-9c2c-4745-972c-a4e19376bab7", 12 ], // Basilisk
				[ "afee8041-1219-4d31-931d-3c3a08b0b449", 12 ], // Bat
				[ "a233bc77-4107-456a-89d2-9d91b4ada1a2", 12 ], // Black Bear
				[ "92452019-5b58-4f07-acdc-89be2ab34c2f", 12 ], // Blink Dog
				[ "2fd54197-cb28-4dcd-b0b3-adfc90de53f6", 13 ], // Blood Hawk
				[ "14ef11ed-2340-46de-a4eb-e9932f839f5d", 13 ], // Boar
				[ "197d96a0-a8c4-48be-af3d-6174ac281afb", 13 ], // Brown Bear
				[ "2dad5420-04bb-4921-9857-34700a52f413", 13 ], // Bugbear
				[ "67f7d07c-5002-4768-9586-3ed988bec1e9", 14 ], // Camel
				[ "8db064e4-cca6-4757-b558-a7f122ddf06f", 14 ], // Cat
				[ "a9212953-cb55-4b5d-80ff-c3703fc5cb0e", 14 ], // Centaur
				[ "a11e72bd-d81b-4826-901d-d2101c287b1e", 14 ], // Chimera
				[ "6782e851-fe66-4e6f-abd2-2de17c0f4db9", 15 ], // Cockatrice
				[ "5ed4761c-b22d-4873-9ad3-31344c34819b", 15 ], // Constrictor Snake
				[ "a92307d2-e938-4ee2-aee7-36eae63e2fc9", 15 ], // Crab
				[ "604dfa7a-4b77-4633-a3ce-83e2c073e0d4", 15 ], // Crocodile
				[ "1c299dc6-ea10-4314-bc9a-0f40fe4dbfab", 16 ], // Cyclops
				[ "3f109065-752c-496c-9169-b2ab3399126b", 16 ], // Death Dog
				[ "ba54ab80-5007-4695-9f82-003a88cfdeeb", 16 ], // Deer
				[ "9a507770-7644-4486-b73e-ca04b78d2e43", 16 ], // Dire Wolf
				[ "738ff802-57e5-4f73-89cb-5def2b527fc0", 17 ], // Doppelganger
				[ "46979307-705f-43e6-be68-7f72c936b1ba", 17 ], // Draft Horse
				[ "2b990f56-68e4-4c1c-8905-c1a05269beeb", 17 ], // Eagle
				[ "e5f96c20-3f6c-4374-90e8-89a3952f2562", 17 ], // Earth Elemental
				[ "45934b57-b2f7-4bce-bc98-0af4e1233b62", 18 ], // Elephant
				[ "eb4b6767-1035-48a2-8a66-b9e2572e2322", 18 ], // Elk
				[ "4630fbab-b0ca-41dc-9e42-3a69a737ff0e", 18 ], // Fire Elemental
				[ "cc07acfb-a623-43ec-8c23-70a0385eb481", 19 ], // Fire Giant
				[ "4665dbb1-cbc4-433a-a0df-0b6477d6f4fa", 19 ], // Flameskull
				[ "1a0097d3-c91a-4515-89cf-a63c4badc355", 20 ], // Flesh Golem
				[ "6afa4798-b9c5-4139-adeb-55eaba3e9cdb", 20 ], // Flying Snake
				[ "35c699fb-a8d2-491f-9a73-206a61937297", 20 ], // Flying Sword
				[ "303172de-265f-4046-bf47-2aff0f444f6e", 21 ], // Frog
				[ "8a2720eb-fb5c-4a79-8560-b3d1443d5e76", 21 ], // Frost Giant
				[ "625ff3cf-c836-498f-bb9b-de25adb1c26d", 21 ], // Gargoyle
				[ "c15c8f1e-5e6c-4011-a994-683fbb0b18dd", 22 ], // Ghost
				[ "369e60c6-5792-4623-8e11-36951e652011", 22 ], // Ghoul
				[ "4115f79a-084f-4775-b821-2b7ce6fc60d6", 22 ], // Giant Ape
				[ "2a435613-2ac3-4486-90e6-e62e2efce0ec", 23 ], // Giant Badger
				[ "f96d5318-3768-4f78-b800-6cc36f474c0a", 23 ], // Giant Bat
				[ "bcc30ff0-0853-456b-961e-c23a7236b979", 23 ], // Giant Boar
				[ "98ec83af-5011-4e90-b17e-7885df911032", 23 ], // Giant Centipede
				[ "f2d2909a-895b-4f43-89eb-5a17a5f129c3", 24 ], // Giant Constrictor Snake
				[ "df3f2dc9-40e2-48f3-9d40-a62a57dd0492", 24 ], // Giant Crab
				[ "2408c546-fa02-40e0-9264-08d13fe5386c", 24 ], // Giant Crocodile
				[ "a02c80fc-b950-4e71-be07-2a3b28a126a4", 24 ], // Giant Eagle
				[ "68039952-d660-43e4-8949-ae6eb04606b6", 25 ], // Giant Elk
				[ "3b66d494-fe9b-411c-8e8e-d8f384c41ef8", 25 ], // Giant Fire Beetle
				[ "7a608516-9ef3-4bf3-85c6-45837c61a77e", 25 ], // Giant Frog
				[ "6589f3c5-4596-4fd4-b69c-94be539aade0", 25 ], // Giant Goat
				[ "d56e1457-2295-4bfd-b1d6-d84e53d6debc", 26 ], // Giant Hyena
				[ "b1e3ee1f-d616-412d-ab5e-10aad27b2476", 26 ], // Giant Lizard
				[ "0dcde23a-8100-4855-ac07-3388d1b8cc40", 26 ], // Giant Octopus
				[ "0f0d61e7-2a8f-47c6-b1c9-35d7390dd6bb", 26 ], // Giant Owl
				[ "ab030d7f-8e46-4167-bf36-45ff59a95665", 27 ], // Giant Poisonous Snake
				[ "dd4df726-a041-4058-ac44-225aab9be366", 27 ], // Giant Rat
				[ "ff4ee842-7c21-4d0e-b6ff-d72dc13913db", 27 ], // Giant Scorpion
				[ "2fe6b60e-017f-40fa-9746-44e5b9f6bb2d", 27 ], // Giant Sea Horse
				[ "4d78880d-7eae-4494-ac22-e0bf415e32ad", 28 ], // Giant Shark
				[ "ceff6967-7d2c-4b84-9e2a-df1d36a9a98c", 28 ], // Giant Spider
				[ "dfd9f55f-e53c-4abb-b761-144062af6d0d", 28 ], // Giant Toad
				[ "6b6e5aa1-bc01-4af6-b64a-8ac3f468eaf7", 29 ], // Giant Vulture
				[ "ff490947-a963-4c11-8a1c-f238f4f6ad27", 29 ], // Giant Wasp
				[ "a30c0261-68cd-4b59-8bf6-c47bbde26f36", 29 ], // Giant Weasel
				[ "f51ac131-dfc5-4672-a569-ab361ac31447", 29 ], // Giant Wolf Spider
				[ "07256557-e839-43d0-b84b-e91f3e7866fc", 30 ], // Gnoll
				[ "4407c527-3be7-4010-b51d-a777203e49e1", 30 ], // Goat
				[ "9cf6c94e-b019-47e1-a746-ab4d02f684a9", 30 ], // Goblin
				[ "9ab9a61b-5298-44e9-8950-167e4a4e9c98", 30 ], // Grick
				[ "9084361f-6e4a-47ee-9e58-341f346278b2", 31 ], // Griffon
				[ "3279999e-4dd9-4149-8ce5-f0867c108d30", 31 ], // Harpy
				[ "d2ebaf9c-3be0-4c0c-ac98-c65e6d80b741", 31 ], // Hawk
				[ "5545c172-5478-4ac0-8db5-7b2c8e90394c", 32 ], // Hell Hound
				[ "c7296867-6041-418d-b255-b675639cfc2c", 32 ], // Hill Giant
				[ "5d506ff9-4a90-460e-82e4-68bdf0bac7cf", 32 ], // Hippogriff
				[ "127e4789-95e3-48e4-8937-7d85ccb3bea0", 32 ], // Hobgoblin
				[ "3cbfec14-c628-4140-82ce-8cb47cfcdb98", 33 ], // Hunter Shark
				[ "3e632ad7-8ffd-40b7-8a37-45386577bd45", 33 ], // Hydra
				[ "589c5ae5-bbbe-4753-a36a-53bfec6987b7", 33 ], // Hyena
				[ "d8e388da-90a9-48b5-8d84-f969f5b98a73", 33 ], // Jackal
				[ "7ff7ffda-0e4d-4989-9c61-455178874d43", 34 ], // Killer Whale
				[ "baa3449e-bfd5-408d-8b7e-206a3bebf8ca", 34 ], // Kobold
				[ "2feb4531-2954-456c-bdf2-b320b1b8d1a3", 34 ], // Lion
				[ "c9c0dd9a-d2ce-449c-9bd8-46da79cacdc3", 34 ], // Lizard
				[ "5ec95d84-a847-496d-9cca-f4a3c13a81d1", 35 ], // Lizardfolk
				[ "723492cc-2dc4-4c3e-b5a3-96b03dd30320", 35 ], // Mammoth
				[ "70a0cbe2-5320-465d-afdf-7a4643da02fe", 35 ], // Manticore
				[ "216f1424-504a-4c7f-8a0a-478bbf97f1ef", 35 ], // Mastiff
				[ "15a09594-1143-4b08-8f4e-0f5d9891b4d1", 36 ], // Medusa
				[ "620fe04b-ad34-4183-8af7-980b3609c482", 35 ], // Merfolk
				[ "852cfe83-a0d9-4170-86d7-e16b864ea7ef", 35 ], // Minotaur
				[ "40e39910-dd75-41ac-a5b2-217d3d4e81de", 37 ], // Mule
				[ "d86cd0d2-a792-4585-809e-e59919189936", 37 ], // Mummy
				[ "ed0bb2d0-aef6-4a4b-a9cb-4a38045cc29c", 37 ], // Nothic
				[ "0474b4f6-5b72-46ac-9405-5e39b28750c2", 38 ], // Ochre Jelly
				[ "61154806-be2a-432b-953f-cd660073496b", 38 ], // Octopus
				[ "545c030a-1674-4838-9d43-752db8265f87", 38 ], // Ogre
				[ "2fc71e84-7157-4d3f-9042-d9b17236f5f0", 39 ], // Orc
				[ "5b060b59-1142-4d65-9958-212dbce27820", 39 ], // Owl
				[ "293ad61d-ee17-4a20-954a-ab22f6edaa8d", 39 ], // Owlbear
				[ "777fa0ec-7cd3-497e-9a64-d5bf89ac6216", 39 ], // Panther
				[ "9f07db07-b9f9-4913-8603-3aeef1b217f3", 40 ], // Pegasus
				[ "9f50717c-0766-4e2e-b218-7605ccb0d945", 40 ], // Phase Spider
				[ "633bf055-b509-4f7f-b4ca-5c14bbfeb919", 40 ], // Plesiosaurus
				[ "e23e499c-9022-482c-ae28-21790a692aab", 40 ], // Poisonous Snake
				[ "f2a7ac7e-972f-4956-908e-525eec2ae47c", 41 ], // Polar Bear
				[ "18f9d16d-6151-45fc-b449-5ca10e66f49e", 41 ], // Pony
				[ "2bbec9af-7f96-40ed-84c8-9f5c98ae38c3", 41 ], // Pteranodon
				[ "33980992-7042-4c16-8ffb-d784114520d6", 41 ], // Quipper
				[ "b01dae8d-020f-4ee2-a80a-de7cb133de53", 41 ], // Rat
				[ "cda02d73-dca4-45bb-92cb-ad2092a27ea5", 42 ], // Raven
				[ "75d4dfd5-8942-4661-b8a8-3fbcaec7d1ab", 42 ], // Reef Shark
				[ "73254529-1dde-443a-9cbd-940157812fb1", 42 ], // Rhinoceros
				[ "e02034e2-fe58-4c02-bdb6-9a54baf6e86b", 42 ], // Riding Horse
				[ "e8fb3a4e-52e3-4519-bfe4-2710fca7aca2", 43 ], // Saber-Toothed Tiger
				[ "f373bc88-ba01-4e6a-8889-580be0265c59", 43 ], // Satyr
				[ "d30a64ee-ac17-42e5-99ff-2186111615ad", 43 ], // Scorpion
				[ "ec2f7099-286e-4384-990a-526cf70b1c55", 43 ], // Sea Horse
				[ "3e946348-1cc2-405f-9975-5a4c09445750", 43 ], // Skeleton
				[ "aadb1915-c3d4-4349-b9f2-5b7a10ab3f3d", 44 ], // Spectator
				[ "5cf71994-66bd-433e-ae5f-d20071c48d85", 44 ], // Spider
				[ "b02dadd4-aa89-426c-ac9b-bfa07b8fe1fc", 44 ], // Stirge
				[ "235ac710-1418-4bda-b0e5-3ded0ccbe1f9", 45 ], // Stone Golem
				[ "c5cc5a1a-d412-40d3-9537-f22aa625f893", 45 ], // Swarm of Bats
				[ "e3b72f35-5e72-4bfa-b238-f22062184c1c", 45 ], // Swarm of Insects
				[ "c37dd213-9373-41af-9c87-e27513d16ec5", 46 ], // Swarm of Poisonous Snakes
				[ "d74a782b-6b71-4c9c-95d0-f8d61bb97e44", 46 ], // Swarm of Quippers
				[ "31c042ca-f348-4ba5-a749-bb659b296f8f", 46 ], // Swarm of Rats
				[ "adcec956-ebf2-42c3-9e60-4ec3f58c17e2", 46 ], // Swarm of Ravens
				[ "d0a5fb54-32bb-4704-ac1a-862a175d333b", 47 ], // Tiger
				[ "75aa0080-9b95-4693-abfd-dc077ba0073a", 47 ], // Triceratops
				[ "243e91ab-b859-44ce-a9cb-e14a055d1151", 47 ], // Troll
				[ "811f1a20-d074-4520-a8de-1e37bc53a00c", 47 ], // Twig Blight
				[ "49fb470b-4186-49a4-9794-05dfcdc8fe09", 48 ], // Tyrannosaurus Rex
				[ "b2f6a630-d8e2-42f5-8844-5a346f55c272", 48 ], // Vulture
				[ "8d0e875b-95f1-47a5-9d98-72ac4738c860", 48 ], // Warhorse
				[ "ef655c7f-1f59-4b56-8b52-3e96895cb20f", 49 ], // Water Elemental
				[ "3306e2fd-7249-45d6-abcd-1797c8d8ca30", 49 ], // Weasel
				[ "80a17f83-7b94-497e-a10d-3dd1f3a8a889", 49 ], // Werewolf
				[ "76b14a0c-551e-4166-9e0a-e06bdb46623d", 50 ], // Wight
				[ "4da5597e-8f29-4fce-a4e7-d36ba2c5b6a7", 50 ], // Winter Wolf
				[ "9e4c024d-0b8b-40c7-9e4a-2b447450ab4e", 50 ], // Wolf
				[ "1d37bafc-ea8e-40e5-8546-475276cc903f", 51 ], // Worg
				[ "9b9d4516-f2ae-449d-80ba-0ce4e85438cc", 51 ], // Wyvern
				[ "7686c9ce-acc2-4d30-8729-665c947c153d", 51 ], // Yeti
				[ "d935c7ad-b765-4e72-8274-adb16a62aade", 52 ], // Young Green Dragon
				[ "ac42a801-316b-4f28-b552-592d7e751649", 52 ], // Zombie
				[ "f88906c2-146d-4abb-8537-8bf5e1d0ac97", 53 ], // Acolyte
				[ "d9d4ae84-bf86-4b94-9806-1b32f5cc69aa", 53 ], // Bandit
				[ "8f6ae154-74f1-4ae2-b165-54f109fa2733", 53 ], // Berserker
				[ "a5f5b9e0-71af-4788-a471-7135557c8321", 54 ], // Commoner
				[ "51bea60c-7686-4bc7-8964-46c75e6953ff", 54 ], // Cultist
				[ "2dfd127c-8844-4289-ac04-b4fe2f1656e4", 54 ], // Guard
				[ "9094f81d-5fab-43c6-baf5-4a5acbe94b9b", 54 ], // Knight
				[ "dd58be51-e15c-4abb-8cf4-97263526d5d5", 55 ], // Mage
				[ "cc9e3c32-1c13-40a5-9d06-0ded81c4e3cb", 55 ], // Priest
				[ "9d458fc1-a489-49f8-9417-1c6c495d5e98", 55 ], // Thug
			]
		};
	}
})();
(function() {
	"use strict";

	angular.module("app")
		.factory("curseofstrahdSource", CurseSource);

	function CurseSource() {
		return {
			name: "Curse of Strahd",
			shortName: "Strahd",
			initialState: true,
			contents: [
				[ "f0502677-b3bc-45b5-9d2a-7372fddc1e34", 226 ], // Baba Lysaga's Creeping Hut
				[ "e70abfb0-fa9f-4562-b65f-2fc63d4c2f9e", 226 ], // Broom of Animated Attack
				[ "d7bd3f20-e8da-49dd-87f6-22c2ad01927f", 227 ], // Guardian Portrait
				[ "c90192cf-fbf1-4bef-8794-f7d82bee36b5", 227 ], // Strahd's Animated Armor
				[ "75e7baad-6bbc-45c2-bf63-5b9e13b4bebd", 228 ], // Baby Lysaga
				[ "0f608e49-e8f8-4a97-9fbc-5cc989138b2c", 229 ], // Barovian Witch
				[ "148e9550-d99f-4966-9179-00803048b7b9", 230 ], // Tree Blight
				[ "a9a45b1e-1bdd-4e3c-ba90-001df9c3012d", 231 ], // Ezmerelda d'Avenir
				[ "a80002c2-40b7-4dab-976f-bef0cfb514f7", 232 ], // Izek Strazni
				[ "79c90ee5-0e3d-437c-90e0-e79b11dba0c1", 233 ], // Madam Eva
				[ "2ff5978f-9383-4e56-8fe6-27961eedfe77", 234 ], // Mongrelfolk 
				[ "e267fda0-3c81-48e2-b299-34c519fe74e1", 235 ], // Phantom Warrior
				[ "fd46aa89-2747-4146-a6d3-e82acaeca48c", 236 ], // Pidlewick II
				[ "6bf0d8cb-cd69-4e17-85b8-7b8b35b5e5b1", 237 ], // Rahadin
				[ "40906ebd-8164-4827-9b90-0b40a0b653ff", 238 ], // Rictavio
				[ "80ff81db-e64f-48e4-8750-1b8002dec83e", 240 ], // Strahd von Zarovich
				[ "8c5b9532-9129-48bd-a7ba-2778dc429629", 241 ], // Strahd Zombie
				[ "4565f845-09c8-4842-b298-ad3dd4055b53", 241 ], // Vladimir Horngaard
				[ "2f23a622-a37b-4c8e-8e1c-a91b11ca6983", 242 ], // Wereraven
			],
		}
	}
})();
(function() {
	"use strict";

	angular.module("app")
		.factory('placeholderSource', PlaceholderSource);

	function PlaceholderSource() {
		return {
			name: "Placeholders",
			shortName: "PlcHld",
			initialState: false,
			contents: [
				[ "cf33021b-ebd7-4db3-884d-0b48e8211ac3", 0 ], // CR 0
				[ "6107ed19-210b-47a4-a05d-3bf2489e6f4c", 0 ], // CR 1/8
				[ "ac37c9c6-a51b-4b7d-9c53-01a59a46965c", 0 ], // CR 1/4
				[ "614d0471-4a6c-4c62-be0e-7056eda3373e", 0 ], // CR 1/2
				[ "f42b1530-a466-45a4-95d7-e2ed05ed6a22", 0 ], // CR 1
				[ "687c8372-49bc-4fb1-923f-6de3018e5286", 0 ], // CR 2
				[ "129475b2-6192-4d3b-9df9-36f97549c04c", 0 ], // CR 3
				[ "06862566-630e-430d-a02d-842c743667de", 0 ], // CR 4
				[ "b3a8e10a-c632-4c1f-9c41-24d817b83eb0", 0 ], // CR 5
				[ "f8fa57c7-66d1-4992-9751-5750642c4528", 0 ], // CR 6
				[ "490d87ca-5730-4c55-8859-fe553aae2e04", 0 ], // CR 7
				[ "b952f971-e50f-4473-9e07-51e82c0ff288", 0 ], // CR 8
				[ "57f8b076-5b4f-4194-bae9-4fd195497d15", 0 ], // CR 9
				[ "80fbaf92-86c9-4ef5-8bee-df96a6b581b4", 0 ], // CR 10
				[ "5c6bf8cc-b83b-48d9-a719-100ae45cac57", 0 ], // CR 11
				[ "b43d7d4c-c573-4600-96ed-8d739dc8202a", 0 ], // CR 12
				[ "a24ebe53-0810-4874-99c7-fdfc2474cc3b", 0 ], // CR 13
				[ "3fc880d1-3810-4139-8c7c-62656e1787f2", 0 ], // CR 14
				[ "fa14831b-5804-48bf-944a-9373b69a9b4a", 0 ], // CR 15
				[ "25d596ed-710c-41ca-98ce-2489f08131ee", 0 ], // CR 16
				[ "73d7d8e0-d03b-461e-9882-8963bf1235c8", 0 ], // CR 17
				[ "3152a039-f64e-4794-bc88-51309dcbf52c", 0 ], // CR 18
				[ "024ca4e4-8bf1-49e7-a162-0bba83be1b2a", 0 ], // CR 19
				[ "660565b6-44cf-486e-9d70-52420a9a0ffe", 0 ], // CR 20
				[ "6e20c795-903a-4374-a8fd-69b92f71ae1d", 0 ], // CR 21
				[ "f5fccb83-9337-47b8-b12e-f9417e0e0b50", 0 ], // CR 22
				[ "2f56a2f1-068e-4467-83e5-559c7f57fd72", 0 ], // CR 23
				[ "566bea90-3430-4c6c-99c9-f17b37abf6c9", 0 ], // CR 24
				[ "56fc82df-ba8f-4c45-b64f-837e0370a341", 0 ], // CR 25
				[ "c2075aca-1de3-497b-94e4-cdb87393b1da", 0 ], // CR 26
				[ "c329588c-dd97-4edc-af8a-a65ed101a959", 0 ], // CR 27
				[ "6da69e50-4a20-4730-b84d-bdc5346a32df", 0 ], // CR 28
				[ "e2589f3b-62dd-4c38-906b-6b262058188a", 0 ], // CR 29
				[ "28e78bc1-ba2a-4e9d-8dc8-dfe6c7e4cbea", 0 ], // CR 30
			],
		}
	}
})();
(function () {
	"use strict";

	angular.module("app")
		.factory('fiftheditionfoesSource', Source);

	function Source() {
		return {
			name: "Fifth Edition Foes",
			shortName: "5eF",
			initialState: true,
			contents: [
				[ "8858bfe7-3e4f-4614-9f37-4411493b22cf", 5 ], // Aaztar-Ghola
				[ "e481ef5e-679d-4afe-b21e-7b31b6a1b6a6", 6 ], // Adherer
				[ "34aa1e77-a133-4bfa-a01d-b364fa9cd3b3", 7 ], // Aerial Servant
				[ "eeec8e91-0b42-4231-a782-a9ac8d1baa31", 8 ], // Algoid
				[ "37f04c1c-c541-46ae-8711-9a124d481108", 9 ], // Amphoron of Yothri: Worker
				[ "5c66baa2-20cb-4d18-9c71-b43add3b467f", 10 ], // Amphoron of Yothri: Warrior
				[ "f6eb324c-4236-440f-9708-7e6457bbd5b8", 10 ], // Amphoron of Yothri: Juggernaut
				[ "fb39c66d-2d1b-465c-b790-250b7236a06b", 11 ], // Ant Lion
				[ "cf00a20a-5160-41a3-9c33-53cdf9fbc7aa", 12 ], // Ape, Flying
				[ "9c48d00c-7ef1-4779-b733-b64becac876c", 13 ], // Arenea
				[ "0c83f120-fc3b-416d-a660-3eec3a09cbc9", 14 ], // Arcanoplasm
				[ "fc957e94-6739-4aa8-a58e-946e96c924d6", 15 ], // Artificer of Yothri
				[ "24f44c14-a6b4-48e0-a985-52bcd71c867b", 16 ], // Ascomoid
				[ "3889f8b7-6727-4edd-9694-27dfd206b541", 17 ], // Assassine Bug
				[ "547e770c-ae8c-48fe-84b4-5e4dd901fdde", 18 ], // Astral Moth
				[ "98a090a3-c223-4d46-944a-0c03fb1d7fa9", 19 ], // Astral Shark
				[ "aa4af6ea-b5d7-454f-b149-7eb71ecea5f8", 20 ], // Aurumvorax (Golden Gorger)
				
				[ "c4ee0612-11fc-4327-a641-2fc5cd6f5ee6", 21 ], // Basilisk, Crimson
				[ "c096015a-9bff-483e-b0c7-b67a948c59b1", 22 ], // Basilisk, Greater
				[ "5f0cee9e-673f-419e-b4c6-bd45efe7fddd", 23 ], // Bat, Doombat
				[ "b5a7f95d-023a-48ac-b87d-aee218afd4ce", 24 ], // Beetle, Giant Rhinoceros
				[ "dc62f7b1-fc36-4e85-afa3-4cf25d0cabeb", 24 ], // Beetle, Giant Slicer
				[ "a97cd7b9-152c-48f2-8908-5f08da9a5027", 25 ], // Beetle, Giant Water
				[ "c3a84c7f-8036-4b60-81af-8be8a4b721f4", 26 ], // Biclops
				[ "3460ab4e-0c73-46da-8264-c3cd738098ca", 27 ], // Blood Hawk
				[ "33f8a198-101e-42c8-9dc0-a30e427aec76", 28 ], // Blood Orchid
				[ "2c76f25c-fea5-41aa-95cd-9b3cff17aa5a", 28 ], // Blood Orchid Savant
				[ "61486dcd-aea5-47a3-93b9-699578f57a2f", 29 ], // Blood Orchid Grand Savant
				[ "b909141f-f103-4c1b-a2f0-8c201a9d297f", 30 ], // Bloodsuckle
				[ "7b554986-d466-4559-9165-7ae87e45f207", 31 ], // Bloody Bones
				[ "d8e494ed-78cb-411d-981b-6879c0654447", 32 ], // Boalisk
				[ "8be204a1-450f-426f-a443-4a34d053088b", 33 ], // Bone Cobbler
				[ "8fe9fbdc-e6bf-4c7f-b64b-3b537589a5df", 34 ], // Greater Boneneedle
				[ "14c8179e-6309-4d15-8c4a-8950209fbaff", 34 ], // Lesser Boneneedle
				[ "06ed1123-cff6-4c57-8a3f-3021759e1030", 35 ], // Bonesucker
				[ "ef3f7368-89b7-4ca1-aed4-cbdb44766fc0", 36 ], // Borsin (Ape Centaur)
				[ "1b899f2f-eda5-4196-9f9f-f6a5352d2850", 37 ], // Brass Man
				[ "30608f1b-aa83-43f8-b26a-ae1bedda7d52", 38 ], // Brume
				[ "652e7842-051a-40ac-988d-a5a382142c96", 39 ], // Burning Dervish
				
				[ "e290d910-5ec3-42bb-90b6-6e27e4b1cb28", 40 ], // Cadaver 
				[ "e56ff88a-f223-4d90-b555-dc847b9cdafa", 41 ], // Cadaver Lord 
				[ "eaeb0ca9-3904-4c36-b2c6-e4e178ded00a", 42 ], // Carbuncle 
				[ "ec0b8eb1-51f1-4dc3-ad1f-eec948e90724", 43 ], // Caryatid Column 
				[ "877eeff7-a54d-4beb-b94d-490a917a3c98", 44 ], // Cat, Feral Undead 
				[ "082fc525-a4e5-41aa-8ccb-d1ec6d80a9ab", 45 ], // Caterprism 
				[ "c1b7bebb-222f-4e83-a7b9-885fb8b958d1", 46 ], // Catfish, Giant Electric 
				[ "f6c69373-bbab-47e9-a255-dc660cb96843", 47 ], // Catoblepas 
				[ "06f1b52b-0cfb-48a2-83f5-b548523cf24f", 48 ], // Cave Cricket 
				[ "6becceec-276c-42b0-8fa8-1c2ff87d84a9", 49 ], // Cave Eel 
				[ "431a88c4-19f8-4a5e-8861-1102ab2766cc", 50 ], // Cave Fisher 
				[ "27c84aed-9b9e-496a-9b2f-e8d36925b464", 51 ], // Cave Leech 
				[ "b25b5ed8-7ad5-48e6-bc4b-ea14fb6e5e22", 52 ], // Centipede Nest 
				[ "21294951-6251-4e74-b166-30726b85c3d4", 53 ], // Cerebral Stalker 
				[ "6cb45236-ed84-468d-bb44-fc6b4ee27ef9", 54 ], // Chain Worm 
				[ "388f5263-8df5-4b78-9469-dc82f25ea0d5", 55 ], // Chaos Knight 
				[ "b0c06424-9fc5-4c34-82ac-a1f3c2507b96", 56 ], // Chupacabra 
				[ "6874540a-1b44-4082-9e01-8abae4f99109", 57 ], // Church Grim 
				[ "3e1e5b6f-12c9-4b4c-8043-7b9283be7212", 58 ], // Churr 
				[ "1ba27eaa-c952-40c8-92f9-3073e1d9fc51", 59 ], // Cimota 
				[ "5013a4e9-6072-49e3-a287-25cb0d43cf58", 59 ], // Cimota Guardian 
				[ "bdbbcb95-28fb-42af-a0e8-8becba855486", 60 ], // Cimota, High 
				[ "9ab9a2e0-347f-4645-9ac5-920e4109e442", 61 ], // Clam, Giant 
				[ "61f8ab2e-a308-41d4-b063-3064babc0b7c", 62 ], // Clamor 
				[ "a0d04c1f-e306-46dc-a483-049cdbef3bf1", 63 ], // Cobra Flower 
				[ "e0b158b9-6847-4e07-92e8-149baadd0f06", 64 ], // Coffer Corpse 
				[ "5d2e03d9-7593-4d9f-9dee-c2eb8637d9fb", 65 ], // Cooshee 
				[ "c73a2904-8c96-443a-96db-45c2d9c8308e", 66 ], // Corpse Rook 
				[ "1e4d6002-0f2d-499a-9a7c-c07dc1369904", 67 ], // Corpsespinner 
				[ "15aca2d5-5da4-4a41-b4e3-eb926d6a3bcd", 68 ], // Corpsespun 
				[ "f627523a-7a8d-4914-9709-a827f15e2ab1", 69 ], // Crabman 
				[ "a5a46e43-0367-4dd0-80e7-727a06f49c1e", 70 ], // Crayfish, Monstrous 
				[ "2e242225-28d7-4656-9199-445bdbec57fe", 71 ], // Crimson Mist 
				[ "37a66de3-f1d3-4927-9761-bcc3ee9ccaed", 72 ], // Crypt Thing 

				[ "9fca5d72-502a-42e9-9712-d27ee1af479c", 73 ], // Dagon 
				[ "bb2f95fd-8125-40b5-bc22-c671f0dc4dc1", 74 ], // Dark Folk: Dark Creeper 
				[ "a58f7528-0727-46a9-b382-52e3061f1a25", 74 ], // Dark Folk: Dark Stalker 
				[ "5af1c32d-ba8d-4b68-8258-ad58f9c586a2", 76 ], // Darnoc 
				[ "c8951c4f-344e-43b2-b347-7bfeb1342d95", 77 ], // Death Dog 
				[ "d8340df1-64e8-4504-b4f3-fbb37815557b", 78 ], // Death Worm 
				[ "748a1b33-972e-4d6b-bf93-66d4f17462a2", 79 ], // Decapus 
				[ "5dfef99c-ec51-4503-81e9-72408322a686", 80 ], // Demon, Teratashia 
				[ "409b267d-1c8e-4d83-9073-754676435a06", 81 ], // Demon, Thalasskoptis 
				[ "cf9a0fa9-e840-471f-8f20-218fe1d10d64", 82 ], // Demonic Knight 
				[ "5df7b005-92a7-49b6-b994-8139341a1fa2", 83 ], // Denizen of Leng 
				[ "aedfee30-ec76-4cfc-adc5-71f9ac1151f8", 84 ], // Dire Corby 
				[ "14ce29a0-f233-4ce5-bcc5-28497daad2b7", 85 ], // Dracolisk   		  
				[ "8a9ee592-179e-4d88-9110-48a3f25aea2d", 86 ], // Drake, Fire   		  
				[ "fb3cb5da-279c-437e-8c5a-3d2dfe93f6e0", 87 ], // Drake, Ice   		  
				[ "9edb5935-e824-48ef-9e61-1c2f5894f975", 88 ], // Dust Digger   		  
				
				[ "2e2b546e-0154-4fca-b142-14a7e9ec68f9", 89 ], // Eblis   		  
				[ "96236a8d-483c-46ed-9af7-1a0033434c1d", 90 ], // Ectoplasm  		  
				[ "f0d94abd-9d0d-49f9-b1a1-fad5818d8ac5", 91 ], // Eel, Giant Moray   			  
				[ "a416b6de-fc27-40ab-b4be-25d74a333002", 92 ], // Eel, Gulper  		  
				[ "cfc78e02-ba1d-40a5-b6c8-4aff2f0f985b", 93 ], // Elusa Hound   			  
				[ "8aa24fcf-01dd-4c1f-986a-35f3a27b40a5", 94 ], // Encephalon Gorger  			  
				[ "68c63f04-8e50-45ef-b0be-7c66313d7aad", 95 ], // Exoskeleton, Giant Ant   			  
				[ "150f864a-a381-4cdc-b983-47cd0cd2f6c8", 96 ], // Exoskeleton, Giant Beetle  			  
				[ "f2a457ae-756c-45e8-a159-a2e15eff43e0", 97 ], // Exoskeleton, Giant Crab   			  

				[ "44253d68-8f2c-4751-991f-abc921df8a9c", 98 ], // Fear Guard   		  
				[ "195d4017-bd24-4b10-9e1a-3a8b05e38977", 99 ], // Fen Witch  			  
				[ "56e56efe-e085-41a7-8b68-16a6214a5fbe", 100 ], // Fetch    					 
				[ "b47d2bf0-b548-4cd5-982b-c58ab7ef30dc", 101 ], // Fire Crab, Greater    	 
				[ "cd5f37bc-f0cb-41de-bff4-00ce7b0ec6b2", 101 ], // Fire Crab, Lesser    		 
				[ "925b7880-251a-4e01-8829-6231ed13ac1d", 102 ], // Fire Snake, Poisonous   	 
				[ "50e8cce3-f0b6-4b53-8be5-4c9b3e99b2be", 103 ], // Flail Snail    			 
				[ "3d630efa-9f83-43e4-9f02-9d10c9d7b7ce", 104 ], // Flowershroud   			 
				[ "9fde7d89-902a-418c-96b9-fde58e5c088e", 105 ], // Foo Dog   				 
				[ "4dffa61d-9d30-4710-9039-8f23ff84f11c", 106 ], // Forester’s Bane   		 
				[ "7d5c64eb-eefe-4152-be3c-c0f065d27c11", 107 ], // Froghemoth   				 
				[ "61018b7f-fc0b-4204-ac4e-18d39d520b50", 108 ], // Fungoid   				 
				[ "0ab016e4-ac4e-4dff-ad91-cd731999ff6c", 109 ], // Fungus Bat   				 
				[ "2ed648cd-e401-4aa1-ad00-19cf596aa0c2", 110 ], // Fyr    					 

				[ "6b3ba99c-30b6-4b19-8fea-b2ddc1397afc", 111 ], // Gallows Tree   			 
				[ "9680e243-fecb-4e71-b7fb-ebfc695cff84", 112 ], // Gallows Tree Zombie   	 
				[ "f305e58f-b209-4df7-a969-da60985f8952", 113 ], // Gargoyle, Four-Armed   	 
				[ "a43a7260-f1ea-4c5d-98ca-929db9a1bd4a", 114 ], // Gargoyle, Fungus    		 
				[ "f5d27c86-df25-4f77-b7e4-fc018f151186", 115 ], // Gargoyle, Green Guardian   
				[ "3be8ea59-4982-4a6d-af3f-d3b6f48a5f5c", 116 ], // Gargoyle: Margoyle    	 
				[ "bfa26d58-e035-402c-bddb-eeba284a9a97", 117 ], // Genie: Hawanar    		 
				[ "813dfa0d-6747-4c30-b98d-a7872a959d79", 118 ], // Ghost-Ammonite    		 
				[ "fba44dbb-a3b3-44d7-81ce-bae7fd75e562", 119 ], // Giant Slug of P'nakh    	 
				[ "7bdb5b8a-1f90-4e33-8b89-c0095ed0d7b8", 120 ], // Giant, Jack-in-Irons   	 
				[ "8f957588-da24-404d-915f-6f2e76399d82", 121 ], // Gillmonkey    			 
				[ "10f215bf-29aa-4426-96d1-c6e6baaabf96", 122 ], // Gloom Crawler    			 
				[ "63798c35-6c96-4e6f-be8c-d98e2e97b1cb", 123 ], // Gnarlwood    				 
				[ "1f20da7f-5464-4386-87dc-dc34e0928220", 124 ], // Gohl   					 
				[ "df1c7b07-15b6-4274-9d4f-dcad32e176cc", 125 ], // Golden Cat    			 
				[ "da5d467a-61f9-4863-89dc-7b2cb828f12f", 126 ], // Golem, Flagstone    		 
				[ "56d812d0-1e6c-4215-8add-69997bda3581", 127 ], // Golem, Furnace    		 
				[ "e72c259e-e85f-4b37-a79f-4ba6c0dca135", 128 ], // Golem, Stone Guardian   	 
				[ "aefb5349-effc-4072-9d41-9107040c81de", 129 ], // Golem, Wooden   			 
				[ "f44e122d-f1fd-473c-8233-9282c8c95fe0", 130 ], // Gorbel    				 
				[ "32e8f240-7de2-4261-8c37-0e2edaf48e85", 131 ], // Gorgimera   				 
				[ "ffaf52f8-a1cc-4a5e-bd4d-5c10bdd48836", 132 ], // Gorilla Bear    			 
				[ "8d92db78-2370-4cc5-9c12-a47e645f4825", 133 ], // Gray Nisp   				 
				[ "7cb9a7e8-516b-4772-a429-148b4a6431f2", 134 ], // Green Brain    			 
				[ "3e235c32-1cd0-4cc4-892e-a4a51d47d07c", 135 ], // Grimm   					 
				[ "905d0a84-71ea-43ab-9e41-190373db01d6", 136 ], // Grippli    				 
				[ "4398adcd-87f3-4bd7-98ca-854f2a66bb77", 137 ], // Grue (Type 1)    			 
				[ "2953d90d-2079-49be-89de-5e1e4977e924", 138 ], // Grue (Type 2)   

				[ "169a5633-9680-4bc0-b172-e2775a45c514", 139 ], // Hanged Man    			 
				[ "964941f9-1859-467d-b12c-e1afdb967cd0", 140 ], // Hangman Tree  			 
				[ "5c1cc602-9168-43d9-8c57-a41debe78732", 141 ], // Hawktoad    				 
				[ "a2b10350-c778-42ee-90d9-06c8eabd79a2", 142 ], // Helix Moth   	
				[ "e33c82a2-9f11-49d8-b283-1d1188659bda", 142 ], // Helix Moth Larva
				[ "963a4b94-940f-4d43-9d63-c0720ebf41a6", 143 ], // Hieroglyphicroc    		 
				[ "b0ed20be-5d74-4892-9e46-7503cc10263e", 144 ], // Hippocampus   			 
				[ "cdda62de-1fc4-40af-87e0-b558b926ddac", 145 ], // Hoar Fox    				 
				[ "d5d4329c-ab10-4a4f-8040-6a1a035c80da", 146 ], // Horsefly, Giant   		 
				[ "7ba610ba-b5a0-4d4b-83b5-2226acb81eb3", 147 ], // Huggermugger   			 
				
				[ "4755c9ff-33ef-4795-a023-268fe0d330ed", 148 ], // Igniguana    				   
				
				[ "04cd2290-02d0-444d-aafc-5a944281fc07", 149 ], // Jackal of Darkness   		 
				[ "619a44e4-6157-4c91-ab34-b9074f031b80", 150 ], // Jaculi   					 
				[ "14a40422-3e78-4d99-8772-bec7b387e6eb", 151 ], // Jelly, Mustard   			 
				[ "804dae66-0996-47ae-b2e0-497a87ff71ae", 152 ], // Jupiter Bloodsucker   	 
				
				[ "cf8c3aeb-fed2-480c-845f-1cd0800419de", 153 ], // Kamadan  					
				[ "418f42d0-b7d2-4425-8072-5612c0a54c35", 154 ], // Kampfult    				 
				[ "697094e6-3d30-402f-b0ab-e997c12a3293", 155 ], // Kech    					 
				[ "5df53170-860c-4cf6-9b89-eabc7f2d8890", 156 ], // Kelpie    				 
				[ "cb027442-bf51-4e3d-989e-dfb87ebb1b9c", 157 ], // Khargra    				 
				[ "5b0d734a-48a4-4f75-b62e-6be805f15cf1", 158 ], // Korred    				 
				[ "33310580-40d5-410b-b280-805940c79166", 159 ], // Kurok-spirit   
				
				[ "75b436c0-5118-4a60-916d-b31a8d025813", 160 ], // Land Lamprey   			 
				[ "4e09d563-e9cc-4bab-a88c-2e32cb135c2e", 161 ], // Lava Child    			 
				[ "4b3a36c1-7513-44ae-b422-00770ef80b6b", 162 ], // Leng Spider    			 
				[ "fe3a553f-eff8-4b22-be3a-c218f0322a6b", 163 ], // Leopard, Snow   			 
				[ "29aa7820-a973-45ea-9d2c-221d98519c0b", 164 ], // Leucrotta, Adult   		 
				[ "83570a96-43c8-4ebd-b3fc-e1caaf516983", 164 ], // Leucrotta, Young   		
				[ "103b318f-5844-4c28-88bc-0a88801599f6", 165 ], // Lithonnite    			 
				
				[ "f57e8c30-656d-46af-9d1b-fec7eaf7f193", 166 ], // Magmoid    				 
				[ "25457afb-09cf-4b91-a4db-968bd4ec250d", 167 ], // Mandragora    			 
				[ "efd769f7-8915-4106-b3e6-6b82aae844fc", 168 ], // Mandrill    				 
				[ "c4382159-8969-4f0b-9c4f-ff00a99f776e", 169 ], // Mantari   				 
				[ "f172980e-5b6c-4a14-826c-59cdbc9ad957", 170 ], // Midnight Peddler   		 
				[ "2bd24040-6384-4388-93f5-66846a471917", 171 ], // Mite    					 
				[ "61b6158a-05b7-4cc9-9b70-507a3ec22ef6", 172 ], // Mite, Pestie    			 
				[ "54c76671-883c-46f8-a3e4-6c742732d652", 173 ], // Mummy of the Deep    		 
				[ "24c71a8d-54d4-4e52-9e9a-67d8cc268a49", 174 ], // Murder Crow   			 
				
				[ "f5088d29-9ad8-40e0-bf14-85873c2a04c2", 175 ], // Naga: Hanu-naga    		 
				
				[ "a98dda59-e604-4397-a8bf-c3ebea465fe6", 176 ], // Olive Slime    			 
				[ "c26c85a8-4d1f-4a71-8182-81590b7fc0ad", 177 ], // Olive Slime Zombie    	 
				[ "6cd7a61a-7734-49fb-94b3-8a4b7083e00b", 178 ], // Ooze, Glacial    			 
				[ "c3e2ed63-41cf-4ccf-9977-31e1f97e934e", 179 ], // Ooze, Magma   			 
				[ "cfc83102-72b9-414d-a7eb-a01ee760fa51", 180 ], // Origami Warrior   		 
				
				[ "e63a187e-1d25-46ff-acfd-ca869a6f664b", 181 ], // Pech    					 
				[ "72d8df79-bede-4f5e-8584-e4425ed25b4a", 182 ], // Phycomid    				 
				[ "842934bf-43fd-4a27-9178-0d29fe2791bb", 183 ], // Pleistocene Animal, Brontotherium   	 
				[ "74ca7858-7ba7-4e4e-8c5d-9b50f13dad65", 184 ], // Pleistocene Animal, Hyaenodon    		 
				[ "2363ae59-7bb2-4714-adfe-dc61c37f80bc", 185 ], // Pleistocene Animal, Mastodon    		 
				[ "cb104764-015e-4a72-a3be-749cc07fbd63", 186 ], // Pleistocene Animal, Woolly Rhinoceros  
				[ "3a8536aa-c0df-4408-971c-cfaa17754cb8", 187 ], // Pudding, Blood    					 
				[ "613b4121-7fe3-4b23-be80-d0fcff54620f", 188 ], // Pyrolisk    							 
				
				[ "2f98de88-8424-4e9b-a658-95b0ee302a29", 189 ], // Quadricorn    			 
				[ "47aa6784-4245-440f-9f51-b90e061bfc60", 190 ], // Quickwood  
				
				[ "a791b84a-57f7-4625-96ae-eed2d7451197", 191 ], // Rat, Shadow    			 
				[ "52096bf8-1a8d-4cb3-88f7-91302e60b9cd", 192 ], // Red Jester   				 
				[ "084ba8ff-ab3b-4f76-aa3f-b577978f0e4d", 193 ], // Ronus    					 
				[ "ff870084-5a52-4c18-afcd-4f63ffb41cb5", 194 ], // Russet Mold   			 
				[ "2496c9fa-a7d8-4b97-a20e-42c76c585660", 195 ], // Ryven    					 
				
				[ "36e4e3ee-af3e-4093-b83c-7e1546628a9c", 196 ], // Sandling   				 
				[ "2a7f3c35-4fa9-465d-809a-fefbd79356b9", 197 ], // Screaming Devilkin   		 
				[ "8e2ff0f9-f028-4820-a066-79b048f089fa", 198 ], // Scythe Tree    			 
				[ "d64b71c7-026e-41c2-868a-9b18efd58eae", 199 ], // Sea Serpent, Brine   		 
				[ "03355493-0eed-4b7f-a761-d3a092d52ec2", 200 ], // Sea Serpent, Deep Hunter   
				[ "9c7cddd1-1159-4d22-8cb1-db8d7722fe42", 201 ], // Sea Serpent, Fanged   	 
				[ "bda1c849-b316-46c9-b02f-74e1f023abd6", 202 ], // Sea Serpent, Shipbreaker   
				[ "415f28df-d304-4914-9c8e-06e6d12c1d57", 204 ], // Sea Serpent, Spitting    	 
				[ "2dcf8e8b-f858-4acb-9a13-8f898ed872a9", 205 ], // Seahorse, Giant   		 
				[ "6db77354-d6ab-416b-b23b-90b142ef7c11", 206 ], // Sepulchral Guardian    	 
				[ "2cef4f87-c829-4108-8b88-95e935af7297", 207 ], // Shadow Mastiff    		 
				[ "cfbcd4c4-a626-4274-9e9f-46359a39be3b", 208 ], // Shadow, Lesser   			 
				[ "b13be6df-2259-4bbf-9fbb-8712f11f6132", 209 ], // Shroom    				 
				[ "94e4df5d-bba5-4810-99b7-bfd8a15e67c6", 210 ], // Skeleton Warrior   		 
				[ "8bf9526f-0d32-44d2-8d15-92ac6076cbf9", 212 ], // Skeleton, Stygian    		 
				[ "f5ec9872-59ff-4455-bd4d-e01a81a39851", 213 ], // Skelzi    				 
				[ "16bc059c-afd0-4eae-b07c-9ff786f323e1", 214 ], // Skulk   					 
				[ "fa7c0cd2-fce9-47e4-82c2-f217930e9940", 215 ], // Slithering Tracker    	 
				[ "3e120c8e-9d56-4ffd-a791-ec4e5a610e5b", 216 ], // Soul Reaper    			 
				[ "f63952f3-3c3a-448e-afbf-ed6f7c9a9ee7", 217 ], // Stegocentipede    		 
				[ "c06f6a75-6ea2-4466-b4ae-ec73b038f97c", 218 ], // Strangle Weed    			 
				
				[ "83c265a3-3cd4-4f0e-bcdd-38582bc0e1e4", 219 ], // Tabaxi   					 
				[ "ea2fba96-a553-40db-a5ef-66912d3f1d46", 220 ], // Taer   					 
				[ "e70c5539-e92b-43fb-b9b8-a1eafbe50c0a", 221 ], // Tangtal   				 
				[ "1c892be7-9839-4224-8989-8077f52f9e6e", 222 ], // Tazelwurm   				 
				[ "5722d06a-5388-4438-bbc3-7644ce74ed1e", 223 ], // Temporal Crawler    		 
				[ "b00b8450-8ea4-4fd7-98e9-5a9325ef542f", 224 ], // Tendriculos   			 
				[ "d48b2e9f-df78-43ed-be7c-329cf4a67471", 225 ], // Tentacled Horror   		 
				[ "25ae7268-2b42-487e-8bd5-3ff47eb97855", 227 ], // Therianthrope: Foxwere   	 
				[ "5aece682-36f6-4760-bd9d-862cdbf315b4", 228 ], // Therianthrope: Lionwere    
				[ "982f4e9e-01b6-4361-81e9-63f8448f8e8e", 229 ], // Therianthrope: Owlwere   	 
				[ "42db7f08-1537-484e-a7c4-eeabb41c31cf", 230 ], // Therianthrope: Wolfwere    
				[ "ba9171aa-dce5-471f-98a5-002524efea1d", 231 ], // Treant, Lightning    		 
				[ "4ba6fe62-4d05-4c9c-a79d-4dbc8ff944e3", 232 ], // Tri-flower Frond    		 
				[ "e50756f9-5450-40b8-a2b0-0e9d12cdfa46", 233 ], // Triton, Dark   			 
				[ "2e36753d-6831-4782-bde2-ea3d3ba7bd82", 234 ], // Troll, Spectral    		 
				[ "abefd210-c81e-4b0a-b783-99033d183706", 235 ], // Troll, Two-headed    		 
				[ "f894b14f-db34-4fe7-b56d-faaf3af5ae9c", 236 ], // Tunnel Prawn    			 
				[ "61e73927-3a92-46ed-b036-26ef21f783d5", 237 ], // Tunnel Worm    			 
				
				[ "7f18f6e9-7582-410a-9fac-dad94e33c49d", 238 ], // Vampire Rose    			 
				[ "9dc6591a-0abc-41c7-8577-d432e698d734", 239 ], // Vegepygmy Commoner, Worker 
				[ "3ee667b4-dd1e-4c3b-a9b1-cbb7a67324e2", 239 ], // Vegepygmy Guard    		 
				[ "689d781c-3335-41d0-ac69-ca66d43b5f72", 239 ], // Vegepygmy Chief    		 
				[ "bee30fb9-d847-4a3c-bd00-02cc0da21369", 241 ], // Volt   					 
				[ "26aa0a9b-3c08-40cf-b262-025b902fac25", 242 ], // Vorin   					 
				[ "3a072df0-6203-467f-b638-074af40639d3", 243 ], // Vulchling    				 
				
				[ "b4813d30-f494-455b-8f4b-c75ff3bdc854", 244 ], // Lava Weird    			 
				[ "d3b85b60-4b6b-4ee3-93b1-9baf49440aec", 245 ], // Were-mist   				 
				[ "bbeb8c00-df9b-477c-a485-bfb0cc6ec4e6", 246 ], // Weredactyl   				 
				[ "7785b231-b5b2-4269-8aa3-f400c01632f6", 247 ], // Widow Creeper   			 
				[ "8a5d973c-9698-4aed-a99b-f31dad99bae5", 248 ], // Witch Grass   			 
				[ "e002e4cd-51ea-4aab-b69b-15826cad2ccd", 249 ], // Witherstench    		
				
				[ "eb7f35d4-9cfc-4334-9c35-61d723fc658c", 250 ], // Yellow Musk Creeper   	  
				[ "1e77dc01-0354-45db-9915-4bebdb87d17b", 251 ], // Yellow Musk Zombie    	  
				
				[ "2591660e-aa93-45f2-9321-936928f894bd", 252 ], // Zombie Raven   			  
			],
		}
	}
})();

(function() {
	"use strict";

	angular.module('app')
		.factory('hotdqSource', Source);

	function Source() {
		return {
			name: "Hoard of the Dragon Queen",
			shortName: "Hoard",
			initialState: true,
			contents: [
				[ "f495d63f-f936-4985-a2d3-6a8ec2a20fb0", 88 ], // Ambush Drake
				[ "9e85c13d-ef1d-4baf-a01e-d8f59d8936ef", 88 ], // Azbara Jos
				[ "cd3d6e12-28d4-4f1b-a0f2-97a932f932e3", 89 ], // Blagothkus
				[ "a3ac6397-dfed-4461-9f0b-d63a29ea429d", 89 ], // Captain Othelstan
				[ "ddb767bf-4484-4d5e-b54d-b03a6f9c6795", 89 ], // Dragonclaw
				[ "3bb548b6-e049-4355-84cb-47bc1d94620a", 89 ], // Dragonwing
				[ "c48931c8-30ce-4dca-bd44-367e0dac5296", 90 ], // Dralmorrer Borngray
				[ "70e1d732-ce01-4f48-b88b-1a45e1cd77df", 90 ], // Frulam Mondath
				[ "8f11d800-1103-492b-ae24-320ef1013644", 91 ], // Guard Drake
				[ "a76fc0b1-2c1f-4847-aa54-fa889c212c3f", 91 ], // Jamna Gleamsilver
				[ "708b2570-c88f-4e4f-a414-a98088faa52c", 91 ], // Langdedrosa Cynwrath
				[ "5210357f-f874-4807-bbf6-c203d6431ab4", 91 ], // Pharblex Spattergoo
				[ "8db8b7f3-375c-4e14-abd5-f26e6622f330", 92 ], // Rath Modar
				[ "84df86ca-cc90-4080-a65c-f99314bb351d", 93 ], // Rezmir
				[ "bf42ec5e-94ff-4595-a36e-e7a5dba0d822", 93 ], // Talis the White
			],
		}
	}
})();
(function() {
	"use strict";

	angular.module('app')
		.factory('hotdqsupSource', Source);

	function Source() {
		return {
			name: "HotDQ supplement",
			shortName: "HoardSup",
			initialState: false,
			contents: [
				[ "f88906c2-146d-4abb-8537-8bf5e1d0ac97", 4 ], // Acolyte
				[ "0a70230e-18d8-49e3-898a-49e740acb4a2", 4 ], // Adult Blue Dragon
				[ "4218c74b-27c2-45be-abde-e23ad4223061", 5 ], // Adult White Dragon
				[ "071f1203-f6e6-4fcf-928c-b9cdeb256b2b", 5 ], // Air Elemental
				[ "f42ac24e-7196-4ba4-ae4a-3e34a744d3de", 6 ], // Assassin
				[ "d9d4ae84-bf86-4b94-9806-1b32f5cc69aa", 6 ], // Bandit
				[ "8f6ae154-74f1-4ae2-b165-54f109fa2733", 6 ], // Berserker
				[ "c8328817-b3e9-4c24-984b-f278678bc3a4", 7 ], // Bullywug
				[ "a5f5b9e0-71af-4788-a471-7135557c8321", 7 ], // Commoner
				[ "604dfa7a-4b77-4633-a3ce-83e2c073e0d4", 7 ], // Crocodile
				[ "51bea60c-7686-4bc7-8964-46c75e6953ff", 7 ], // Cultist
				[ "ba54ab80-5007-4695-9f82-003a88cfdeeb", 7 ], // Deer
				[ "738ff802-57e5-4f73-89cb-5def2b527fc0", 8 ], // Doppelganger
				[ "eb4b6767-1035-48a2-8a66-b9e2572e2322", 8 ], // Elk
				[ "1ae109e6-763a-46cd-b643-396c0e83da84", 9 ], // Ettercap
				[ "625ff3cf-c836-498f-bb9b-de25adb1c26d", 9 ], // Gargoyle
				[ "98ec83af-5011-4e90-b17e-7885df911032", 9 ], // Giant Centipede
				[ "7a608516-9ef3-4bf3-85c6-45837c61a77e", 10 ], // Giant Frog
				[ "b1e3ee1f-d616-412d-ab5e-10aad27b2476", 10 ], // Giant Lizard
				[ "ceff6967-7d2c-4b84-9e2a-df1d36a9a98c", 10 ], // Giant Spider
				[ "d82d19dd-2e7e-407f-9861-b7e2ee599e5c", 11 ], // Gray Ooze
				[ "9084361f-6e4a-47ee-9e58-341f346278b2", 11 ], // Griffon
				[ "2dfd127c-8844-4289-ac04-b4fe2f1656e4", 11 ], // Guard
				[ "82ec416b-64ff-4738-b308-9cd44ef5957d", 11 ], // Helmed Horror
				[ "127e4789-95e3-48e4-8937-7d85ccb3bea0", 12 ], // Hobgoblin
				[ "5341cb95-c090-4295-ba1d-83d978988a10", 12 ], // Hobgoblin Captain
				[ "9094f81d-5fab-43c6-baf5-4a5acbe94b9b", 12 ], // Knight
				[ "baa3449e-bfd5-408d-8b7e-206a3bebf8ca", 13 ], // Kobold
				[ "5ec95d84-a847-496d-9cca-f4a3c13a81d1", 13 ], // Lizardfolk
				[ "dd58be51-e15c-4abb-8cf4-97263526d5d5", 13 ], // Mage
				[ "f9a076f4-da7e-457a-912e-9fe8d752ef3e", 13 ], // Noble
				[ "545c030a-1674-4838-9d43-752db8265f87", 14 ], // Ogre
				[ "2fc71e84-7157-4d3f-9042-d9b17236f5f0", 14 ], // Orc
				[ "9dca97ac-f3fa-4be6-8a39-09291505f159", 14 ], // Otyugh
				[ "df1f8a95-9f6b-4699-af85-da4368f16cfd", 15 ], // Peryton
				[ "cc9e3c32-1c13-40a5-9d06-0ded81c4e3cb", 15 ], // Priest
				[ "8e7f5fd8-557c-4176-aee8-2a894afb6b99", 15 ], // Roper
				[ "5defa2f6-bdb1-4439-8e3f-a0fe7ae78e31", 16 ], // Rug of Smothering
				[ "14f5f317-1640-4254-b8d7-4d2dadb97394", 16 ], // Scout
				[ "ea9c253b-1fe2-4e66-9331-61f6e3b02336", 16 ], // Shambling Mound
				[ "3a005074-e1df-4b63-88a4-3dd4edbd237a", 17 ], // Specter
				[ "a9524fbf-b1e5-4ca4-9f79-f4e494f93bcb", 17 ], // Spy
				[ "b02dadd4-aa89-426c-ac9b-bfa07b8fe1fc", 17 ], // Stirge
				[ "c29cb38d-3b6a-459a-8643-843d256ab995", 18 ], // Stone Giant
				[ "235ac710-1418-4bda-b0e5-3ded0ccbe1f9", 18 ], // Stone Golem
				[ "e3b72f35-5e72-4bfa-b238-f22062184c1c", 18 ], // Swarm of Insects
				[ "31c042ca-f348-4ba5-a749-bb659b296f8f", 19 ], // Swarm of Rats
				[ "6d5a54d5-176b-46f6-988e-db5ff8176fab", 19 ], // Troglodyte
				[ "243e91ab-b859-44ce-a9cb-e14a055d1151", 19 ], // Troll
				[ "f6277838-fcd7-4d25-b6a5-4049361e0978", 20 ], // Vampire
				[ "36f309b0-7f49-44ac-aba7-6a7405e58545", 21 ], // Vampire Spawn
				[ "595c04c7-7c4d-442a-932a-22be86d294c9", 21 ], // Veteran
				[ "667b4af5-1335-4f33-bd19-34d947603dc9", 21 ], // Violet Fungus
				[ "16d4afb3-8246-4709-8308-58d620849408", 22 ], // Will-o'-Wisp
				[ "e0b6446f-3791-479d-9e03-9a71c0de9f52", 23 ], // Winged Kobold
				[ "9b9d4516-f2ae-449d-80ba-0ce4e85438cc", 23 ], // Wyvern
				[ "718cb508-899e-46cd-8c26-6271fe470d62", 23 ], // Yuan-ti Malison
				[ "63edeedd-e398-4b1c-b4b8-557286512a8a", 24 ], // Yuan-ti Pureblood
			],
		}
	}
})();

(function () {
	"use strict";

	angular.module('app')
		.factory('monsteradaySource', Source);

	function Source() {
		return {
			name: "Monster-A-Day",
			shortName: "MAD",
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
		}
	}
})();
(function() {
	"use strict";

	angular.module("app")
		.factory("monstermanualSource", MonsterManualSource);

	function MonsterManualSource() {
		return {
			name: "Monster Manual",
			shortName: "MM",
			initialState: true,
			contents: [
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
			],
		}
	}
})();
(function() {
	"use strict";

	angular.module("app")
		.factory("monsterStats", MonstersList);

	MonstersList.$inject = ["alignments"];

	function MonstersList(alignments) {
		return [
		// Custom
		{ name: "CR 0",   cr: "0",   special: true, id: "cf33021b-ebd7-4db3-884d-0b48e8211ac3" },
		{ name: "CR 1/8", cr: "1/8", special: true, id: "6107ed19-210b-47a4-a05d-3bf2489e6f4c" },
		{ name: "CR 1/4", cr: "1/4", special: true, id: "ac37c9c6-a51b-4b7d-9c53-01a59a46965c" },
		{ name: "CR 1/2", cr: "1/2", special: true, id: "614d0471-4a6c-4c62-be0e-7056eda3373e" },
		{ name: "CR 1",   cr: "1",   special: true, id: "f42b1530-a466-45a4-95d7-e2ed05ed6a22" },
		{ name: "CR 2",   cr: "2",   special: true, id: "687c8372-49bc-4fb1-923f-6de3018e5286" },
		{ name: "CR 3",   cr: "3",   special: true, id: "129475b2-6192-4d3b-9df9-36f97549c04c" },
		{ name: "CR 4",   cr: "4",   special: true, id: "06862566-630e-430d-a02d-842c743667de" },
		{ name: "CR 5",   cr: "5",   special: true, id: "b3a8e10a-c632-4c1f-9c41-24d817b83eb0" },
		{ name: "CR 6",   cr: "6",   special: true, id: "f8fa57c7-66d1-4992-9751-5750642c4528" },
		{ name: "CR 7",   cr: "7",   special: true, id: "490d87ca-5730-4c55-8859-fe553aae2e04" },
		{ name: "CR 8",   cr: "8",   special: true, id: "b952f971-e50f-4473-9e07-51e82c0ff288" },
		{ name: "CR 9",   cr: "9",   special: true, id: "57f8b076-5b4f-4194-bae9-4fd195497d15" },
		{ name: "CR 10",  cr: "10",  special: true, id: "80fbaf92-86c9-4ef5-8bee-df96a6b581b4" },
		{ name: "CR 11",  cr: "11",  special: true, id: "5c6bf8cc-b83b-48d9-a719-100ae45cac57" },
		{ name: "CR 12",  cr: "12",  special: true, id: "b43d7d4c-c573-4600-96ed-8d739dc8202a" },
		{ name: "CR 13",  cr: "13",  special: true, id: "a24ebe53-0810-4874-99c7-fdfc2474cc3b" },
		{ name: "CR 14",  cr: "14",  special: true, id: "3fc880d1-3810-4139-8c7c-62656e1787f2" },
		{ name: "CR 15",  cr: "15",  special: true, id: "fa14831b-5804-48bf-944a-9373b69a9b4a" },
		{ name: "CR 16",  cr: "16",  special: true, id: "25d596ed-710c-41ca-98ce-2489f08131ee" },
		{ name: "CR 17",  cr: "17",  special: true, id: "73d7d8e0-d03b-461e-9882-8963bf1235c8" },
		{ name: "CR 18",  cr: "18",  special: true, id: "3152a039-f64e-4794-bc88-51309dcbf52c" },
		{ name: "CR 19",  cr: "19",  special: true, id: "024ca4e4-8bf1-49e7-a162-0bba83be1b2a" },
		{ name: "CR 20",  cr: "20",  special: true, id: "660565b6-44cf-486e-9d70-52420a9a0ffe" },
		{ name: "CR 21",  cr: "21",  special: true, id: "6e20c795-903a-4374-a8fd-69b92f71ae1d" },
		{ name: "CR 22",  cr: "22",  special: true, id: "f5fccb83-9337-47b8-b12e-f9417e0e0b50" },
		{ name: "CR 23",  cr: "23",  special: true, id: "2f56a2f1-068e-4467-83e5-559c7f57fd72" },
		{ name: "CR 24",  cr: "24",  special: true, id: "566bea90-3430-4c6c-99c9-f17b37abf6c9" },
		{ name: "CR 25",  cr: "25",  special: true, id: "56fc82df-ba8f-4c45-b64f-837e0370a341" },
		{ name: "CR 26",  cr: "26",  special: true, id: "c2075aca-1de3-497b-94e4-cdb87393b1da" },
		{ name: "CR 27",  cr: "27",  special: true, id: "c329588c-dd97-4edc-af8a-a65ed101a959" },
		{ name: "CR 28",  cr: "28",  special: true, id: "6da69e50-4a20-4730-b84d-bdc5346a32df" },
		{ name: "CR 29",  cr: "29",  special: true, id: "e2589f3b-62dd-4c38-906b-6b262058188a" },
		{ name: "CR 30",  cr: "30",  special: true, id: "28e78bc1-ba2a-4e9d-8dc8-dfe6c7e4cbea" },

		// Monster Manual

		{
			name: "Aarakocra",
			size: "Medium", type: "Humanoid", tags: [ "Aarakocra" ],
			ac: 12, hp: 13, init: 2, cr: "1/4",
			alignment: alignments.ng,
			environments: [ "mountain", "planar" ],
			id: "0cd9a2e0-16bc-4c84-86c8-feb035c0b5d6",
		},
		{
			name: "Aboleth",
			size: "Large", type: "Aberration",
			ac: 17, hp: 135, init: -1, cr: "10",
			alignment: alignments.le,
			environments: [ "aquatic", "coast" ],
			legendary: true,
			lair: true,
			id: "43385a8d-759b-4f44-a712-d46069b8dd88",
		},
		{
			section: "Angels", name: "Deva",
			size: "Medium", type: "Celestial",
			ac: 17, hp: 136, init: 4, cr: "10",
			alignment: alignments.lg,
			environments: [ "planar" ],
			id: "c7e54573-9829-490d-9c8f-4874cb14ba3d",
		},
		{
			section: "Angels", name: "Planetar",
			size: "Large", type: "Celestial",
			ac: 19, hp: 200, init: 5, cr: "16",
			alignment: alignments.lg,
			environments: [ "planar" ],
			id: "7de4388c-e067-4308-b02d-84ecb296aa6e",
		},
		{
			section: "Angels", name: "Solar",
			size: "Large", type: "Celestial",
			ac: 21, hp: 241, init: 6, cr: "21",
			alignment: alignments.lg,
			environments: [ "planar" ],
			legendary: true,
			id: "6137fe73-562f-411b-8654-1e2d057a8da8",
		},
		{
			section: "Animated Objects", name: "Animated Armor",
			size: "Medium", type: "Construct",
			ac: 18, hp: 33, init: 0, cr: "1",
			environments: [ "dungeon", "ruins", "urban" ],
			id: "3c5a63ab-b94f-4451-aa2a-02545b381797",
		},
		{
			section: "Animated Objects", name: "Flying Sword",
			size: "Small", type: "Construct",
			ac: 17, hp: 17, init: 2, cr: "1/4",
			environments: [ "dungeon", "ruins", "urban" ],
			id: "35c699fb-a8d2-491f-9a73-206a61937297",
		},
		{
			section: "Animated Objects", name: "Rug of Smothering",
			size: "Large", type: "Construct",
			ac: 12, hp: 33, init: 2, cr: "2",
			environments: [ "dungeon", "ruins", "urban" ],
			id: "5defa2f6-bdb1-4439-8e3f-a0fe7ae78e31",
		},
		{
			name: "Ankheg",
			size: "Large", type: "Monstrosity",
			ac: "14, 11 while prone", hp: 39, init: 0, cr: "2",
			environments: [ "coast", "forest", "grassland", "underground" ],
			id: "789c33ef-c5f6-484d-8bfe-5c520e7d3f82",
		},
		{
			name: "Azer",
			size: "Medium", type: "Elemental",
			ac: 17, hp: 39, init: 1, cr: "2",
			alignment: alignments.ln,
			environments: [ "underground", "planar" ],
			id: "1180c9bd-d7e3-48d7-8087-79a936ab01d3",
		},
		{
			name: "Banshee",
			size: "Medium", type: "Undead",
			ac: 12, hp: 58, init: 2, cr: "4",
			alignment: alignments.ce,
			environments: [ "dungeon", "forest", "ruins", "swamp" ],
			id: "59a79db3-22c9-457f-bcb0-990013e4057a",
		},
		{
			name: "Basilisk",
			size: "Medium", type: "Monstrosity",
			ac: 15, hp: 52, init: -1, cr: "3",
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground" ],
			id: "fca1066d-9c2c-4745-972c-a4e19376bab7",
		},
		{
			name: "Behir",
			size: "Huge", type: "Monstrosity",
			ac: 17, hp: 168, init: 3, cr: "11",
			alignment: alignments.ne,
			environments: [ "cave", "mountain", "underground" ],
			id: "05a1b5f9-d2de-44ba-b292-b7b63fca6826",
		},
		{
			section: "Beholders", name: "Beholder",
			size: "Large", type: "Aberration",
			ac: 18, hp: 180, init: 2, cr: "13",
			alignment: alignments.le,
			environments: [ "cave", "dungeon", "underground" ],
			legendary: true,
			lair: false,
			id: "a97f037f-85d9-47a4-8eae-814eb5176810",
		},
		{
			section: "Beholders", name: "Beholder (in lair)",
			size: "Large", type: "Aberration",
			ac: 18, hp: 180, init: 2, cr: "14",
			alignment: alignments.le,
			environments: [ "cave", "dungeon", "underground" ],
			legendary: true,
			lair: true,
			id: "095cd054-da20-44b7-a511-b22c42a5b201",
		},
		{
			section: "Beholders", name: "Death Tyrant",
			size: "Large", type: "Undead",
			ac: 19, hp: 187, init: 2, cr: "14",
			alignment: alignments.le,
			environments: [ "cave", "dungeon", "underground" ],
			legendary: true,
			lair: false,
			id: "47c0a532-6d34-4cf9-9d89-ffc4b8575898",
		},
		{
			section: "Beholders", name: "Death Tyrant (in lair)",
			size: "Large", type: "Undead",
			ac: 19, hp: 187, init: 2, cr: "15",
			alignment: alignments.le,
			environments: [ "cave", "dungeon", "underground" ],
			legendary: true,
			lair: true,
			id: "efc8bf04-0f28-4c53-80fd-38e4f6404231",
		},
		{
			section: "Beholders", name: "Spectator",
			size: "Medium", type: "Aberration",
			ac: 14, hp: 39, init: 2, cr: "3",
			alignment: alignments.ln,
			environments: [ "cave", "dungeon", "ruins", "underground", "urban" ],
			id: "aadb1915-c3d4-4349-b9f2-5b7a10ab3f3d",
		},
		{
			section: "Blights", name: "Needle Blight",
			size: "Medium", type: "Plant",
			ac: 12, hp: 11, init: 1, cr: "1/4",
			alignment: alignments.ne,
			environments: [ "forest", "grassland", "swamp" ],
			id: "87ae63b6-4be9-43d7-a096-5556018c5999",
		},
		{
			section: "Blights", name: "Twig Blight",
			size: "Small", type: "Plant",
			ac: 13, hp: 4, init: 1, cr: "1/8",
			alignment: alignments.ne,
			environments: [ "forest", "grassland", "swamp" ],
			id: "811f1a20-d074-4520-a8de-1e37bc53a00c",
		},
		{
			section: "Blights", name: "Vine Blight",
			size: "Medium", type: "Plant",
			ac: 12, hp: 26, init: -1, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "forest", "grassland", "swamp" ],
			id: "590ac204-e32e-4a8e-b4ea-1f7ca2c39851",
		},
		{
			section: "Bugbears", name: "Bugbear",
			size: "Medium", type: "Humanoid", tags: [ "Goblinoid" ],
			ac: 16, hp: 27, init: 2, cr: "1",
			alignment: alignments.ce,
			environments: [ "cave", "dungeon", "forest", "mountain", "ruins", "urban" ],
			id: "2dad5420-04bb-4921-9857-34700a52f413",
		},
		{
			section: "Bugbears", name: "Bugbear Chief",
			size: "Medium", type: "Humanoid", tags: [ "Goblinoid" ],
			ac: 17, hp: 65, init: 2, cr: "3",
			alignment: alignments.ce,
			environments: [ "cave", "dungeon", "forest", "mountain", "ruins", "urban" ],
			id: "bab41d17-f80f-4b5f-abf9-792b03bb98ef",
		},
		{
			name: "Bulette",
			size: "Large", type: "Monstrosity",
			ac: 17, hp: 94, init: 0, cr: "5",
			environments: [ "cave", "desert", "grassland", "mountain", "underground" ],
			id: "6b6b6245-cc31-4950-8ec4-91e06b56a282",
		},
		{
			name: "Bullywug",
			size: "Medium", type: "Humanoid", tags: [ "Bullywug" ],
			ac: 15, hp: 11, init: 1, cr: "1/4",
			alignment: alignments.ne,
			environments: [ "coast", "swamp" ],
			id: "c8328817-b3e9-4c24-984b-f278678bc3a4",
		},
		{
			name: "Cambion",
			size: "Medium", type: "Fiend",
			ac: 19, hp: 82, init: 4, cr: "5",
			alignment: alignments.any_evil,
			environments: [ "dungeon", "urban", "planar" ],
			id: "1f3ad1ff-6606-4f75-ae2a-02293de88198",
		},
		{
			name: "Carrion Crawler",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 51, init: 1, cr: "2",
			environments: [ "cave", "dungeon", "underground" ],
			id: "9c9180b5-4e30-424b-9823-a8375131ffe7",
		},
		{
			name: "Centaur",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 45, init: 2, cr: "2",
			alignment: alignments.ng,
			environments: [ "coast", "desert", "grassland" ],
			id: "a9212953-cb55-4b5d-80ff-c3703fc5cb0e",
		},
		{
			name: "Chimera",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 114, init: 0, cr: "6",
			alignment: alignments.ce,
			environments: [ "mountain" ],
			id: "a11e72bd-d81b-4826-901d-d2101c287b1e",
		},
		{
			name: "Chuul",
			size: "Large", type: "Aberration",
			ac: 16, hp: 93, init: 0, cr: "4",
			alignment: alignments.ce,
			environments: [ "aquatic", "coast" ],
			id: "c20e65d5-8e5b-4f3b-845e-fb12a8342260",
		},
		{
			name: "Cloaker",
			size: "Large", type: "Aberration",
			ac: 14, hp: 78, init: 2, cr: "8",
			alignment: alignments.cn,
			environments: [ "cave", "dungeon", "underground" ],
			id: "3624bf90-c532-4e42-b97e-66cf22005a1a",
		},
		{
			name: "Cockatrice",
			size: "Small", type: "Monstrosity",
			ac: 11, hp: 27, init: 1, cr: "1/2",
			environments: [ "forest", "grassland", "swamp" ],
			id: "6782e851-fe66-4e6f-abd2-2de17c0f4db9",
		},
		{
			name: "Couatl",
			size: "Medium", type: "Celestial",
			ac: 19, hp: 97, init: 5, cr: "4",
			alignment: alignments.lg,
			environments: [ "planar" ],
			id: "37abaf7a-e840-4ea1-b34f-334f13a6a7ca",
		},
		{
			name: "Crawling Claw",
			size: "Tiny", type: "Undead",
			ac: 12, hp: 2, init: 2, cr: "0",
			alignment: alignments.ne,
			environments: [ "dungeon", "ruins", "swamp" ],
			id: "2a0c5d92-fca1-4a81-a702-3c45f230b5fe",
		},
		{
			name: "Cyclops",
			size: "Huge", type: "Giant",
			ac: 14, hp: 138, init: 0, cr: "6",
			alignment: alignments.cn,
			environments: [ "cave", "coast", "grassland", "mountain", "ruins", "swamp" ],
			id: "1c299dc6-ea10-4314-bc9a-0f40fe4dbfab",
		},
		{
			name: "Darkmantle",
			size: "Small", type: "Monstrosity",
			ac: 11, hp: 22, init: 1, cr: "1/2",
			environments: [ "cave", "underground" ],
			id: "f113bf67-3a28-494e-b74b-d495c2ca4d8c",
		},
		{
			name: "Death Knight",
			size: "Medium", type: "Undead",
			ac: 20, hp: 180, init: 0, cr: "17",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban" ],
			id: "e4c765b3-445f-475b-853d-d27b6d4d12fe",
		},
		{
			name: "Demilich",
			size: "Tiny", type: "Undead",
			ac: 20, hp: 80, init: 5, cr: "18",
			alignment: alignments.ne,
			environments: [ "dungeon" ],
			legendary: true,
			lair: false,
			id: "7678ccea-6973-4647-afa0-a0f1957392df",
		},
		{
			name: "Demilich (in lair)",
			size: "Tiny", type: "Undead",
			ac: 20, hp: 80, init: 5, cr: "20",
			alignment: alignments.ne,
			environments: [ "dungeon" ],
			legendary: true,
			lair: true,
			id: "ccb1f0eb-3037-40f3-bbe0-1f63f89ba71c",
		},
		{
			name: "Demilich (Acererak)",
			size: "Tiny", type: "Undead", unique: true,
			ac: 20, hp: 80, init: 5, cr: "21",
			alignment: alignments.ne,
			legendary: true,
			lair: false,
			id: "44738bcb-dfb3-4ce0-bf2e-836df2601fdd",
		},
		{
			name: "Demilich (Acererak in lair)",
			size: "Tiny", type: "Undead", unique: true,
			ac: 20, hp: 80, init: 5, cr: "23",
			alignment: alignments.ne,
			legendary: true,
			lair: true,
			id: "d315f181-effc-499e-947b-caf6eeec524a",
		},
		{
			section: "Demons", name: "Balor",
			size: "Huge", type: "Fiend", tags: [ "Demon" ],
			ac: 19, hp: 262, init: 2, cr: "19",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "e99e9430-d387-4c3f-8168-cfd6257174a1",
		},
		{
			section: "Demons", name: "Barlgura",
			size: "Large", type: "Fiend", tags: [ "Demon" ],
			ac: 15, hp: 68, init: 2, cr: "5",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "b8148f95-9e1c-45b9-aabf-78d11ad0ee25",
		},
		{
			section: "Demons", name: "Chasme",
			size: "Large", type: "Fiend", tags: [ "Demon" ],
			ac: 15, hp: 84, init: 2, cr: "6",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "b2d9646e-cd3b-4045-803f-aedf158216a2",
		},
		{
			section: "Demons", name: "Dretch",
			size: "Small", type: "Fiend", tags: [ "Demon" ],
			ac: 11, hp: 18, init: 0, cr: "1/4",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "84860c36-652d-44df-bd00-905303a4e589",
		},
		{
			section: "Demons", name: "Glabrezu",
			size: "Large", type: "Fiend", tags: [ "Demon" ],
			ac: 17, hp: 157, init: 2, cr: "9",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "681eb77f-9e46-4d7c-b96b-c850f1037dd0",
		},
		{
			section: "Demons", name: "Goristro",
			size: "Huge", type: "Fiend", tags: [ "Demon" ],
			ac: 19, hp: 310, init: 0, cr: "17",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "776873f4-290b-4bf8-8d55-1d9b978791b0",
		},
		{
			section: "Demons", name: "Hezrou",
			size: "Large", type: "Fiend", tags: [ "Demon" ],
			ac: 16, hp: 136, init: 3, cr: "8",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "ba7bbb9e-2a12-4e4b-b90c-0d8e90f0898d",
		},
		{
			section: "Demons", name: "Manes",
			size: "Small", type: "Fiend", tags: [ "Demon" ],
			ac: 9, hp: 9, init: -1, cr: "1/8",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "22a8a7af-8674-4308-9c7c-da4d02965093",
		},
		{
			section: "Demons", name: "Marilith",
			size: "Large", type: "Fiend", tags: [ "Demon" ],
			ac: 18, hp: 189, init: 5, cr: "16",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "8e3f174d-372b-40b5-ac07-c5e4651d410c",
		},
		{
			section: "Demons", name: "Nalfeshnee",
			size: "Large", type: "Fiend", tags: [ "Demon" ],
			ac: 18, hp: 184, init: 0, cr: "13",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "fea2cf64-fbc7-45e9-b901-ede53d696bf3",
		},
		{
			section: "Demons", name: "Quasit",
			size: "Tiny", type: "Fiend", tags: [ "Demon", "Shapechanger" ],
			ac: 13, hp: 7, init: 3, cr: "1",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "05541b29-3f73-45f4-974c-6aabd25b4708",
		},
		{
			section: "Demons", name: "Shadow Demon",
			size: "Medium", type: "Fiend", tags: [ "Demon" ],
			ac: 13, hp: 66, init: 3, cr: "4",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "d356934b-d78b-49bf-9ce0-b9fb9946eb64",
		},
		{
			section: "Demons", name: "Vrock",
			size: "Large", type: "Fiend", tags: [ "Demon" ],
			ac: 15, hp: 104, init: 2, cr: "6",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "993c1b2c-ea24-45c5-9c1d-a862d1f6b440",
		},
		{
			section: "Demons", name: "Yochlol",
			size: "Medium", type: "Fiend", tags: [ "Demon", "Shapechanger" ],
			ac: 15, hp: 136, init: 2, cr: "10",
			alignment: alignments.ce,
			environments: [ "dungeon", "planar" ],
			id: "b6a29400-8010-4d35-b429-b65eb33de9c3",
		},
		{
			section: "Devils", name: "Barbed Devil",
			size: "Medium", type: "Fiend", tags: [ "Devil" ],
			ac: 15, hp: 110, init: 3, cr: "5",
			alignment: alignments.le,
			environments: [ "dungeon", "planar" ],
			id: "f9fe17c3-2688-4434-98fc-1321b8e1d48d",
		},
		{
			section: "Devils", name: "Bearded Devil",
			size: "Medium", type: "Fiend", tags: [ "Devil" ],
			ac: 13, hp: 52, init: 2, cr: "3",
			alignment: alignments.le,
			environments: [ "dungeon", "planar" ],
			id: "f32f1817-8310-41f0-8a83-0d39a5d464c3",
		},
		{
			section: "Devils", name: "Bone Devil",
			size: "Large", type: "Fiend", tags: [ "Devil" ],
			ac: 19, hp: 142, init: 3, cr: "9",
			alignment: alignments.le,
			environments: [ "dungeon", "planar" ],
			id: "d6d8860b-6c94-4056-b02d-d4161206d24c",
		},
		{
			section: "Devils", name: "Chain Devil",
			size: "Medium", type: "Fiend", tags: [ "Devil" ],
			ac: 16, hp: 85, init: 2, cr: "8",
			alignment: alignments.le,
			environments: [ "dungeon", "planar" ],
			id: "9c4a2dce-bc31-4644-88d1-a590d19c8b47",
		},
		{
			section: "Devils", name: "Erinyes",
			size: "Medium", type: "Fiend", tags: [ "Devil" ],
			ac: 18, hp: 153, init: 3, cr: "12",
			alignment: alignments.le,
			environments: [ "dungeon", "planar" ],
			id: "17e723aa-5268-4ed7-8c54-113a4e6fb76c",
		},
		{
			section: "Devils", name: "Horned Devil",
			size: "Large", type: "Fiend", tags: [ "Devil" ],
			ac: 18, hp: 178, init: 3, cr: "11",
			alignment: alignments.le,
			environments: [ "dungeon", "planar" ],
			id: "50a88400-dd98-40b7-a03a-4cbedd5730b8",
		},
		{
			section: "Devils", name: "Ice Devil",
			size: "Large", type: "Fiend", tags: [ "Devil" ],
			ac: 18, hp: 180, init: 2, cr: "14",
			alignment: alignments.le,
			environments: [ "dungeon", "planar" ],
			id: "ccc0b0de-f4e8-418d-b354-dbf6968413ee",
		},
		{
			section: "Devils", name: "Imp",
			size: "Tiny", type: "Fiend", tags: [ "Demon", "Shapechanger" ],
			ac: 13, hp: 10, init: 3, cr: "1",
			alignment: alignments.le,
			environments: [ "dungeon", "planar" ],
			id: "c211c5fc-f71a-4e11-8c8b-71a6ae470eaa",
		},
		{
			section: "Devils", name: "Lemure",
			size: "Medium", type: "Fiend", tags: [ "Devil" ],
			ac: 7, hp: 13, init: -3, cr: "0",
			alignment: alignments.le,
			environments: [ "dungeon", "planar" ],
			id: "a423f6af-82f8-4716-9a32-03e6c21679b1",
		},
		{
			section: "Devils", name: "Pit Fiend",
			size: "Large", type: "Fiend", tags: [ "Devil" ],
			ac: 19, hp: 300, init: 2, cr: "20",
			alignment: alignments.le,
			environments: [ "dungeon", "planar" ],
			id: "14742ff6-ed38-44f5-8e11-4ac74b20ba02",
		},
		{
			section: "Devils", name: "Spined Devil",
			size: "Small", type: "Fiend", tags: [ "Devil" ],
			ac: 13, hp: 22, init: 2, cr: "2",
			alignment: alignments.le,
			environments: [ "dungeon", "planar" ],
			id: "0cf05453-f134-4a9a-8884-256965c0576b",
		},
		{
			section: "Dinosaurs", name: "Allosaurus",
			size: "Large", type: "Beast",
			ac: 13, hp: 51, init: 1, cr: "2",
			environments: [ "coast", "grassland", "swamp" ],
			id: "4dfdcf3d-5bdc-4d4d-a55c-6a9149d97079",
		},
		{
			section: "Dinosaurs", name: "Ankylosaurus",
			size: "Huge", type: "Beast",
			ac: 15, hp: 68, init: 0, cr: "3",
			environments: [ "grassland" ],
			id: "935a62a6-3538-4ea8-a06c-adddef096e56",
		},
		{
			section: "Dinosaurs", name: "Plesiosaurus",
			size: "Large", type: "Beast",
			ac: 13, hp: 68, init: 2, cr: "2",
			environments: [ "aquatic" ],
			id: "633bf055-b509-4f7f-b4ca-5c14bbfeb919",
		},
		{
			section: "Dinosaurs", name: "Pteranodon",
			size: "Medium", type: "Beast",
			ac: 13, hp: 13, init: 2, cr: "1/4",
			environments: [ "mountain" ],
			id: "2bbec9af-7f96-40ed-84c8-9f5c98ae38c3",
		},
		{
			section: "Dinosaurs", name: "Triceratops",
			size: "Huge", type: "Beast",
			ac: 13, hp: 95, init: -1, cr: "5",
			environments: [ "grassland", "mountain" ],
			id: "75aa0080-9b95-4693-abfd-dc077ba0073a",
		},
		{
			section: "Dinosaurs", name: "Tyrannosaurus Rex",
			size: "Huge", type: "Beast",
			ac: 13, hp: 136, init: 0, cr: "8",
			environments: [ "grassland" ],
			id: "49fb470b-4186-49a4-9794-05dfcdc8fe09",
		},
		{
			name: "Displacer Beast",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 85, init: 2, cr: "3",
			alignment: alignments.le,
			environments: [ "forest", "grassland" ],
			id: "6169f0f9-4bc6-4453-8d20-a7ceed20dbbd",
		},
		{
			name: "Doppelganger",
			size: "Medium", type: "Monstrosity", tags: [ "Shapechanger" ],
			ac: 14, hp: 52, init: 4, cr: "3",
			alignment: alignments.n,
			environments: [ "dungeon", "ruins", "urban" ],
			id: "738ff802-57e5-4f73-89cb-5def2b527fc0",
		},
		{
			section: "Dracolich", name: "Adult Blue Dracolich",
			size: "Huge", type: "Undead",
			ac: 19, hp: 225, init: 0, cr: "17",
			alignment: alignments.le,
			environments: [ "desert", "dungeon" ],
			legendary: true,
			lair: true,
			id: "437ddd59-2aa8-489f-bc2e-e9845a935947",
		},
		{
			section: "Dragon, Shadow", name: "Young Red Shadow Dragon",
			size: "Large", type: "Dragon",
			ac: 18, hp: 178, init: 0, cr: "13",
			alignment: alignments.ce,
			environments: [ "planar" ],
			id: "ca105b5a-d47c-467a-b48f-bd25a9a33de4",
		},
		{
			section: "Dragons", name: "Adult Black Dragon",
			size: "Huge", type: "Dragon",
			ac: 19, hp: 195, init: 2, cr: "14",
			alignment: alignments.ce,
			environments: [ "swamp" ],
			legendary: true,
			lair: true,
			id: "925ae71b-869a-4067-aed6-803e50dc3e41",
		},
		{
			section: "Dragons", name: "Adult Blue Dragon",
			size: "Huge", type: "Dragon",
			ac: 19, hp: 225, init: 0, cr: "16",
			alignment: alignments.le,
			environments: [ "desert" ],
			legendary: true,
			lair: true,
			id: "0a70230e-18d8-49e3-898a-49e740acb4a2",
		},
		{
			section: "Dragons", name: "Adult Brass Dragon",
			size: "Huge", type: "Dragon",
			ac: 18, hp: 172, init: 0, cr: "13",
			alignment: alignments.cg,
			environments: [ "cave", "underground" ],
			legendary: true,
			lair: true,
			id: "02616673-2113-4e70-82fc-729b766d3c58",
		},
		{
			section: "Dragons", name: "Adult Bronze Dragon",
			size: "Huge", type: "Dragon",
			ac: 19, hp: 212, init: 0, cr: "15",
			alignment: alignments.lg,
			environments: [ "coast" ],
			legendary: true,
			lair: true,
			id: "ac41ad48-6631-413e-8e68-6e29696c8f35",
		},
		{
			section: "Dragons", name: "Adult Copper Dragon",
			size: "Huge", type: "Dragon",
			ac: 18, hp: 184, init: 1, cr: "14",
			alignment: alignments.cg,
			environments: [ "cave", "desert", "grassland" ],
			legendary: true,
			lair: true,
			id: "43984f24-324e-4656-ae7a-aeaaa14d74be",
		},
		{
			section: "Dragons", name: "Adult Gold Dragon",
			size: "Huge", type: "Dragon",
			ac: 19, hp: 256, init: 2, cr: "17",
			alignment: alignments.lg,
			environments: [ "mountain", "ruins" ],
			legendary: true,
			lair: true,
			id: "99872957-920d-4007-a66b-0f5922ba584d",
		},
		{
			section: "Dragons", name: "Adult Green Dragon",
			size: "Huge", type: "Dragon",
			ac: 19, hp: 207, init: 1, cr: "15",
			alignment: alignments.le,
			environments: [ "forest" ],
			legendary: true,
			lair: true,
			id: "1182dfb4-3b70-4ce0-a41c-c5ff1ca6ad21",
		},
		{
			section: "Dragons", name: "Adult Red Dragon",
			size: "Huge", type: "Dragon",
			ac: 19, hp: 256, init: 0, cr: "17",
			alignment: alignments.ce,
			environments: [ "mountain" ],
			legendary: true,
			lair: true,
			id: "a27291de-91c5-4b8e-9ffe-5055e90cc6cd",
		},
		{
			section: "Dragons", name: "Adult Silver Dragon",
			size: "Huge", type: "Dragon",
			ac: 19, hp: 243, init: 0, cr: "16",
			alignment: alignments.lg,
			environments: [ "arctic", "mountain" ],
			legendary: true,
			lair: true,
			id: "4002e3ba-63b1-48a8-87d1-044a319cb02d",
		},
		{
			section: "Dragons", name: "Adult White Dragon",
			size: "Huge", type: "Dragon",
			ac: 18, hp: 200, init: 0, cr: "13",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "underground" ],
			legendary: true,
			lair: true,
			id: "4218c74b-27c2-45be-abde-e23ad4223061",
		},
		{
			section: "Dragons", name: "Ancient Black Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 22, hp: 367, init: 2, cr: "21",
			alignment: alignments.ce,
			environments: [ "swamp" ],
			legendary: true,
			lair: true,
			id: "19a2039e-4cc1-4181-96d2-5f33d5d75764",
		},
		{
			section: "Dragons", name: "Ancient Blue Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 22, hp: 481, init: 0, cr: "23",
			alignment: alignments.le,
			environments: [ "desert" ],
			legendary: true,
			lair: true,
			id: "3e861d52-a964-4c84-8ffc-44a814e3070b",
		},
		{
			section: "Dragons", name: "Ancient Brass Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 20, hp: 297, init: 0, cr: "20",
			alignment: alignments.cg,
			environments: [ "cave", "underground" ],
			legendary: true,
			lair: true,
			id: "75ff17b1-4f33-49ca-ae07-80088c028ea5",
		},
		{
			section: "Dragons", name: "Ancient Bronze Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 22, hp: 444, init: 0, cr: "22",
			alignment: alignments.lg,
			environments: [ "coast" ],
			legendary: true,
			lair: true,
			id: "49924bb6-804f-4150-870b-b14b85716129",
		},
		{
			section: "Dragons", name: "Ancient Copper Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 21, hp: 350, init: 1, cr: "21",
			alignment: alignments.cg,
			environments: [ "cave", "desert", "grassland" ],
			legendary: true,
			lair: true,
			id: "e06dae63-02d4-41c4-b910-0831ca111514",
		},
		{
			section: "Dragons", name: "Ancient Gold Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 22, hp: 546, init: 2, cr: "24",
			alignment: alignments.lg,
			environments: [ "mountain", "ruins" ],
			legendary: true,
			lair: true,
			id: "d830724d-8d58-4464-af65-3befceb878bf",
		},
		{
			section: "Dragons", name: "Ancient Green Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 21, hp: 385, init: 1, cr: "22",
			alignment: alignments.le,
			environments: [ "forest" ],
			legendary: true,
			lair: true,
			id: "67f50578-6e21-4e73-9d47-5a34d5d340c4",
		},
		{
			section: "Dragons", name: "Ancient Red Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 22, hp: 546, init: 0, cr: "24",
			alignment: alignments.ce,
			environments: [ "mountain" ],
			legendary: true,
			lair: true,
			id: "fa6112d9-803c-4c9e-b995-41cb04b8872d",
		},
		{
			section: "Dragons", name: "Ancient Silver Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 22, hp: 487, init: 0, cr: "23",
			alignment: alignments.lg,
			environments: [ "arctic", "mountain" ],
			legendary: true,
			lair: true,
			id: "867fd8db-72d8-4bc7-8d8a-272afe0c42c6",
		},
		{
			section: "Dragons", name: "Ancient White Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 20, hp: 333, init: 0, cr: "20",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "underground" ],
			legendary: true,
			lair: true,
			id: "44702dbb-036c-4eee-923e-565cf17e77ac",
		},
		{
			section: "Dragons", name: "Black Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 17, hp: 33, init: 2, cr: "2",
			alignment: alignments.ce,
			environments: [ "swamp" ],
			id: "db95bd5e-565b-44fa-8bdb-0732ce4d3b67",
		},
		{
			section: "Dragons", name: "Blue Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 17, hp: 52, init: 0, cr: "3",
			alignment: alignments.le,
			environments: [ "desert" ],
			id: "15c821b4-abed-42f4-bbcd-2035edec5aad",
		},
		{
			section: "Dragons", name: "Brass Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 16, hp: 16, init: 0, cr: "1",
			alignment: alignments.cg,
			environments: [ "cave", "underground" ],
			id: "03e32c50-a660-4314-b701-393153a80fcd",
		},
		{
			section: "Dragons", name: "Bronze Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 17, hp: 32, init: 0, cr: "2",
			alignment: alignments.lg,
			environments: [ "coast" ],
			id: "1fac16f9-7b5f-4d8f-85b9-fcecacd16d2a",
		},
		{
			section: "Dragons", name: "Copper Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 16, hp: 22, init: 1, cr: "1",
			alignment: alignments.cg,
			environments: [ "cave", "desert", "grassland" ],
			id: "b226d74a-b4ea-48cf-b510-48e6de7fc765",
		},
		{
			section: "Dragons", name: "Gold Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 17, hp: 60, init: 2, cr: "3",
			alignment: alignments.lg,
			environments: [ "mountain", "ruins" ],
			id: "524618b1-0d0d-4e12-bcf3-cb8d725c9ebc",
		},
		{
			section: "Dragons", name: "Green Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 17, hp: 38, init: 1, cr: "2",
			alignment: alignments.le,
			environments: [ "forest" ],
			id: "41eb895f-32b5-4389-8e99-145545851edc",
		},
		{
			section: "Dragons", name: "Red Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 17, hp: 75, init: 0, cr: "4",
			alignment: alignments.ce,
			environments: [ "mountain" ],
			id: "e5d8b994-96ce-48e8-9cf2-5453b0d84959",
		},
		{
			section: "Dragons", name: "Silver Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 17, hp: 45, init: 0, cr: "2",
			alignment: alignments.lg,
			environments: [ "arctic", "mountain" ],
			id: "def8e263-2dae-4ec5-b3b1-6150011ec485",
		},
		{
			section: "Dragons", name: "White Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 16, hp: 32, init: 0, cr: "2",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "underground" ],
			id: "c00182cb-df6f-42da-9193-e67eb119083c",
		},
		{
			section: "Dragons", name: "Young Black Dragon",
			size: "Large", type: "Dragon",
			ac: 18, hp: 127, init: 2, cr: "7",
			alignment: alignments.ce,
			environments: [ "swamp" ],
			id: "e1758345-1f6a-440c-bb64-d86ba7e96bfa",
		},
		{
			section: "Dragons", name: "Young Blue Dragon",
			size: "Large", type: "Dragon",
			ac: 18, hp: 152, init: 0, cr: "9",
			alignment: alignments.le,
			environments: [ "desert" ],
			id: "5b5912af-1b34-45f7-adae-388645d0a500",
		},
		{
			section: "Dragons", name: "Young Brass Dragon",
			size: "Large", type: "Dragon",
			ac: 17, hp: 110, init: 0, cr: "6",
			alignment: alignments.cg,
			environments: [ "cave", "underground" ],
			id: "04cd3926-8097-4020-87c1-74610125a529",
		},
		{
			section: "Dragons", name: "Young Bronze Dragon",
			size: "Large", type: "Dragon",
			ac: 18, hp: 142, init: 0, cr: "8",
			alignment: alignments.lg,
			environments: [ "coast" ],
			id: "994dda89-f812-4e4d-8996-40e877539101",
		},
		{
			section: "Dragons", name: "Young Copper Dragon",
			size: "Large", type: "Dragon",
			ac: 17, hp: 119, init: 1, cr: "7",
			alignment: alignments.cg,
			environments: [ "cave", "desert", "grassland" ],
			id: "aec4cd35-e36f-41fd-a4a4-c19ab3d08218",
		},
		{
			section: "Dragons", name: "Young Gold Dragon",
			size: "Large", type: "Dragon",
			ac: 18, hp: 178, init: 2, cr: "10",
			alignment: alignments.lg,
			environments: [ "mountain", "ruins" ],
			id: "f858036f-efe8-4f7f-af82-cfa836594474",
		},
		{
			section: "Dragons", name: "Young Green Dragon",
			size: "Large", type: "Dragon",
			ac: 18, hp: 136, init: 1, cr: "8",
			alignment: alignments.le,
			environments: [ "forest" ],
			id: "d935c7ad-b765-4e72-8274-adb16a62aade",
		},
		{
			section: "Dragons", name: "Young Red Dragon",
			size: "Large", type: "Dragon",
			ac: 18, hp: 178, init: 0, cr: "10",
			alignment: alignments.ce,
			environments: [ "mountain" ],
			id: "3f6ed5da-bf09-4f65-bfd2-b012ebb01648",
		},
		{
			section: "Dragons", name: "Young Silver Dragon",
			size: "Large", type: "Dragon",
			ac: 18, hp: 168, init: 0, cr: "9",
			alignment: alignments.lg,
			environments: [ "arctic", "mountain" ],
			id: "6c8026b5-6b8b-4b06-a3a8-78a4822d791f",
		},
		{
			section: "Dragons", name: "Young White Dragon",
			size: "Large", type: "Dragon",
			ac: 17, hp: 133, init: 0, cr: "6",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "underground" ],
			id: "3797b48d-5d9e-4e6b-ae4c-43fa4bfcf086",
		},
		{
			name: "Dragon Turtle",
			size: "Gargantuan", type: "Dragon",
			ac: 20, hp: 341, init: 0, cr: "17",
			alignment: alignments.n,
			environments: [ "aquatic" ],
			id: "5a1662ec-9630-404e-8f37-7c79e9f9f450",
		},
		{
			name: "Drider",
			size: "Large", type: "Monstrosity",
			ac: 19, hp: 123, init: 3, cr: "6",
			alignment: alignments.ce,
			environments: [ "dungeon", "underground" ],
			id: "cd17abab-5062-4ab5-9a1c-df53d3962a87",
		},
		{
			name: "Dryad",
			size: "Medium", type: "Fey",
			ac: "11 (16 with barkskin)", hp: 22, init: 1, cr: "1",
			alignment: alignments.n,
			environments: [ "forest" ],
			id: "ca145277-a157-4591-af02-3d5a3cfe3368",
		},
		{
			name: "Duergar",
			size: "Medium", type: "Humanoid", tags: [ "Dwarf" ],
			ac: 16, hp: 26, init: 0, cr: "1",
			alignment: alignments.le,
			environments: [ "dungeon", "underground" ],
			id: "3dabeab2-dbcb-4915-a633-797f17fe5f4d",
		},
		{
			section: "Elementals", name: "Air Elemental",
			size: "Large", type: "Elemental",
			ac: 15, hp: 90, init: 5, cr: "5",
			alignment: alignments.n,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "planar" ],
			id: "071f1203-f6e6-4fcf-928c-b9cdeb256b2b",
		},
		{
			section: "Elementals", name: "Earth Elemental",
			size: "Large", type: "Elemental",
			ac: 17, hp: 126, init: -1, cr: "5",
			alignment: alignments.n,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "planar" ],
			id: "e5f96c20-3f6c-4374-90e8-89a3952f2562",
		},
		{
			section: "Elementals", name: "Fire Elemental",
			size: "Large", type: "Elemental",
			ac: 13, hp: 102, init: 3, cr: "5",
			alignment: alignments.n,
			environments: [ "cave", "coast", "desert", "dungeon", "grassland", "mountain", "ruins", "underground", "planar" ],
			id: "4630fbab-b0ca-41dc-9e42-3a69a737ff0e",
		},
		{
			section: "Elementals", name: "Water Elemental",
			size: "Large", type: "Elemental",
			ac: 14, hp: 114, init: 2, cr: "5",
			alignment: alignments.n,
			environments: [ "aquatic", "arctic", "cave", "coast", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "planar" ],
			id: "ef655c7f-1f59-4b56-8b52-3e96895cb20f",
		},
		{
			section: "Elves: Drow", name: "Drow",
			size: "Medium", type: "Humanoid", tags: [ "Elf" ],
			ac: 15, hp: 13, init: 2, cr: "1/4",
			alignment: alignments.ne,
			environments: [ "dungeon", "underground", "urban" ],
			id: "e28ee68c-d06b-411c-9ed5-423a151d6697",
		},
		{
			section: "Elves: Drow", name: "Drow Elite Warrior",
			size: "Medium", type: "Humanoid", tags: [ "Elf" ],
			ac: 18, hp: 71, init: 4, cr: "5",
			alignment: alignments.ne,
			environments: [ "dungeon", "underground", "urban" ],
			id: "197e15f8-c5f7-41ac-a47a-a92144e2bfac",
		},
		{
			section: "Elves: Drow", name: "Drow Mage",
			size: "Medium", type: "Humanoid", tags: [ "Elf" ],
			ac: "12 (15 with mage armor)", hp: 45, init: 2, cr: "7",
			alignment: alignments.ne,
			environments: [ "dungeon", "underground", "urban" ],
			id: "a2a7ae70-c46a-48b8-9a5f-d3b1c82b91b5",
		},
		{
			section: "Elves: Drow", name: "Drow Priestess of Lolth",
			size: "Medium", type: "Humanoid", tags: [ "Elf" ],
			ac: 16, hp: 71, init: 2, cr: "8",
			alignment: alignments.ne,
			environments: [ "dungeon", "underground", "urban" ],
			id: "525d2a5a-4fba-4183-926e-4cca39164da4",
		},
		{
			name: "Empyrean",
			size: "Huge", type: "Celestial", tags: [ "Titan" ],
			ac: 22, hp: 313, init: 5, cr: "23",
			alignment: { cg: true, ne: true, text: "chaotic good (75%) or neutral evil (25%)" },
			environments: [ "planar" ],
			legendary: true,
			id: "607299fd-9bfc-41da-983e-47a821eb35a9",
		},
		{
			name: "Ettercap",
			size: "Medium", type: "Monstrosity",
			ac: 13, hp: 44, init: 2, cr: "2",
			alignment: alignments.ne,
			environments: [ "cave", "dungeon", "forest", "ruins", "swamp", "underground" ],
			id: "1ae109e6-763a-46cd-b643-396c0e83da84",
		},
		{
			name: "Ettin",
			size: "Large", type: "Giant",
			ac: 12, hp: 85, init: -1, cr: "4",
			alignment: alignments.ce,
			environments: [ "cave", "grassland", "mountain", "swamp" ],
			id: "2d0d5297-dd18-4bd7-85e9-0759e4a6bb8b",
		},
		{
			name: "Faerie Dragon (red)",
			size: "Tiny", type: "Dragon",
			ac: 15, hp: 14, init: 5, cr: "1",
			alignment: alignments.cg,
			environments: [ "forest", "grassland", "mountain", "ruins", "swamp" ],
			id: "8e6e36dd-dabc-4fd9-ba4d-261b26baeb81",
		},
		{
			name: "Faerie Dragon (orange)",
			size: "Tiny", type: "Dragon",
			ac: 15, hp: 14, init: 5, cr: "1",
			alignment: alignments.cg,
			environments: [ "forest", "grassland", "mountain", "ruins", "swamp" ],
			id: "009bfc30-93b0-48f5-a403-269c8ace67bf",
		},
		{
			name: "Faerie Dragon (yellow)",
			size: "Tiny", type: "Dragon",
			ac: 15, hp: 14, init: 5, cr: "1",
			alignment: alignments.cg,
			environments: [ "forest", "grassland", "mountain", "ruins", "swamp" ],
			id: "83602f7b-43f6-4d20-ab7c-c2dd52990826",
		},
		{
			name: "Faerie Dragon (green)",
			size: "Tiny", type: "Dragon",
			ac: 15, hp: 14, init: 5, cr: "2",
			alignment: alignments.cg,
			environments: [ "forest", "grassland", "mountain", "ruins", "swamp" ],
			id: "2f69eb5e-7c8c-4f6b-97f3-aab4ee7c5501",
		},
		{
			name: "Faerie Dragon (blue)",
			size: "Tiny", type: "Dragon",
			ac: 15, hp: 14, init: 5, cr: "2",
			alignment: alignments.cg,
			environments: [ "forest", "grassland", "mountain", "ruins", "swamp" ],
			id: "6a982eda-d984-429f-b6e0-8b3c28e2914f",
		},
		{
			name: "Faerie Dragon (indigo)",
			size: "Tiny", type: "Dragon",
			ac: 15, hp: 14, init: 5, cr: "2",
			alignment: alignments.cg,
			environments: [ "forest", "grassland", "mountain", "ruins", "swamp" ],
			id: "fd9e0821-7b20-4184-b292-e50d154b7f7b",
		},
		{
			name: "Faerie Dragon (violet)",
			size: "Tiny", type: "Dragon",
			ac: 15, hp: 14, init: 5, cr: "2",
			alignment: alignments.cg,
			environments: [ "forest", "grassland", "mountain", "ruins", "swamp" ],
			id: "d5edc918-ee9d-46dd-a780-fd6203e75228",
		},
		{
			name: "Flameskull",
			size: "Tiny", type: "Undead",
			ac: 13, hp: 40, init: 3, cr: "4",
			alignment: alignments.ne,
			environments: [ "dungeon", "ruins" ],
			id: "4665dbb1-cbc4-433a-a0df-0b6477d6f4fa",
		},
		{
			name: "Flumph",
			size: "Small", type: "Aberration",
			ac: 12, hp: 7, init: 2, cr: "1/8",
			alignment: alignments.lg,
			environments: [ "dungeon", "underground" ],
			id: "14d204ca-04d2-44d4-a644-2e1e9e2d9091",
		},
		{
			name: "Fomorian",
			size: "Huge", type: "Giant",
			ac: 14, hp: 149, init: 0, cr: "8",
			alignment: alignments.ce,
			environments: [ "cave", "underground" ],
			id: "fdb52704-4bb5-4909-b55e-0f8ee199f877",
		},
		{
			name: "Galeb Duhr",
			size: "Medium", type: "Elemental",
			ac: 16, hp: 85, init: 2, cr: "6",
			alignment: alignments.n,
			environments: [ "cave", "dungeon", "mountain", "underground", "planar" ],
			id: "1e738fdf-524b-4127-b5b9-916758a8b52a",
		},
		{
			section: "Fungi", name: "Gas Spore",
			size: "Large", type: "Plant",
			ac: 5, hp: 1, init: -5, cr: "1/2",
			environments: [ "cave", "dungeon", "underground" ],
			id: "5ad9d340-d07d-48bf-8938-2d304730746d",
		},
		{
			section: "Fungi", name: "Shrieker",
			size: "Medium", type: "Plant",
			ac: 5, hp: 13, init: -5, cr: "0",
			environments: [ "cave", "dungeon", "swamp" ],
			id: "3aa695ea-6f7e-49bb-aef4-3153347c0fcc",
		},
		{
			section: "Fungi", name: "Violet Fungus",
			size: "Medium", type: "Plant",
			ac: 5, hp: 18, init: -5, cr: "1/4",
			environments: [ "cave", "dungeon", "underground" ],
			id: "667b4af5-1335-4f33-bd19-34d947603dc9",
		},
		{
			name: "Gargoyle",
			size: "Medium", type: "Elemental",
			ac: 15, hp: 52, init: 0, cr: "2",
			alignment: alignments.ce,
			environments: [ "dungeon", "urban" ],
			id: "625ff3cf-c836-498f-bb9b-de25adb1c26d",
		},
		{
			section: "Genies", name: "Dao",
			size: "Large", type: "Elemental",
			ac: 18, hp: 187, init: 1, cr: "11",
			alignment: alignments.ne,
			environments: [ "cave", "dungeon", "mountain", "underground", "planar" ],
			id: "c3b998ee-064e-4034-aaac-8e3d8dcb4eae",
		},
		{
			section: "Genies", name: "Djinni",
			size: "Large", type: "Elemental",
			ac: 17, hp: 161, init: 2, cr: "11",
			alignment: alignments.cg,
			environments: [ "arctic", "coast", "dungeon", "grassland", "planar" ],
			id: "bd3dbe66-519f-4aaf-96a0-4058b8910af6",
		},
		{
			section: "Genies", name: "Efreeti",
			size: "Large", type: "Elemental",
			ac: 17, hp: 200, init: 1, cr: "11",
			alignment: alignments.le,
			environments: [ "desert", "dungeon", "mountain", "planar" ],
			id: "56fac8a2-3ef7-4ed6-bf94-df506191ed77",
		},
		{
			section: "Genies", name: "Marid",
			size: "Large", type: "Elemental",
			ac: 17, hp: 229, init: 1, cr: "11",
			alignment: alignments.cn,
			environments: [ "aquatic", "coast", "dungeon", "swamp", "planar" ],
			id: "b30c6226-cb44-4070-ba78-12bfcf3e8d9e",
		},
		{
			name: "Ghost",
			size: "Medium", type: "Undead",
			ac: 11, hp: 45, init: 1, cr: "4",
			alignment: alignments.any,
			environments: [ "cave", "dungeon", "ruins", "swamp", "underground", "urban" ],
			id: "c15c8f1e-5e6c-4011-a994-683fbb0b18dd",
		},
		{
			section: "Ghouls", name: "Ghast",
			size: "Medium", type: "Undead",
			ac: 13, hp: 36, init: 3, cr: "2",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban" ],
			id: "73113f3b-87d9-46a3-90a8-38ab64ba2dab",
		},

		{
			section: "Ghouls", name: "Ghoul",
			size: "Medium", type: "Undead",
			ac: 12, hp: 22, init: 2, cr: "1",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban" ],
			id: "369e60c6-5792-4623-8e11-36951e652011",
		},
		{
			section: "Giants", name: "Cloud Giant",
			size: "Huge", type: "Giant",
			ac: 14, hp: 200, init: 0, cr: "9",
			alignment: { ng: true, ne: true, text: "neutral good (50%) or neutral evil (50%)" },
			environments: [ "mountain", "planar" ],
			id: "ddb5a9fe-4323-479f-86b1-79d810a0ff69",
		},
		{
			section: "Giants", name: "Fire Giant",
			size: "Huge", type: "Giant",
			ac: 18, hp: 162, init: -1, cr: "9",
			alignment: alignments.le,
			environments: [ "mountain", "planar" ],
			id: "cc07acfb-a623-43ec-8c23-70a0385eb481",
		},
		{
			section: "Giants", name: "Frost Giant",
			size: "Huge", type: "Giant",
			ac: 15, hp: 138, init: -1, cr: "8",
			alignment: alignments.ne,
			environments: [ "arctic", "mountain", "planar" ],
			id: "8a2720eb-fb5c-4a79-8560-b3d1443d5e76",
		},
		{
			section: "Giants", name: "Hill Giant",
			size: "Huge", type: "Giant",
			ac: 13, hp: 105, init: -1, cr: "5",
			alignment: alignments.ce,
			environments: [ "arctic", "coast", "grassland" ],
			id: "c7296867-6041-418d-b255-b675639cfc2c",
		},
		{
			section: "Giants", name: "Stone Giant",
			size: "Huge", type: "Giant",
			ac: 17, hp: 126, init: 2, cr: "7",
			alignment: alignments.n,
			environments: [ "cave", "mountain", "underground" ],
			id: "c29cb38d-3b6a-459a-8643-843d256ab995",
		},
		{
			section: "Giants", name: "Storm Giant",
			size: "Huge", type: "Giant",
			ac: 16, hp: 230, init: 2, cr: "13",
			alignment: alignments.cg,
			environments: [ "arctic", "coast", "desert", "mountain", "planar" ],
			id: "ce9784dc-ee70-416b-955d-c554089ec044",
		},
		{
			name: "Gibbering Mouther",
			size: "Medium", type: "Aberration",
			ac: 9, hp: 67, init: -1, cr: "2",
			alignment: alignments.n,
			environments: [ "cave", "dungeon", "underground", "planar" ],
			id: "3394673a-e802-409a-b0b2-8d3f972a86fc",
		},
		{
			section: "Gith", name: "Githyanki Knight",
			size: "Medium", type: "Humanoid", tags: [ "Gith" ],
			ac: 18, hp: 91, init: 2, cr: "8",
			alignment: alignments.le,
			environments: [ "xswamp", "planar" ],
			id: "54fd43f7-d101-461d-b6db-e64f095eed84",
		},
		{
			section: "Gith", name: "Githyanki Warrior",
			size: "Medium", type: "Humanoid", tags: [ "Gith" ],
			ac: 17, hp: 49, init: 2, cr: "3",
			alignment: alignments.le,
			environments: [ "planar" ],
			id: "a3e7690f-8fc3-4a63-ba8c-75edbdbd755b",
		},
		{
			section: "Gith", name: "Githzerai Monk",
			size: "Medium", type: "Humanoid", tags: [ "Gith" ],
			ac: 14, hp: 38, init: 2, cr: "2",
			alignment: alignments.ln,
			environments: [ "planar" ],
			id: "09632ffa-87af-47aa-b906-1e343f742ab5",
		},
		{
			section: "Gith", name: "Githzerai Zerth",
			size: "Medium", type: "Humanoid", tags: [ "Gith" ],
			ac: 17, hp: 84, init: 4, cr: "6",
			alignment: alignments.ln,
			environments: [ "planar" ],
			id: "3058ccdb-7705-4545-8b7d-a09345c676dc",
		},
		{
			section: "Gnolls", name: "Gnoll",
			size: "Medium", type: "Humanoid", tags: [ "Gnoll" ],
			ac: 15, hp: 22, init: 1, cr: "1/2",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "urban" ],
			id: "07256557-e839-43d0-b84b-e91f3e7866fc",
		},
		{
			section: "Gnolls", name: "Gnoll Fang of Yeenoghu",
			size: "Medium", type: "Fiend", tags: [ "Gnoll" ],
			ac: 14, hp: 65, init: 2, cr: "4",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "urban" ],
			id: "e6e7eb98-e83c-4f36-ab56-35f50982c411",
		},
		{
			section: "Gnolls", name: "Gnoll Pack Lord",
			size: "Medium", type: "Humanoid", tags: [ "Gnoll" ],
			ac: 15, hp: 49, init: 2, cr: "2",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "urban" ],
			id: "a07c63be-7fd9-441a-bbe0-469a0e732bbb",
		},
		{
			section: "Gnome, Deep (Svirfneblin)", name: "Deep Gnome (Svirfneblin)",
			size: "Small", type: "Humanoid", tags: [ "Gnome" ],
			ac: 15, hp: 16, init: 2, cr: "1/2",
			alignment: alignments.ng,
			environments: [ "cave", "dungeon", "underground", "planar" ],
			id: "dd4a1c24-730a-467c-ac2f-8417fac0fdf8",
		},
		{
			section: "Goblins", name: "Goblin",
			size: "Small", type: "Humanoid", tags: [ "Goblinoid" ],
			ac: 15, hp: 7, init: 2, cr: "1/4",
			alignment: alignments.ne,
			environments: [ "cave", "dungeon", "forest", "grassland", "mountain", "ruins", "urban" ],
			id: "9cf6c94e-b019-47e1-a746-ab4d02f684a9",
		},
		{
			section: "Goblins", name: "Goblin Boss",
			size: "Small", type: "Humanoid", tags: [ "Goblinoid" ],
			ac: 17, hp: 21, init: 2, cr: "1",
			alignment: alignments.ne,
			environments: [ "cave", "dungeon", "forest", "grassland", "mountain", "ruins", "urban" ],
			id: "0ad711a0-1b8b-418c-836e-b95ff9abb066",
		},
		{
			section: "Golems", name: "Clay Golem",
			size: "Large", type: "Construct",
			ac: 14, hp: 133, init: -1, cr: "9",
			environments: [ "dungeon", "ruins", "urban" ],
			id: "7272ad74-80e0-4170-a9af-8566bc84d236",
		},
		{
			section: "Golems", name: "Flesh Golem",
			size: "Medium", type: "Construct",
			ac: 9, hp: 93, init: -1, cr: "5",
			environments: [ "dungeon", "ruins" ],
			id: "1a0097d3-c91a-4515-89cf-a63c4badc355",
		},
		{
			section: "Golems", name: "Iron Golem",
			size: "Large", type: "Construct",
			ac: 20, hp: 210, init: -1, cr: "16",
			environments: [ "dungeon", "ruins", "urban" ],
			id: "d9f13daf-d1b1-490c-87a7-33e8d28bb4ee",
		},
		{
			section: "Golems", name: "Stone Golem",
			size: "Large", type: "Construct",
			ac: 17, hp: 178, init: -1, cr: "10",
			environments: [ "dungeon", "ruins", "urban" ],
			id: "235ac710-1418-4bda-b0e5-3ded0ccbe1f9",
		},
		{
			name: "Gorgon",
			size: "Large", type: "Monstrosity",
			ac: 19, hp: 114, init: 0, cr: "5",
			environments: [ "mountain", "ruins" ],
			id: "7065db5f-03fc-4fc5-964d-8bdf5d47f701",
		},
		{
			name: "Grell",
			size: "Medium", type: "Aberration",
			ac: 12, hp: 55, init: 2, cr: "3",
			alignment: alignments.ne,
			environments: [ "dungeon", "underground" ],
			id: "58efcfe3-54aa-4680-82c0-4ac9cf417bcd",
		},
		{
			section: "Grick", name: "Grick",
			size: "Medium", type: "Monstrosity",
			ac: 14, hp: 27, init: 2, cr: "2",
			alignment: alignments.n,
			environments: [ "cave", "dungeon", "underground" ],
			id: "9ab9a61b-5298-44e9-8950-167e4a4e9c98",
		},
		{
			section: "Grick", name: "Grick Alpha",
			size: "Large", type: "Monstrosity",
			ac: 18, hp: 75, init: 3, cr: "7",
			alignment: alignments.n,
			environments: [ "cave", "dungeon", "underground" ],
			id: "a227bfa9-bdbe-4a27-9e06-f4e65de57280",
		},
		{
			name: "Griffon",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 59, init: 2, cr: "2",
			environments: [ "arctic", "coast", "grassland", "mountain" ],
			id: "9084361f-6e4a-47ee-9e58-341f346278b2",
		},
		{
			name: "Grimlock",
			size: "Medium", type: "Humanoid", tags: [ "Grimlock" ],
			ac: 11, hp: 11, init: 1, cr: "1/4",
			alignment: alignments.ne,
			environments: [ "cave", "dungeon", "underground" ],
			id: "f3f05353-e662-4b51-bdf2-19e3be7769eb",
		},
		{
			section: "Hags", name: "Green Hag",
			size: "Medium", type: "Fey",
			ac: 17, hp: 82, init: 1, cr: "3",
			alignment: alignments.ne,
			environments: [ "forest", "swamp" ],
			id: "9447b8b2-f96c-4607-b210-966d201d6da6",
		},
		{
			section: "Hags", name: "Green Hag (coven)",
			size: "Medium", type: "Fey",
			ac: 17, hp: 82, init: 1, cr: "5",
			alignment: alignments.ne,
			environments: [ "forest", "swamp" ],
			id: "af9dbb65-ebf7-468e-9746-131a66a9facb",
		},
		{
			section: "Hags", name: "Night Hag",
			size: "Medium", type: "Fiend",
			ac: 17, hp: 112, init: 2, cr: "5",
			alignment: alignments.ne,
			environments: [ "underground", "planar" ],
			id: "c419ea32-d524-462f-b65d-e88641fa177c",
		},
		{
			section: "Hags", name: "Night Hag (coven)",
			size: "Medium", type: "Fiend",
			ac: 17, hp: 112, init: 2, cr: "7",
			alignment: alignments.ne,
			environments: [ "underground", "planar" ],
			id: "ff6fee89-50c4-4bbb-a2b0-07646c55b4e2",
		},
		{
			section: "Hags", name: "Sea Hag",
			size: "Medium", type: "Fey",
			ac: 14, hp: 52, init: 1, cr: "2",
			alignment: alignments.ce,
			environments: [ "aquatic", "coast", "underground" ],
			id: "6e15161a-e1b2-4a0c-94b0-db75d2e6ccb3",
		},
		{
			section: "Hags", name: "Sea Hag (coven)",
			size: "Medium", type: "Fey",
			ac: 14, hp: 52, init: 1, cr: "4",
			alignment: alignments.ce,
			environments: [ "aquatic", "coast", "underground" ],
			id: "0f788005-3e4c-47b0-8ffe-8266c424d825",
		},
		{
			section: "Half-Dragon", name: "Half-Red Dragon Veteran",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 18, hp: 65, init: 1, cr: "5",
			alignment: alignments.any,
			environments: [ "arctic", "coast", "desert", "grassland", "mountain", "urban" ],
			id: "1a52d02f-8c55-41cb-80c5-48127774767b",
		},
		{
			name: "Harpy",
			size: "Medium", type: "Monstrosity",
			ac: 11, hp: 38, init: 1, cr: "1",
			alignment: alignments.ce,
			environments: [ "coast", "forest", "mountain" ],
			id: "3279999e-4dd9-4149-8ce5-f0867c108d30",
		},
		{
			name: "Hell Hound",
			size: "Medium", type: "Fiend",
			ac: 15, hp: 45, init: 1, cr: "3",
			alignment: alignments.le,
			environments: [ "dungeon", "urban", "planar" ],
			id: "5545c172-5478-4ac0-8db5-7b2c8e90394c",
		},
		{
			name: "Helmed Horror",
			size: "Medium", type: "Construct",
			ac: 20, hp: 60, init: 1, cr: "4",
			alignment: alignments.n,
			environments: [ "dungeon", "ruins", "urban" ],
			id: "82ec416b-64ff-4738-b308-9cd44ef5957d",
		},
		{
			section: "Hobgoblins", name: "Hobgoblin",
			size: "Medium", type: "Humanoid", tags: [ "Goblinoid" ],
			ac: 18, hp: 11, init: 1, cr: "1/2",
			alignment: alignments.le,
			environments: [ "arctic", "coast", "grassland", "mountain", "urban" ],
			id: "127e4789-95e3-48e4-8937-7d85ccb3bea0",
		},
		{
			section: "Hobgoblins", name: "Hobgoblin Captain",
			size: "Medium", type: "Humanoid", tags: [ "Goblinoid" ],
			ac: 17, hp: 39, init: 2, cr: "3",
			alignment: alignments.le,
			environments: [ "arctic", "coast", "grassland", "mountain", "urban" ],
			id: "5341cb95-c090-4295-ba1d-83d978988a10",
		},
		{
			section: "Hobgoblins", name: "Hobgoblin Warlord",
			size: "Medium", type: "Humanoid", tags: [ "Goblinoid" ],
			ac: 20, hp: 97, init: 2, cr: "6",
			alignment: alignments.le,
			environments: [ "arctic", "coast", "grassland", "mountain", "urban" ],
			id: "3a5c21f3-f610-47ec-ba99-8ea6ceb9a5a2",
		},
		{
			name: "Hippogriff",
			size: "Large", type: "Monstrosity",
			ac: 11, hp: 19, init: 1, cr: "1",
			environments: [ "mountain" ],
			id: "5d506ff9-4a90-460e-82e4-68bdf0bac7cf",
		},
		{
			name: "Homunculus",
			size: "Tiny", type: "Construct",
			ac: 13, hp: 5, init: 2, cr: "0",
			alignment: alignments.n,
			environments: [ "dungeon", "urban" ],
			id: "733da9a7-a197-4be8-b8f0-00e492801eec",
		},
		{
			name: "Hook Horror",
			size: "Large", type: "Monstrosity",
			ac: 15, hp: 75, init: 0, cr: "3",
			alignment: alignments.n,
			environments: [ "dungeon", "underground" ],
			id: "3e4d8e86-de04-4ccb-aee2-2f4049b6769b",
		},
		{
			name: "Hydra",
			size: "Huge", type: "Monstrosity",
			ac: 15, hp: 172, init: 1, cr: "8",
			environments: [ "aquatic", "cave", "coast", "dungeon", "forest", "mountain", "ruins", "swamp", "underground" ],
			id: "3e632ad7-8ffd-40b7-8a37-45386577bd45",
		},
		{
			name: "Intellect Devourer",
			size: "Tiny", type: "Aberration",
			ac: 12, hp: 21, init: 2, cr: "2",
			alignment: alignments.le,
			environments: [ "dungeon", "underground" ],
			id: "8ccb4fb2-f8aa-421d-a60e-76255953b97a",
		},
		{
			name: "Invisible Stalker",
			size: "Medium", type: "Elemental",
			ac: 14, hp: 104, init: 4, cr: "6",
			alignment: alignments.n,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban", "planar" ],
			id: "ee83fc27-4e79-4a9d-96ec-909aed739470",
		},
		{
			name: "Jackalwere",
			size: "Medium", type: "Humanoid", tags: [ "Shapechanger" ],
			ac: 12, hp: 18, init: 2, cr: "1/2",
			alignment: alignments.ce,
			environments: [ "desert", "grassland", "urban" ],
			id: "977db5ba-5f5a-4a4d-851a-854696a05c01",
		},
		{
			name: "Kenku",
			size: "Medium", type: "Humanoid", tags: [ "Kenku" ],
			ac: 13, hp: 13, init: 3, cr: "1/4",
			alignment: alignments.cn,
			environments: [ "arctic", "coast", "desert", "forest", "grassland", "mountain", "ruins", "urban" ],
			id: "0d1a69f3-7416-4bd7-9166-4e7b0fdd0af3",
		},
		{
			section: "Kobolds", name: "Kobold",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ],
			ac: 12, hp: 5, init: 2, cr: "1/8",
			alignment: alignments.le,
			environments: [ "cave", "dungeon", "mountain", "underground" ],
			id: "baa3449e-bfd5-408d-8b7e-206a3bebf8ca",
		},
		{
			section: "Kobolds", name: "Winged Kobold",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ],
			ac: 13, hp: 7, init: 3, cr: "1/4",
			alignment: alignments.le,
			environments: [ "mountain", "underground" ],
			id: "e0b6446f-3791-479d-9e03-9a71c0de9f52",
		},
		{
			name: "Kraken",
			size: "Gargantuan", type: "Monstrosity", tags: [ "Titan" ],
			ac: 18, hp: 472, init: 0, cr: "23",
			alignment: alignments.ce,
			environments: [ "aquatic", "coast" ],
			legendary: true,
			lair: true,
			id: "db248a11-5c00-433b-91e5-606ac09a3df9",
		},
		{
			section: "Kuo-toa", name: "Kuo-toa",
			size: "Medium", type: "Humanoid", tags: [ "Kuo-toa" ],
			ac: 13, hp: 18, init: 0, cr: "1/4",
			alignment: alignments.ne,
			environments: [ "aquatic", "coast" ],
			id: "5bb857a3-c242-4b8e-9ad7-08134220a539",
		},
		{
			section: "Kuo-toa", name: "Kuo-toa Archpriest",
			size: "Medium", type: "Humanoid", tags: [ "Kuo-toa" ],
			ac: 13, hp: 97, init: 2, cr: "6",
			alignment: alignments.ne,
			environments: [ "aquatic", "coast" ],
			id: "ef27b3eb-48e1-4415-a176-5df27a41d84f",
		},
		{
			section: "Kuo-toa", name: "Kuo-toa Whip",
			size: "Medium", type: "Humanoid", tags: [ "Kuo-toa" ],
			ac: 11, hp: 65, init: 0, cr: "1",
			alignment: alignments.ne,
			environments: [ "aquatic", "coast" ],
			id: "18f26ee3-cb25-4a4b-a37e-eeef773cb3ad",
		},
		{
			name: "Lamia",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 97, init: 1, cr: "4",
			alignment: alignments.ce,
			environments: [ "desert", "ruins" ],
			id: "78334f11-4007-4c8d-a133-55c8581d13bf",
		},
		{
			section: "Lizardfolk", name: "Lizardfolk",
			size: "Medium", type: "Humanoid", tags: [ "Lizardfolk" ],
			ac: 15, hp: 22, init: 0, cr: "1/2",
			alignment: alignments.n,
			environments: [ "coast", "dungeon", "forest", "grassland", "swamp" ],
			id: "5ec95d84-a847-496d-9cca-f4a3c13a81d1",
		},
		{
			section: "Lizardfolk", name: "Lizardfolk Shaman",
			size: "Medium", type: "Humanoid", tags: [ "Lizardfolk" ],
			ac: 13, hp: 27, init: 0, cr: "2",
			alignment: alignments.n,
			environments: [ "coast", "dungeon", "forest", "grassland", "swamp" ],
			id: "e94dadeb-692d-43cf-8d59-91f1624c795d",
		},
		{
			section: "Lizardfolk", name: "Lizard King/Queen",
			size: "Medium", type: "Humanoid", tags: [ "Lizardfolk" ],
			ac: 15, hp: 75, init: 1, cr: "4",
			alignment: alignments.ce,
			environments: [ "coast", "dungeon", "forest", "grassland", "swamp" ],
			id: "9e448cc3-7e92-4af8-8610-601efd00aef8",
		},
		{
			section: "Lycanthropes", name: "Werebear",
			size: "Medium", type: "Humanoid", tags: [ "Human", "Shapechanger" ],
			ac: "10 in humanoid form, 11 in bear and hybrid form", hp: 135, init: 0, cr: "5",
			alignment: alignments.ng,
			environments: [ "cave", "forest", "mountain", "urban" ],
			id: "db897f13-24c8-4332-808f-682061af4b36",
		},
		{
			section: "Lycanthropes", name: "Wereboar",
			size: "Medium", type: "Humanoid", tags: [ "Human", "Shapechanger" ],
			ac: "10 in humanoid form, 11 in boar and hybrid form", hp: 78, init: 0, cr: "4",
			alignment: alignments.ne,
			environments: [ "forest", "grassland", "swamp", "urban" ],
			id: "59408dc1-6bee-467c-9e7e-108d7870d5a7",
		},
		{
			section: "Lycanthropes", name: "Wererat",
			size: "Medium", type: "Humanoid", tags: [ "Human", "Shapechanger" ],
			ac: 12, hp: 33, init: 2, cr: "2",
			alignment: alignments.le,
			environments: [ "cave", "dungeon", "ruins", "swamp", "underground", "urban" ],
			id: "c8e2837f-ea3b-42a7-8a9b-84056d186006",
		},
		{
			section: "Lycanthropes", name: "Weretiger",
			size: "Medium", type: "Humanoid", tags: [ "Human", "Shapechanger" ],
			ac: 12, hp: 120, init: 2, cr: "4",
			alignment: alignments.n,
			environments: [ "forest", "urban" ],
			id: "e63e1150-3b0b-46e0-a2cb-2a2f30cf5c69",
		},
		{
			section: "Lycanthropes", name: "Werewolf",
			size: "Medium", type: "Humanoid", tags: [ "Human", "Shapechanger" ],
			ac: "11 in humanoid form, 12 in wolf or hybrid form", hp: 58, init: 1, cr: "3",
			alignment: alignments.ce,
			environments: [ "dungeon", "forest", "grassland", "urban" ],
			id: "80a17f83-7b94-497e-a10d-3dd1f3a8a889",
		},
		{
			name: "Lich",
			size: "Medium", type: "Undead",
			ac: 17, hp: 135, init: 3, cr: "21",
			alignment: alignments.any_evil,
			environments: [ "dungeon", "ruins", "urban" ],
			legendary: true,
			lair: false,
			id: "a5dc844c-9763-4ce9-81e9-c83ec00976af",
		},
		{
			name: "Lich (in lair)",
			size: "Medium", type: "Undead",
			ac: 17, hp: 135, init: 3, cr: "22",
			alignment: alignments.any_evil,
			environments: [ "dungeon", "ruins", "urban" ],
			legendary: true,
			lair: true,
			id: "3a25a6fc-7a1d-4437-9010-213e7a9ec153",
		},
		{
			name: "Magmin",
			size: "Small", type: "Elemental",
			ac: 14, hp: 9, init: 2, cr: "1/2",
			alignment: alignments.cn,
			environments: [ "dungeon", "ruins", "urban", "planar" ],
			id: "f9b4996c-a11c-4f18-ab8b-fa627f384da7",
		},
		{
			name: "Manticore",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 68, init: 3, cr: "3",
			alignment: alignments.le,
			environments: [ "arctic", "cave", "coast", "grassland", "mountain", "ruins" ],
			id: "70a0cbe2-5320-465d-afdf-7a4643da02fe",
		},
		{
			name: "Medusa",
			size: "Medium", type: "Monstrosity",
			ac: 15, hp: 127, init: 2, cr: "6",
			alignment: alignments.le,
			environments: [ "cave", "dungeon", "mountain", "ruins", "urban" ],
			id: "15a09594-1143-4b08-8f4e-0f5d9891b4d1",
		},
		{
			section: "Mephits", name: "Dust Mephit",
			size: "Small", type: "Elemental",
			ac: 12, hp: 17, init: 2, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "dungeon", "ruins", "urban", "planar" ],
			id: "82d58511-f0e1-4e2c-a4fc-8908210146a1",
		},
		{
			section: "Mephits", name: "Ice Mephit",
			size: "Small", type: "Elemental",
			ac: 11, hp: 21, init: 1, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "arctic", "dungeon", "urban", "planar" ],
			id: "85ca0247-73d6-43c3-b25d-4a9026586669",
		},
		{
			section: "Mephits", name: "Magma Mephit",
			size: "Small", type: "Elemental",
			ac: 11, hp: 22, init: 1, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "cave", "dungeon", "mountain", "urban", "planar" ],
			id: "1f7aa396-edd4-47f6-88b6-f98793df12e5",
		},
		{
			section: "Mephits", name: "Mud Mephit",
			size: "Small", type: "Elemental",
			ac: 11, hp: 27, init: 1, cr: "1/4",
			alignment: alignments.ne,
			environments: [ "coast", "dungeon", "forest", "swamp", "urban", "planar" ],
			id: "edc88a1f-98d9-44f8-b376-e3b11cb24401",
		},
		{
			section: "Mephits", name: "Smoke Mephit",
			size: "Small", type: "Elemental",
			ac: 12, hp: 2, init: 2, cr: "1/4",
			alignment: alignments.ne,
			environments: [ "dungeon", "urban", "planar" ],
			id: "bdda67cb-ae81-4107-860a-eee6456ea92b",
		},
		{
			section: "Mephits", name: "Steam Mephit",
			size: "Small", type: "Elemental",
			ac: 10, hp: 21, init: 0, cr: "1/4",
			alignment: alignments.ne,
			environments: [ "dungeon", "urban", "planar" ],
			id: "d28e71ee-8388-4534-bb38-209de47bbe5e",
		},
		{
			name: "Merfolk",
			size: "Medium", type: "Humanoid", tags: [ "Merfolk" ],
			ac: 11, hp: 11, init: 1, cr: "1/8",
			alignment: alignments.n,
			environments: [ "aquatic" ],
			id: "620fe04b-ad34-4183-8af7-980b3609c482",
		},
		{
			name: "Merrow",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 45, init: 0, cr: "2",
			alignment: alignments.ce,
			environments: [ "aquatic" ],
			id: "8e619f31-7241-4022-91a2-de617597b090",
		},
		{
			section: "Mind Flayer", name: "Mind Flayer",
			size: "Medium", type: "Aberration",
			ac: 15, hp: 71, init: 1, cr: "7",
			alignment: alignments.le,
			environments: [ "dungeon", "underground", "urban" ],
			id: "00235a58-a598-495b-ba4e-7d56c15cbfc8",
		},
		{
			section: "Mind Flayer", name: "Mind Flayer Arcanist",
			size: "Medium", type: "Aberration",
			ac: 15, hp: 71, init: 1, cr: "8",
			alignment: alignments.le,
			environments: [ "dungeon", "underground", "urban" ],
			id: "699c0e8b-def1-41ff-a1bc-23d5315c973e",
		},
		{
			name: "Mimic",
			size: "Medium", type: "Monstrosity", tags: [ "Shapechanger" ],
			ac: 12, hp: 58, init: 1, cr: "2",
			alignment: alignments.n,
			environments: [ "dungeon" ],
			id: "ef5521a7-9b12-498b-907d-18acfdf73876",
		},
		{
			name: "Minotaur",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 76, init: 0, cr: "3",
			alignment: alignments.ce,
			environments: [ "cave", "dungeon", "ruins", "underground" ],
			id: "852cfe83-a0d9-4170-86d7-e16b864ea7ef",
		},
		{
			section: "Modrons", name: "Monodrone",
			size: "Medium", type: "Construct",
			ac: 15, hp: 5, init: 1, cr: "1/8",
			alignment: alignments.ln,
			environments: [ "planar" ],
			id: "36cf9acb-d215-4366-b8d8-cdd283bcaf82",
		},
		{
			section: "Modrons", name: "Duodrone",
			size: "Medium", type: "Construct",
			ac: 15, hp: 11, init: 1, cr: "1/4",
			alignment: alignments.ln,
			environments: [ "planar" ],
			id: "1c8b43c4-f7ad-40cb-b5c6-ceab1f78c94f",
		},
		{
			section: "Modrons", name: "Tridrone",
			size: "Medium", type: "Construct",
			ac: 15, hp: 16, init: 1, cr: "1/2",
			alignment: alignments.ln,
			environments: [ "planar" ],
			id: "8d9f2854-d059-4487-a326-ffd80b7ff95d",
		},
		{
			section: "Modrons", name: "Quadrone",
			size: "Medium", type: "Construct",
			ac: 16, hp: 22, init: 2, cr: "1",
			alignment: alignments.ln,
			environments: [ "planar" ],
			id: "06adb243-3e58-4b29-8fbe-34331bcb1b3e",
		},
		{
			section: "Modrons", name: "Pentadrone",
			size: "Large", type: "Construct",
			ac: 16, hp: 32, init: 2, cr: "2",
			alignment: alignments.ln,
			environments: [ "planar" ],
			id: "8d7daed1-b832-454d-86cf-be5c99570402",
		},
		{
			section: "Mummies", name: "Mummy",
			size: "Medium", type: "Undead",
			ac: 11, hp: 58, init: -1, cr: "3",
			alignment: alignments.le,
			environments: [ "desert", "dungeon" ],
			id: "d86cd0d2-a792-4585-809e-e59919189936",
		},
		{
			section: "Mummies", name: "Mummy Lord",
			size: "Medium", type: "Undead",
			ac: 17, hp: 97, init: 0, cr: "15",
			alignment: alignments.le,
			environments: [ "desert", "dungeon" ],
			legendary: true,
			lair: true,
			id: "f210a3a6-0a2d-4d9c-9ab0-0e837eb33749",
		},
		{
			section: "Myconids", name: "Myconid Sprout",
			size: "Small", type: "Plant",
			ac: 10, hp: 7, init: 0, cr: "0",
			alignment: alignments.ln,
			environments: [ "underground" ],
			id: "4704981f-beb2-4b2a-98ce-30901162fe10",
		},
		{
			section: "Myconids", name: "Quaggoth Spore Servant",
			size: "Medium", type: "Plant",
			ac: 13, hp: 45, init: 1, cr: "1",
			environments: [ "underground" ],
			id: "fdecca35-c5ec-462b-958c-6c3f3b676158",
		},
		{
			section: "Myconids", name: "Myconid Adult",
			size: "Medium", type: "Plant",
			ac: 12, hp: 22, init: 0, cr: "1/2",
			alignment: alignments.ln,
			environments: [ "underground" ],
			id: "13628cc9-ab44-4869-8bfd-cf155aca78c7",
		},
		{
			section: "Myconids", name: "Myconid Sovereign",
			size: "Large", type: "Plant",
			ac: 13, hp: 60, init: 0, cr: "2",
			alignment: alignments.ln,
			environments: [ "underground" ],
			id: "168dfe89-609f-4112-8925-25595fe88acd",
		},
		{
			section: "Nagas", name: "Bone Naga",
			size: "Large", type: "Undead",
			ac: 15, hp: 58, init: 3, cr: "4",
			alignment: alignments.le,
			environments: [ "dungeon", "ruins" ],
			id: "dd409232-47c5-4cc2-adcf-c13ef6b3b489",
		},
		{
			section: "Nagas", name: "Guardian Naga",
			size: "Large", type: "Monstrosity",
			ac: 15, hp: 75, init: 3, cr: "10",
			alignment: alignments.lg,
			environments: [ "cave", "coast", "forest", "ruins" ],
			id: "9f2cb577-d9e2-48bb-ba99-6fc9ba74ec69",
		},
		{
			section: "Nagas", name: "Spirit Naga",
			size: "Large", type: "Monstrosity",
			ac: 18, hp: 127, init: 4, cr: "8",
			alignment: alignments.ce,
			environments: [ "cave", "dungeon", "ruins", "underground" ],
			id: "552f997f-6cf1-4150-8144-aea22f652471",
		},
		{
			name: "Nightmare",
			size: "Large", type: "Fiend",
			ac: 13, hp: 68, init: 2, cr: "3",
			alignment: alignments.ne,
			environments: [ "swamp", "planar" ],
			id: "4ecef288-1f16-48b2-be23-f36b7fde5ced",
		},
		{
			name: "Nothic",
			size: "Medium", type: "Aberration",
			ac: 15, hp: 45, init: 3, cr: "2",
			alignment: alignments.ne,
			environments: [ "dungeon", "ruins", "urban" ],
			id: "ed0bb2d0-aef6-4a4b-a9cb-4a38045cc29c",
		},
		{
			section: "Ogres", name: "Half-Ogre",
			size: "Large", type: "Giant",
			ac: 12, hp: 30, init: 0, cr: "1",
			alignment: alignments.ce,
			environments: [ "arctic", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "urban" ],
			id: "89e0d155-e208-41f0-86fc-af2a62eb4c73",
		},
		{
			section: "Ogres", name: "Ogre",
			size: "Large", type: "Giant",
			ac: 11, hp: 59, init: -1, cr: "2",
			alignment: alignments.ce,
			environments: [ "dungeon", "forest", "mountain", "swamp" ],
			id: "545c030a-1674-4838-9d43-752db8265f87",
		},
		{
			name: "Oni",
			size: "Large", type: "Giant",
			ac: 16, hp: 110, init: 0, cr: "7",
			alignment: alignments.le,
			environments: [ "dungeon", "grassland", "ruins", "urban" ],
			id: "06db3698-ec58-48d4-867a-f6fdd875823b",
		},
		{
			section: "Oozes", name: "Black Pudding",
			size: "Large", type: "Ooze",
			ac: 7, hp: 85, init: -3, cr: "4",
			environments: [ "dungeon" ],
			id: "e5612386-a501-4f25-afd2-8cd9977ec4af",
		},
		{
			section: "Oozes", name: "Gelatinous Cube",
			size: "Large", type: "Ooze",
			ac: 6, hp: 84, init: -4, cr: "2",
			environments: [ "dungeon" ],
			id: "2230d3a4-822b-48b2-99f5-373ffb6695a8",
		},
		{
			section: "Oozes", name: "Gray Ooze",
			size: "Medium", type: "Ooze",
			ac: 8, hp: 22, init: -2, cr: "1/2",
			environments: [ "dungeon" ],
			id: "d82d19dd-2e7e-407f-9861-b7e2ee599e5c",
		},
		{
			section: "Oozes", name: "Ochre Jelly",
			size: "Large", type: "Ooze",
			ac: 8, hp: 45, init: -2, cr: "2",
			environments: [ "dungeon" ],
			id: "0474b4f6-5b72-46ac-9405-5e39b28750c2",
		},
		{
			section: "Orcs", name: "Orc",
			size: "Medium", type: "Humanoid", tags: [ "Orc" ],
			ac: 13, hp: 15, init: 1, cr: "1/2",
			alignment: alignments.ce,
			environments: [ "arctic", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "urban" ],
			id: "2fc71e84-7157-4d3f-9042-d9b17236f5f0",
		},
		{
			section: "Orcs", name: "Orc Eye of Gruumsh",
			size: "Medium", type: "Humanoid", tags: [ "Orc" ],
			ac: 16, hp: 45, init: 1, cr: "2",
			alignment: alignments.ce,
			environments: [ "arctic", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "urban" ],
			id: "18e67457-97e5-4efc-bb6c-084a910fbbd1",
		},
		{
			section: "Orcs", name: "Orc War Chief",
			size: "Medium", type: "Humanoid", tags: [ "Orc" ],
			ac: 16, hp: 93, init: 1, cr: "4",
			alignment: alignments.ce,
			environments: [ "arctic", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "urban" ],
			id: "21ebdbb0-2305-4922-ae09-3c73eab5fb06",
		},
		{
			section: "Orcs", name: "Orog",
			size: "Medium", type: "Humanoid", tags: [ "Orc" ],
			ac: 18, hp: 42, init: 1, cr: "2",
			alignment: alignments.ce,
			environments: [ "arctic", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "urban" ],
			id: "33072b76-ec36-4c54-9318-83d04d6ef44d",
		},
		{
			name: "Otyugh",
			size: "Large", type: "Aberration",
			ac: 14, hp: 114, init: 0, cr: "5",
			alignment: alignments.n,
			environments: [ "cave", "dungeon", "ruins", "swamp", "underground" ],
			id: "9dca97ac-f3fa-4be6-8a39-09291505f159",
		},
		{
			name: "Owlbear",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 59, init: 1, cr: "3",
			environments: [ "forest", "mountain" ],
			id: "293ad61d-ee17-4a20-954a-ab22f6edaa8d",
		},
		{
			name: "Pegasus",
			size: "Large", type: "Celestial",
			ac: 12, hp: 59, init: 2, cr: "2",
			alignment: alignments.cg,
			environments: [ "mountain" ],
			id: "9f07db07-b9f9-4913-8603-3aeef1b217f3",
		},
		{
			name: "Peryton",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 33, init: 1, cr: "2",
			alignment: alignments.ce,
			environments: [ "mountain" ],
			id: "df1f8a95-9f6b-4699-af85-da4368f16cfd",
		},
		{
			name: "Piercer",
			size: "Medium", type: "Monstrosity",
			ac: 15, hp: 22, init: 1, cr: "1/2",
			environments: [ "cave", "underground" ],
			id: "cc49ec49-caa4-404b-92e6-9e7b4604cb12",
		},
		{
			name: "Pixie",
			size: "Tiny", type: "Fey",
			ac: 15, hp: 1, init: 5, cr: "1/4",
			alignment: alignments.ng,
			environments: [ "coast", "forest", "grassland", "swamp" ],
			id: "d851b9c3-0c0e-4378-a991-9b0d05c80931",
		},
		{
			name: "Pseudodragon",
			size: "Tiny", type: "Dragon",
			ac: 13, hp: 7, init: 2, cr: "1/4",
			alignment: alignments.ng,
			environments: [ "urban" ],
			id: "ada98bc9-cb5c-4f02-8230-a349f85df99c",
		},
		{
			name: "Purple Worm",
			size: "Gargantuan", type: "Monstrosity",
			ac: 18, hp: 247, init: -2, cr: "15",
			environments: [ "underground" ],
			id: "0de2b8ec-9d78-497b-83a3-e7eb530a4c85",
		},
		{
			section: "Quaggoth", name: "Quaggoth",
			size: "Medium", type: "Humanoid", tags: [ "Quaggoth" ],
			ac: 13, hp: 45, init: 1, cr: "2",
			alignment: alignments.cn,
			environments: [ "dungeon", "urban" ],
			id: "0ff27a87-12ee-4196-a998-8d41c2ae1ee1",
		},
		{
			section: "Quaggoth", name: "Quaggoth Thonot",
			size: "Medium", type: "Humanoid", tags: [ "Quaggoth" ],
			ac: 13, hp: 45, init: 1, cr: "3",
			alignment: alignments.cn,
			environments: [ "dungeon", "urban" ],
			id: "d9e9e29a-ba95-4740-86a8-927843168eb8",
		},
		{
			name: "Rakshasa",
			size: "Medium", type: "Fiend",
			ac: 16, hp: 110, init: 3, cr: "13",
			alignment: alignments.le,
			environments: [ "urban", "planar" ],
			id: "018d5cba-4e7e-4519-b181-fb0bb7bf4474",
		},
		{
			section: "Remorhazes", name: "Remorhaz",
			size: "Huge", type: "Monstrosity",
			ac: 17, hp: 195, init: 1, cr: "11",
			environments: [ "arctic" ],
			id: "148bab3f-70b0-45bb-af68-df93ae89c77f",
		},
		{
			section: "Remorhazes", name: "Young Remorhaz",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 93, init: 1, cr: "5",
			environments: [ "arctic", "cave" ],
			id: "c10d36ba-73da-4718-bf7f-f078791639dd",
		},
		{
			name: "Revenant",
			size: "Medium", type: "Undead",
			ac: 13, hp: 136, init: 2, cr: "5",
			alignment: alignments.n,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban" ],
			id: "89ebcb90-c381-450d-a303-e1cb0f470a6a",
		},
		{
			name: "Roc",
			size: "Gargantuan", type: "Monstrosity",
			ac: 15, hp: 248, init: 0, cr: "11",
			environments: [ "coast", "desert", "mountain" ],
			id: "77263f03-1681-4684-b9fe-8c089d8721a7",
		},
		{
			name: "Roper",
			size: "Large", type: "Monstrosity",
			ac: 20, hp: 93, init: -1, cr: "5",
			alignment: alignments.ne,
			environments: [ "cave", "underground" ],
			id: "8e7f5fd8-557c-4176-aee8-2a894afb6b99",
		},
		{
			name: "Rust Monster",
			size: "Medium", type: "Monstrosity",
			ac: 14, hp: 27, init: 1, cr: "1/2",
			environments: [ "dungeon", "underground" ],
			id: "0245be52-98ed-441c-b7b6-823866ac50b0",
		},
		{
			section: "Sahuagin", name: "Sahuagin",
			size: "Medium", type: "Humanoid", tags: [ "Sahuagin" ],
			ac: 12, hp: 22, init: 0, cr: "1/2",
			alignment: alignments.le,
			environments: [ "aquatic", "coast" ],
			id: "cf012d1a-c0c3-4426-afca-8ef34b863071",
		},
		{
			section: "Sahuagin", name: "Sahuagin Baron",
			size: "Large", type: "Humanoid", tags: [ "Sahuagin" ],
			ac: 16, hp: 76, init: 2, cr: "5",
			alignment: alignments.le,
			environments: [ "aquatic", "coast" ],
			id: "791f3452-b13b-417b-923b-137e2f2073fa",
		},
		{
			section: "Sahuagin", name: "Sahuagin Priestess",
			size: "Medium", type: "Humanoid", tags: [ "Sahuagin" ],
			ac: 12, hp: 33, init: 0, cr: "2",
			alignment: alignments.le,
			environments: [ "aquatic", "coast" ],
			id: "c234a705-22a1-423d-99d2-73699bb0b58e",
		},
		{
			section: "Salamanders", name: "Fire Snake",
			size: "Medium", type: "Elemental",
			ac: 14, hp: 22, init: 2, cr: "1",
			alignment: alignments.ne,
			environments: [ "forest", "planar" ],
			id: "20207713-fef6-4f14-a3b0-1417d18d755a",
		},
		{
			section: "Salamanders", name: "Salamander",
			size: "Large", type: "Elemental",
			ac: 15, hp: 90, init: 2, cr: "5",
			alignment: alignments.ne,
			environments: [ "forest", "planar" ],
			id: "15cade7d-8730-49a3-bd2b-643a9a62d8c4",
		},
		{
			name: "Satyr",
			size: "Medium", type: "Fey",
			ac: 14, hp: 31, init: 3, cr: "1/2",
			alignment: alignments.cn,
			environments: [ "forest", "grassland", "urban" ],
			id: "f373bc88-ba01-4e6a-8889-580be0265c59",
		},
		{
			name: "Scarecrow",
			size: "Medium", type: "Construct",
			ac: 11, hp: 36, init: 1, cr: "1",
			alignment: alignments.ce,
			environments: [ "grassland", "urban" ],
			id: "24d24844-c27d-4261-b71e-bdca6de3f2f7",
		},
		{
			name: "Shadow",
			size: "Medium", type: "Undead",
			ac: 12, hp: 16, init: 2, cr: "1/2",
			alignment: alignments.ce,
			environments: [ "dungeon", "ruins", "swamp", "urban" ],
			id: "c4551c2c-c686-4105-83f6-87c873f8809f",
		},
		{
			name: "Shambling Mound",
			size: "Large", type: "Plant",
			ac: 15, hp: 136, init: -1, cr: "5",
			environments: [ "forest", "swamp" ],
			id: "ea9c253b-1fe2-4e66-9331-61f6e3b02336",
		},
		{
			name: "Shield Guardian",
			size: "Large", type: "Construct",
			ac: 17, hp: 142, init: -1, cr: "7",
			environments: [ "dungeon", "ruins", "urban" ],
			id: "212a9d4e-60b7-4c1e-ac1c-67f26855e878",
		},
		{
			section: "Skeletons", name: "Skeleton",
			size: "Medium", type: "Undead",
			ac: 13, hp: 13, init: 2, cr: "1/4",
			alignment: alignments.le,
			environments: [ "dungeon", "ruins", "urban" ],
			id: "3e946348-1cc2-405f-9975-5a4c09445750",
		},
		{
			section: "Skeletons", name: "Minotaur Skeleton",
			size: "Large", type: "Undead",
			ac: 12, hp: 67, init: 0, cr: "2",
			alignment: alignments.le,
			environments: [ "dungeon", "underground", "urban" ],
			id: "8e06aaf8-6a32-44d7-8c40-0b829ac94413",
		},
		{
			section: "Skeletons", name: "Warhorse Skeleton",
			size: "Large", type: "Undead",
			ac: 13, hp: 22, init: 1, cr: "1/2",
			alignment: alignments.le,
			environments: [ "grassland", "ruins" ],
			id: "33ec8ed0-0cd0-4def-9da6-761cf73206da",
		},
		{
			section: "Slaadi", name: "Blue Slaad",
			size: "Large", type: "Aberration",
			ac: 15, hp: 123, init: 2, cr: "7",
			alignment: alignments.cn,
			environments: [ "planar" ],
			id: "36879d12-0c10-4f48-beff-bc39984968c7",
		},
		{
			section: "Slaadi", name: "Gray Slaad",
			size: "Medium", type: "Aberration",
			ac: 18, hp: 127, init: 3, cr: "9",
			alignment: alignments.cn,
			environments: [ "planar" ],
			id: "7087acfe-930d-49b7-9fab-a0351650c7ce",
		},
		{
			section: "Slaadi", name: "Green Slaad",
			size: "Large", type: "Aberration",
			ac: 16, hp: 127, init: 2, cr: "8",
			alignment: alignments.cn,
			environments: [ "planar" ],
			id: "69a7ed5e-16a9-466d-90a9-867136fb9469",
		},
		{
			section: "Slaadi", name: "Red Slaad",
			size: "Large", type: "Aberration",
			ac: 14, hp: 93, init: 1, cr: "5",
			alignment: alignments.cn,
			environments: [ "planar" ],
			id: "8ff160ae-eb45-4464-a436-e40c751cad1e",
		},
		{
			section: "Slaadi", name: "Slaad Tadpole",
			size: "Tiny", type: "Aberration",
			ac: 12, hp: 10, init: 2, cr: "1/8",
			alignment: alignments.cn,
			environments: [ "planar" ],
			id: "68b382e5-a0a4-4b9b-bc57-d9684105296c",
		},
		{
			section: "Slaadi", name: "Death Slaad",
			size: "Medium", type: "Aberration", tags: [ "Shapechanger" ],
			ac: 18, hp: 170, init: 2, cr: "10",
			alignment: alignments.ce,
			environments: [ "planar" ],
			id: "7eee83ee-5f71-458a-b0c7-ac04fd78301f",
		},
		{
			section: "Specter", name: "Poltergeist",
			size: "Medium", type: "Undead",
			ac: 12, hp: 22, init: 2, cr: "2",
			alignment: alignments.ce,
			environments: [ "dungeon", "ruins", "urban" ],
			id: "ed0ed3ff-2489-4a07-88f6-1e5e9b33580d",
		},
		{
			section: "Specter", name: "Specter",
			size: "Medium", type: "Undead",
			ac: 12, hp: 22, init: 2, cr: "1",
			alignment: alignments.ce,
			environments: [ "dungeon", "ruins", "urban" ],
			id: "3a005074-e1df-4b63-88a4-3dd4edbd237a",
		},
		{
			section: "Sphinxes", name: "Androsphinx",
			size: "Large", type: "Monstrosity",
			ac: 17, hp: 199, init: 0, cr: "17",
			alignment: alignments.ln,
			environments: [ "dungeon", "ruins" ],
			legendary: true,
			lair: true,
			id: "f0faeb6f-9112-467a-bf48-b4fb5e2f4b26",
		},
		{
			section: "Sphinxes", name: "Gynosphinx",
			size: "Large", type: "Monstrosity",
			ac: 17, hp: 136, init: 2, cr: "11",
			alignment: alignments.ln,
			environments: [ "dungeon", "ruins" ],
			legendary: true,
			lair: true,
			id: "adf26741-67bd-4908-92e7-231a28374808",
		},
		{
			name: "Sprite",
			size: "Tiny", type: "Fey",
			ac: 15, hp: 2, init: 4, cr: "1/4",
			alignment: alignments.ng,
			environments: [ "forest", "grassland", "swamp" ],
			id: "e91d49d6-b139-4457-bd9c-45fd656ec408",
		},
		{
			name: "Stirge",
			size: "Tiny", type: "Beast",
			ac: 14, hp: 2, init: 3, cr: "1/8",
			environments: [ "forest", "swamp" ],
			id: "b02dadd4-aa89-426c-ac9b-bfa07b8fe1fc",
		},
		{
			name: "Succubus/Incubus",
			size: "Medium", type: "Fiend", tags: [ "Shapechanger" ],
			ac: 15, hp: 66, init: 3, cr: "4",
			alignment: alignments.ne,
			environments: [ "dungeon", "urban", "planar" ],
			id: "63a62f8f-06b8-4ae2-a746-9c42448399d0",
		},
		{
			name: "Tarrasque",
			size: "Gargantuan", type: "Monstrosity",
			ac: 25, hp: 676, init: 0, cr: "30",
			environments: [ "aquatic", "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban", "planar" ],
			legendary: true,
			id: "962c28e0-17f2-4fa9-b76c-0017f1768650",
		},
		{
			name: "Thri-kreen",
			size: "Medium", type: "Humanoid", tags: [ "Thri-kreen" ],
			ac: 15, hp: 33, init: 2, cr: "1",
			alignment: alignments.cn,
			environments: [ "desert", "grassland" ],
			id: "28a1d46d-c0ae-4865-80d1-866629c4f817",
		},
		{
			name: "Treant",
			size: "Huge", type: "Plant",
			ac: 16, hp: 138, init: -1, cr: "9",
			alignment: alignments.cg,
			environments: [ "forest", "swamp" ],
			id: "b4a2167a-3d19-466f-bcca-65bb10c00c69",
		},
		{
			name: "Troglodyte",
			size: "Medium", type: "Humanoid", tags: [ "Troglodyte" ],
			ac: 11, hp: 13, init: 0, cr: "1/4",
			alignment: alignments.ce,
			environments: [ "cave", "dungeon", "underground" ],
			id: "6d5a54d5-176b-46f6-988e-db5ff8176fab",
		},
		{
			name: "Troll",
			size: "Large", type: "Giant",
			ac: 15, hp: 84, init: 1, cr: "5",
			alignment: alignments.ce,
			environments: [ "cave", "dungeon", "forest", "mountain", "swamp" ],
			id: "243e91ab-b859-44ce-a9cb-e14a055d1151",
		},
		{
			name: "Umber Hulk",
			size: "Large", type: "Monstrosity",
			ac: 18, hp: 93, init: 1, cr: "5",
			alignment: alignments.ce,
			environments: [ "cave", "underground" ],
			id: "ea840106-9d27-453c-9ded-c93725740323",
		},
		{
			name: "Unicorn",
			size: "Large", type: "Celestial",
			ac: 12, hp: 67, init: 2, cr: "5",
			alignment: alignments.lg,
			environments: [ "forest", "ruins" ],
			legendary: true,
			lair: true,
			id: "fb6ed7bc-7f48-465b-8de0-083c4365d979",
		},
		{
			section: "Vampires", name: "Vampire",
			size: "Medium", type: "Undead", tags: [ "Shapechanger" ],
			ac: 16, hp: 144, init: 4, cr: "13",
			alignment: alignments.le,
			environments: [ "dungeon", "ruins", "urban" ],
			legendary: true,
			lair: true,
			id: "f6277838-fcd7-4d25-b6a5-4049361e0978",
		},
		{
			section: "Vampires", name: "Vampire Spawn",
			size: "Medium", type: "Undead",
			ac: 15, hp: 82, init: 3, cr: "5",
			alignment: alignments.ne,
			environments: [ "dungeon", "ruins", "urban" ],
			id: "36f309b0-7f49-44ac-aba7-6a7405e58545",
		},
		{
			section: "Vampires", name: "Vampire Spellcaster",
			size: "Medium", type: "Undead", tags: [ "Shapechanger" ],
			ac: 16, hp: 144, init: 4, cr: "15",
			alignment: alignments.le,
			environments: [ "dungeon", "ruins", "urban" ],
			legendary: true,
			lair: true,
			id: "7298a7a8-a523-49b7-8e60-26e6375cb87f",
		},
		{
			section: "Vampires", name: "Vampire Warrior",
			size: "Medium", type: "Undead", tags: [ "Shapechanger" ],
			ac: 18, hp: 144, init: 4, cr: "15",
			alignment: alignments.le,
			environments: [ "dungeon", "ruins", "urban" ],
			legendary: true,
			lair: true,
			id: "1b36ddcf-1c1c-4238-a320-c602f74670f2",
		},
		{
			name: "Water Weird",
			size: "Large", type: "Elemental",
			ac: 13, hp: 58, init: 3, cr: "3",
			alignment: alignments.n,
			environments: [ "cave", "coast", "forest", "mountain", "swamp", "underground", "planar" ],
			id: "0414cbe7-742c-4df8-9d4a-51dd1d37210e",
		},
		{
			name: "Wight",
			size: "Medium", type: "Undead",
			ac: 14, hp: 45, init: 2, cr: "3",
			alignment: alignments.ne,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban" ],
			id: "76b14a0c-551e-4166-9e0a-e06bdb46623d",
		},
		{
			name: "Will-o'-Wisp",
			size: "Tiny", type: "Undead",
			ac: 19, hp: 22, init: 9, cr: "2",
			alignment: alignments.ce,
			environments: [ "swamp" ],
			id: "16d4afb3-8246-4709-8308-58d620849408",
		},
		{
			name: "Wraith",
			size: "Medium", type: "Undead",
			ac: 13, hp: 67, init: 3, cr: "5",
			alignment: alignments.ne,
			environments: [ "dungeon", "ruins", "swamp", "urban" ],
			id: "e0c0e8f0-bef8-4c76-872b-898a91c27969",
		},
		{
			name: "Wyvern",
			size: "Large", type: "Dragon",
			ac: 13, hp: 110, init: 0, cr: "6",
			environments: [ "arctic", "coast", "grassland" ],
			id: "9b9d4516-f2ae-449d-80ba-0ce4e85438cc",
		},
		{
			name: "Xorn",
			size: "Medium", type: "Elemental",
			ac: 19, hp: 73, init: 0, cr: "5",
			alignment: alignments.n,
			environments: [ "dungeon", "underground", "planar" ],
			id: "77cbc6b6-3936-4dad-b575-7c45e81e22f9",
		},
		{
			section: "Yeti", name: "Abominable Yeti",
			size: "Huge", type: "Monstrosity",
			ac: 15, hp: 137, init: 0, cr: "9",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "mountain" ],
			id: "52386d70-24c8-461a-ba1f-4fbaccc6d446",
		},
		{
			section: "Yeti", name: "Yeti",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 51, init: 1, cr: "3",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "mountain" ],
			id: "7686c9ce-acc2-4d30-8729-665c947c153d",
		},
		{
			section: "Yuan-ti", name: "Yuan-ti Abomination",
			size: "Large", type: "Monstrosity", tags: [ "Shapechanger", "Yuan-ti" ],
			ac: 15, hp: 127, init: 3, cr: "7",
			alignment: alignments.ne,
			environments: [ "desert", "forest", "mountain", "ruins", "swamp" ],
			id: "36d12747-408b-485c-859e-2d33b9c4d90e",
		},
		{
			section: "Yuan-ti", name: "Yuan-ti Malison",
			size: "Medium", type: "Monstrosity", tags: [ "Shapechanger", "Yuan-ti" ],
			ac: 12, hp: 66, init: 2, cr: "3",
			alignment: alignments.ne,
			environments: [ "desert", "forest", "mountain", "ruins", "swamp" ],
			id: "718cb508-899e-46cd-8c26-6271fe470d62",
		},
		{
			section: "Yuan-ti", name: "Yuan-ti Pureblood",
			size: "Medium", type: "Monstrosity", tags: [ "Yuan-ti" ],
			ac: 11, hp: 40, init: 1, cr: "1",
			alignment: alignments.ne,
			environments: [ "desert", "forest", "mountain", "ruins", "swamp" ],
			id: "63edeedd-e398-4b1c-b4b8-557286512a8a",
		},
		{
			section: "Yugoloths", name: "Arcanaloth",
			size: "Medium", type: "Fiend", tags: [ "Yugoloth" ],
			ac: 17, hp: 104, init: 1, cr: "12",
			alignment: alignments.ne,
			environments: [ "dungeon", "planar" ],
			id: "f9ee20cb-0dff-4585-8f5f-95141f86f9dc",
		},
		{
			section: "Yugoloths", name: "Mezzoloth",
			size: "Medium", type: "Fiend", tags: [ "Yugoloth" ],
			ac: 8, hp: 75, init: 0, cr: "5",
			alignment: alignments.ne,
			environments: [ "dungeon", "planar" ],
			id: "911a2153-0fc4-48bd-bb68-4d36ef72cb3c",
		},
		{
			section: "Yugoloths", name: "Nycaloth",
			size: "Large", type: "Fiend", tags: [ "Yugoloth" ],
			ac: 18, hp: 123, init: 0, cr: "9",
			alignment: alignments.ne,
			environments: [ "dungeon", "planar" ],
			id: "4ec385e4-55ea-4d7b-af20-513227375d22",
		},
		{
			section: "Yugoloths", name: "Ultraloth",
			size: "Medium", type: "Fiend", tags: [ "Yugoloth" ],
			ac: 19, hp: 153, init: 3, cr: "13",
			alignment: alignments.ne,
			environments: [ "dungeon", "planar" ],
			id: "17f653b5-f073-4638-855e-24d4c7f6c249",
		},
		{
			section: "Zombies", name: "Beholder Zombie",
			size: "Large", type: "Undead",
			ac: 15, hp: 93, init: -1, cr: "5",
			alignment: alignments.ne,
			environments: [ "cave", "dungeon", "underground" ],
			id: "81191c85-cef0-4782-9e4e-70accdae757e",
		},
		{
			section: "Zombies", name: "Ogre Zombie",
			size: "Large", type: "Undead",
			ac: 8, hp: 85, init: -2, cr: "2",
			alignment: alignments.ne,
			environments: [ "dungeon", "forest", "mountain", "swamp" ],
			id: "563daf80-0285-48c5-908b-2dc607550125",
		},
		{
			section: "Zombies", name: "Zombie",
			size: "Medium", type: "Undead",
			ac: 8, hp: 22, init: -2, cr: "1/4",
			alignment: alignments.ne,
			environments: [ "aquatic", "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban" ],
			id: "ac42a801-316b-4f28-b552-592d7e751649",
		},

		// Monster Manual Appendix: Miscellaneous Creatures

		{
			section: "Misc Creatures", name: "Ape",
			size: "Medium", type: "Beast",
			ac: 12, hp: 19, init: 2, cr: "1/2",
			environments: [ "forest" ],
			id: "0788c447-ada3-4bc2-aa38-bc9e08b186d4",
		},
		{
			section: "Misc Creatures", name: "Awakened Shrub",
			size: "Small", type: "Plant",
			ac: 9, hp: 10, init: -1, cr: "0",
			environments: [ "forest", "grassland" ],
			id: "0966d112-1f88-45cc-b018-c03103c2b3a0",
		},
		{
			section: "Misc Creatures", name: "Awakened Tree",
			size: "Huge", type: "Plant",
			ac: 13, hp: 59, init: -2, cr: "2",
			environments: [ "forest" ],
			id: "98e6eb4b-4998-4a6c-9366-09a82b0c3028",
		},
		{
			section: "Misc Creatures", name: "Axe Beak",
			size: "Large", type: "Beast",
			ac: 11, hp: 19, init: 1, cr: "1/4",
			environments: [ "grassland" ],
			id: "62b74702-7ffa-4827-83dc-b97dec26690a",
		},
		{
			section: "Misc Creatures", name: "Baboon",
			size: "Small", type: "Beast",
			ac: 12, hp: 3, init: 2, cr: "0",
			environments: [ "forest", "grassland" ],
			id: "f3d4a9b6-622b-4c6c-b809-df565839699c",
		},
		{
			section: "Misc Creatures", name: "Badger",
			size: "Tiny", type: "Beast",
			ac: 10, hp: 3, init: 0, cr: "0",
			environments: [ "forest" ],
			id: "e4ca5f7e-4218-4083-a8e0-009b24bd66cb",
		},
		{
			section: "Misc Creatures", name: "Bat",
			size: "Tiny", type: "Beast",
			ac: 12, hp: 1, init: 2, cr: "0",
			environments: [ "cave", "forest", "mountain", "underground", "urban" ],
			id: "afee8041-1219-4d31-931d-3c3a08b0b449",
		},
		{
			section: "Misc Creatures", name: "Black Bear",
			size: "Medium", type: "Beast",
			ac: 11, hp: 19, init: 0, cr: "1/2",
			environments: [ "cave", "forest", "grassland", "mountain" ],
			id: "a233bc77-4107-456a-89d2-9d91b4ada1a2",
		},
		{
			section: "Misc Creatures", name: "Blink Dog",
			size: "Medium", type: "Fey",
			ac: 13, hp: 22, init: 3, cr: "1/4",
			alignment: alignments.lg,
			environments: [ "forest", "grassland" ],
			id: "92452019-5b58-4f07-acdc-89be2ab34c2f",
		},
		{
			section: "Misc Creatures", name: "Blood Hawk",
			size: "Small", type: "Beast",
			ac: 12, hp: 7, init: 2, cr: "1/8",
			environments: [ "coast", "grassland", "mountain" ],
			id: "2fd54197-cb28-4dcd-b0b3-adfc90de53f6",
		},
		{
			section: "Misc Creatures", name: "Boar",
			size: "Medium", type: "Beast",
			ac: 11, hp: 11, init: 0, cr: "1/4",
			environments: [ "forest", "grassland" ],
			id: "14ef11ed-2340-46de-a4eb-e9932f839f5d",
		},
		{
			section: "Misc Creatures", name: "Brown Bear",
			size: "Large", type: "Beast",
			ac: 11, hp: 34, init: 0, cr: "1",
			environments: [ "cave", "forest" ],
			id: "197d96a0-a8c4-48be-af3d-6174ac281afb",
		},
		{
			section: "Misc Creatures", name: "Camel",
			size: "Large", type: "Beast",
			ac: 9, hp: 15, init: -1, cr: "1/8",
			environments: [ "desert" ],
			id: "67f7d07c-5002-4768-9586-3ed988bec1e9",
		},
		{
			section: "Misc Creatures", name: "Cat",
			size: "Tiny", type: "Beast",
			ac: 12, hp: 2, init: 2, cr: "0",
			environments: [ "urban" ],
			id: "8db064e4-cca6-4757-b558-a7f122ddf06f",
		},
		{
			section: "Misc Creatures", name: "Constrictor Snake",
			size: "Large", type: "Beast",
			ac: 12, hp: 13, init: 2, cr: "1/4",
			environments: [ "forest", "swamp" ],
			id: "5ed4761c-b22d-4873-9ad3-31344c34819b",
		},
		{
			section: "Misc Creatures", name: "Crab",
			size: "Tiny", type: "Beast",
			ac: 11, hp: 2, init: 0, cr: "0",
			environments: [ "aquatic", "coast" ],
			id: "a92307d2-e938-4ee2-aee7-36eae63e2fc9",
		},
		{
			section: "Misc Creatures", name: "Crocodile",
			size: "Large", type: "Beast",
			ac: 12, hp: 19, init: 0, cr: "1/2",
			environments: [ "aquatic", "coast", "swamp" ],
			id: "604dfa7a-4b77-4633-a3ce-83e2c073e0d4",
		},
		{
			section: "Misc Creatures", name: "Death Dog",
			size: "Medium", type: "Monstrosity",
			ac: 12, hp: 39, init: 2, cr: "1",
			alignment: alignments.ne,
			environments: [ "desert", "grassland", "underground" ],
			id: "3f109065-752c-496c-9169-b2ab3399126b",
		},
		{
			section: "Misc Creatures", name: "Deer",
			size: "Medium", type: "Beast",
			ac: 13, hp: 4, init: 3, cr: "0",
			environments: [ "forest", "grassland" ],
			id: "ba54ab80-5007-4695-9f82-003a88cfdeeb",
		},
		{
			section: "Misc Creatures", name: "Dire Wolf",
			size: "Large", type: "Beast",
			ac: 14, hp: 37, init: 2, cr: "1",
			environments: [ "arctic", "cave", "forest", "grassland" ],
			id: "9a507770-7644-4486-b73e-ca04b78d2e43",
		},
		{
			section: "Misc Creatures", name: "Draft Horse",
			size: "Large", type: "Beast",
			ac: 10, hp: 19, init: 0, cr: "1/4",
			environments: [ "urban" ],
			id: "46979307-705f-43e6-be68-7f72c936b1ba",
		},
		{
			section: "Misc Creatures", name: "Eagle",
			size: "Small", type: "Beast",
			ac: 12, hp: 3, init: 2, cr: "0",
			environments: [ "arctic", "grassland", "mountain" ],
			id: "2b990f56-68e4-4c1c-8905-c1a05269beeb",
		},
		{
			section: "Misc Creatures", name: "Elephant",
			size: "Huge", type: "Beast",
			ac: 12, hp: 76, init: -1, cr: "4",
			environments: [ "grassland" ],
			id: "45934b57-b2f7-4bce-bc98-0af4e1233b62",
		},
		{
			section: "Misc Creatures", name: "Elk",
			size: "Large", type: "Beast",
			ac: 10, hp: 13, init: 0, cr: "1/4",
			environments: [ "forest", "grassland" ],
			id: "eb4b6767-1035-48a2-8a66-b9e2572e2322",
		},
		{
			section: "Misc Creatures", name: "Flying Snake",
			size: "Tiny", type: "Beast",
			ac: 14, hp: 5, init: 4, cr: "1/8",
			environments: [ "forest", "swamp" ],
			id: "6afa4798-b9c5-4139-adeb-55eaba3e9cdb",
		},
		{
			section: "Misc Creatures", name: "Frog",
			size: "Tiny", type: "Beast",
			ac: 11, hp: 1, init: 1, cr: "0",
			environments: [ "aquatic", "coast", "forest", "swamp" ],
			id: "303172de-265f-4046-bf47-2aff0f444f6e",
		},
		{
			section: "Misc Creatures", name: "Giant Ape",
			size: "Huge", type: "Beast",
			ac: 12, hp: 157, init: 2, cr: "7",
			environments: [ "forest" ],
			id: "4115f79a-084f-4775-b821-2b7ce6fc60d6",
		},
		{
			section: "Misc Creatures", name: "Giant Badger",
			size: "Medium", type: "Beast",
			ac: 10, hp: 13, init: 0, cr: "1/4",
			environments: [ "forest", "grassland" ],
			id: "2a435613-2ac3-4486-90e6-e62e2efce0ec",
		},
		{
			section: "Misc Creatures", name: "Giant Bat",
			size: "Large", type: "Beast",
			ac: 13, hp: 22, init: 3, cr: "1/4",
			environments: [ "cave", "dungeon", "forest", "ruins", "swamp", "underground" ],
			id: "f96d5318-3768-4f78-b800-6cc36f474c0a",
		},
		{
			section: "Misc Creatures", name: "Giant Boar",
			size: "Large", type: "Beast",
			ac: 12, hp: 42, init: 0, cr: "2",
			environments: [ "forest", "grassland" ],
			id: "bcc30ff0-0853-456b-961e-c23a7236b979",
		},
		{
			section: "Misc Creatures", name: "Giant Centipede",
			size: "Small", type: "Beast",
			ac: 13, hp: 4, init: 2, cr: "1/4",
			environments: [ "cave", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground" ],
			id: "98ec83af-5011-4e90-b17e-7885df911032",
		},
		{
			section: "Misc Creatures", name: "Giant Constrictor Snake",
			size: "Huge", type: "Beast",
			ac: 12, hp: 60, init: 2, cr: "2",
			environments: [ "forest", "grassland", "swamp" ],
			id: "f2d2909a-895b-4f43-89eb-5a17a5f129c3",
		},
		{
			section: "Misc Creatures", name: "Giant Crab",
			size: "Medium", type: "Beast",
			ac: 15, hp: 13, init: 2, cr: "1/8",
			environments: [ "aquatic", "coast" ],
			id: "df3f2dc9-40e2-48f3-9d40-a62a57dd0492",
		},
		{
			section: "Misc Creatures", name: "Giant Crocodile",
			size: "Huge", type: "Beast",
			ac: 14, hp: 85, init: -1, cr: "5",
			environments: [ "aquatic", "coast", "swamp" ],
			id: "2408c546-fa02-40e0-9264-08d13fe5386c",
		},
		{
			section: "Misc Creatures", name: "Giant Eagle",
			size: "Large", type: "Beast",
			ac: 13, hp: 26, init: 3, cr: "1",
			alignment: alignments.ng,
			environments: [ "grassland", "mountain" ],
			id: "a02c80fc-b950-4e71-be07-2a3b28a126a4",
		},
		{
			section: "Misc Creatures", name: "Giant Elk",
			size: "Huge", type: "Beast",
			ac: 14, hp: 42, init: 3, cr: "2",
			environments: [ "forest", "grassland" ],
			id: "68039952-d660-43e4-8949-ae6eb04606b6",
		},
		{
			section: "Misc Creatures", name: "Giant Fire Beetle",
			size: "Small", type: "Beast",
			ac: 13, hp: 4, init: 0, cr: "0",
			environments: [ "cave", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground" ],
			id: "3b66d494-fe9b-411c-8e8e-d8f384c41ef8",
		},
		{
			section: "Misc Creatures", name: "Giant Frog",
			size: "Medium", type: "Beast",
			ac: 11, hp: 18, init: 1, cr: "1/4",
			environments: [ "aquatic", "coast", "forest", "swamp" ],
			id: "7a608516-9ef3-4bf3-85c6-45837c61a77e",
		},
		{
			section: "Misc Creatures", name: "Giant Goat",
			size: "Large", type: "Beast",
			ac: 11, hp: 19, init: 0, cr: "1/2",
			environments: [ "forest", "grassland", "mountain" ],
			id: "6589f3c5-4596-4fd4-b69c-94be539aade0",
		},
		{
			section: "Misc Creatures", name: "Giant Hyena",
			size: "Large", type: "Beast",
			ac: 12, hp: 45, init: 2, cr: "1",
			environments: [ "coast", "desert", "forest", "grassland" ],
			id: "d56e1457-2295-4bfd-b1d6-d84e53d6debc",
		},
		{
			section: "Misc Creatures", name: "Giant Lizard",
			size: "Large", type: "Beast",
			ac: 12, hp: 19, init: 1, cr: "1/4",
			environments: [ "cave", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground" ],
			id: "b1e3ee1f-d616-412d-ab5e-10aad27b2476",
		},
		{
			section: "Misc Creatures", name: "Giant Octopus",
			size: "Large", type: "Beast",
			ac: 11, hp: 52, init: 1, cr: "1",
			environments: [ "aquatic" ],
			id: "0dcde23a-8100-4855-ac07-3388d1b8cc40",
		},
		{
			section: "Misc Creatures", name: "Giant Owl",
			size: "Large", type: "Beast",
			ac: 12, hp: 19, init: 2, cr: "1/4",
			alignment: alignments.n,
			environments: [ "forest", "grassland", "urban" ],
			id: "0f0d61e7-2a8f-47c6-b1c9-35d7390dd6bb",
		},
		{
			section: "Misc Creatures", name: "Giant Poisonous Snake",
			size: "Medium", type: "Beast",
			ac: 14, hp: 11, init: 4, cr: "1/4",
			environments: [ "forest", "grassland", "swamp" ],
			id: "ab030d7f-8e46-4167-bf36-45ff59a95665",
		},
		{
			section: "Misc Creatures", name: "Giant Rat",
			size: "Small", type: "Beast",
			ac: 12, hp: 7, init: 2, cr: "1/8",
			environments: [ "cave", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban" ],
			id: "dd4df726-a041-4058-ac44-225aab9be366",
		},
		{
			section: "Misc Creatures", name: "Giant Scorpion",
			size: "Large", type: "Beast",
			ac: 15, hp: 52, init: 1, cr: "3",
			environments: [ "cave", "coast", "desert", "dungeon", "grassland", "ruins", "swamp", "underground" ],
			id: "ff4ee842-7c21-4d0e-b6ff-d72dc13913db",
		},
		{
			section: "Misc Creatures", name: "Giant Sea Horse",
			size: "Large", type: "Beast",
			ac: 13, hp: 16, init: 2, cr: "1/2",
			environments: [ "aquatic" ],
			id: "2fe6b60e-017f-40fa-9746-44e5b9f6bb2d",
		},
		{
			section: "Misc Creatures", name: "Giant Shark",
			size: "Huge", type: "Beast",
			ac: 13, hp: 126, init: 0, cr: "5",
			environments: [ "aquatic" ],
			id: "4d78880d-7eae-4494-ac22-e0bf415e32ad",
		},
		{
			section: "Misc Creatures", name: "Giant Spider",
			size: "Large", type: "Beast",
			ac: 14, hp: 26, init: 3, cr: "1",
			environments: [ "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban" ],
			id: "ceff6967-7d2c-4b84-9e2a-df1d36a9a98c",
		},
		{
			section: "Misc Creatures", name: "Giant Toad",
			size: "Large", type: "Beast",
			ac: 11, hp: 39, init: 1, cr: "1",
			environments: [ "aquatic", "coast", "forest", "swamp" ],
			id: "dfd9f55f-e53c-4abb-b761-144062af6d0d",
		},
		{
			section: "Misc Creatures", name: "Giant Vulture",
			size: "Large", type: "Beast",
			ac: 10, hp: 22, init: 13, cr: "1",
			alignment: alignments.ne,
			environments: [ "desert", "grassland", "ruins" ],
			id: "6b6e5aa1-bc01-4af6-b64a-8ac3f468eaf7",
		},
		{
			section: "Misc Creatures", name: "Giant Wasp",
			size: "Medium", type: "Beast",
			ac: 12, hp: 13, init: 2, cr: "1/2",
			environments: [ "forest" ],
			id: "ff490947-a963-4c11-8a1c-f238f4f6ad27",
		},
		{
			section: "Misc Creatures", name: "Giant Weasel",
			size: "Medium", type: "Beast",
			ac: 13, hp: 9, init: 3, cr: "1/8",
			environments: [ "forest", "grassland" ],
			id: "a30c0261-68cd-4b59-8bf6-c47bbde26f36",
		},
		{
			section: "Misc Creatures", name: "Giant Wolf Spider",
			size: "Medium", type: "Beast",
			ac: 13, hp: 11, init: 3, cr: "1/4",
			environments: [ "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban" ],
			id: "f51ac131-dfc5-4672-a569-ab361ac31447",
		},
		{
			section: "Misc Creatures", name: "Goat",
			size: "Medium", type: "Beast",
			ac: 10, hp: 4, init: 0, cr: "0",
			environments: [ "grassland", "urban" ],
			id: "4407c527-3be7-4010-b51d-a777203e49e1",
		},
		{
			section: "Misc Creatures", name: "Hawk",
			size: "Tiny", type: "Beast",
			ac: 13, hp: 1, init: 3, cr: "0",
			environments: [ "grassland", "mountain" ],
			id: "d2ebaf9c-3be0-4c0c-ac98-c65e6d80b741",
		},
		{
			section: "Misc Creatures", name: "Hunter Shark",
			size: "Large", type: "Beast",
			ac: 12, hp: 45, init: 1, cr: "2",
			environments: [ "aquatic" ],
			id: "3cbfec14-c628-4140-82ce-8cb47cfcdb98",
		},
		{
			section: "Misc Creatures", name: "Hyena",
			size: "Medium", type: "Beast",
			ac: 11, hp: 5, init: 1, cr: "0",
			environments: [ "forest", "grassland" ],
			id: "589c5ae5-bbbe-4753-a36a-53bfec6987b7",
		},
		{
			section: "Misc Creatures", name: "Jackal",
			size: "Small", type: "Beast",
			ac: 12, hp: 3, init: 2, cr: "0",
			environments: [ "desert", "grassland" ],
			id: "d8e388da-90a9-48b5-8d84-f969f5b98a73",
		},
		{
			section: "Misc Creatures", name: "Killer Whale",
			size: "Huge", type: "Beast",
			ac: 12, hp: 90, init: 0, cr: "3",
			environments: [ "aquatic" ],
			id: "7ff7ffda-0e4d-4989-9c61-455178874d43",
		},
		{
			section: "Misc Creatures", name: "Lion",
			size: "Large", type: "Beast",
			ac: 12, hp: 26, init: 2, cr: "1",
			environments: [ "grassland" ],
			id: "2feb4531-2954-456c-bdf2-b320b1b8d1a3",
		},
		{
			section: "Misc Creatures", name: "Lizard",
			size: "Tiny", type: "Beast",
			ac: 10, hp: 2, init: 0, cr: "0",
			environments: [ "cave", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground" ],
			id: "c9c0dd9a-d2ce-449c-9bd8-46da79cacdc3",
		},
		{
			section: "Misc Creatures", name: "Mammoth",
			size: "Huge", type: "Beast",
			ac: 13, hp: 126, init: -1, cr: "6",
			environments: [ "arctic" ],
			id: "723492cc-2dc4-4c3e-b5a3-96b03dd30320",
		},
		{
			section: "Misc Creatures", name: "Mastiff",
			size: "Medium", type: "Beast",
			ac: 12, hp: 5, init: 2, cr: "1/8",
			environments: [ "urban" ],
			id: "216f1424-504a-4c7f-8a0a-478bbf97f1ef",
		},
		{
			section: "Misc Creatures", name: "Mule",
			size: "Medium", type: "Beast",
			ac: 10, hp: 11, init: 0, cr: "1/8",
			environments: [ "urban" ],
			id: "40e39910-dd75-41ac-a5b2-217d3d4e81de",
		},
		{
			section: "Misc Creatures", name: "Octopus",
			size: "Small", type: "Beast",
			ac: 12, hp: 3, init: 2, cr: "0",
			environments: [ "aquatic" ],
			id: "61154806-be2a-432b-953f-cd660073496b",
		},
		{
			section: "Misc Creatures", name: "Owl",
			size: "Tiny", type: "Beast",
			ac: 11, hp: 1, init: 1, cr: "0",
			environments: [ "forest", "urban" ],
			id: "5b060b59-1142-4d65-9958-212dbce27820",
		},
		{
			section: "Misc Creatures", name: "Panther",
			size: "Medium", type: "Beast",
			ac: 12, hp: 13, init: 2, cr: "1/4",
			environments: [ "forest" ],
			id: "777fa0ec-7cd3-497e-9a64-d5bf89ac6216",
		},
		{
			section: "Misc Creatures", name: "Phase Spider",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 32, init: 2, cr: "3",
			environments: [ "cave", "coast", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "planar" ],
			id: "9f50717c-0766-4e2e-b218-7605ccb0d945",
		},
		{
			section: "Misc Creatures", name: "Poisonous Snake",
			size: "Tiny", type: "Beast",
			ac: 13, hp: 2, init: 3, cr: "1/8",
			environments: [ "desert", "forest", "grassland", "swamp" ],
			id: "e23e499c-9022-482c-ae28-21790a692aab",
		},
		{
			section: "Misc Creatures", name: "Polar Bear",
			size: "Large", type: "Beast",
			ac: 12, hp: 42, init: 0, cr: "2",
			environments: [ "arctic", "cave" ],
			id: "f2a7ac7e-972f-4956-908e-525eec2ae47c",
		},
		{
			section: "Misc Creatures", name: "Pony",
			size: "Medium", type: "Beast",
			ac: 10, hp: 11, init: 0, cr: "1/8",
			environments: [ "grassland" ],
			id: "18f9d16d-6151-45fc-b449-5ca10e66f49e",
		},
		{
			section: "Misc Creatures", name: "Quipper",
			size: "Tiny", type: "Beast",
			ac: 13, hp: 1, init: 3, cr: "0",
			environments: [ "aquatic" ],
			id: "33980992-7042-4c16-8ffb-d784114520d6",
		},
		{
			section: "Misc Creatures", name: "Rat",
			size: "Tiny", type: "Beast",
			ac: 10, hp: 1, init: 0, cr: "0",
			environments: [ "arctic", "cave", "coast", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban" ],
			id: "b01dae8d-020f-4ee2-a80a-de7cb133de53",
		},
		{
			section: "Misc Creatures", name: "Raven",
			size: "Tiny", type: "Beast",
			ac: 12, hp: 1, init: 2, cr: "0",
			environments: [ "forest", "grassland" ],
			id: "cda02d73-dca4-45bb-92cb-ad2092a27ea5",
		},
		{
			section: "Misc Creatures", name: "Reef Shark",
			size: "Medium", type: "Beast",
			ac: 12, hp: 22, init: 1, cr: "1/2",
			environments: [ "aquatic" ],
			id: "75d4dfd5-8942-4661-b8a8-3fbcaec7d1ab",
		},
		{
			section: "Misc Creatures", name: "Rhinoceros",
			size: "Large", type: "Beast",
			ac: 11, hp: 45, init: -1, cr: "2",
			environments: [ "grassland" ],
			id: "73254529-1dde-443a-9cbd-940157812fb1",
		},
		{
			section: "Misc Creatures", name: "Riding Horse",
			size: "Large", type: "Beast",
			ac: 10, hp: 13, init: 0, cr: "1/4",
			environments: [ "urban" ],
			id: "e02034e2-fe58-4c02-bdb6-9a54baf6e86b",
		},
		{
			section: "Misc Creatures", name: "Saber-Toothed Tiger",
			size: "Large", type: "Beast",
			ac: 12, hp: 52, init: 2, cr: "2",
			environments: [ "forest", "grassland" ],
			id: "e8fb3a4e-52e3-4519-bfe4-2710fca7aca2",
		},
		{
			section: "Misc Creatures", name: "Scorpion",
			size: "Tiny", type: "Beast",
			ac: 11, hp: 1, init: 0, cr: "0",
			environments: [ "cave", "desert", "grassland", "mountain", "swamp" ],
			id: "d30a64ee-ac17-42e5-99ff-2186111615ad",
		},
		{
			section: "Misc Creatures", name: "Sea Horse",
			size: "Tiny", type: "Beast",
			ac: 11, hp: 1, init: 1, cr: "0",
			environments: [ "aquatic" ],
			id: "ec2f7099-286e-4384-990a-526cf70b1c55",
		},
		{
			section: "Misc Creatures", name: "Spider",
			size: "Tiny", type: "Beast",
			ac: 12, hp: 1, init: 2, cr: "0",
			environments: [ "cave", "coast", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "planar" ],
			id: "5cf71994-66bd-433e-ae5f-d20071c48d85",
		},
		{
			section: "Misc Creatures", name: "Swarm of Bats",
			size: "Medium", type: "Beast", tags: [ "Swarm" ],
			ac: 12, hp: 22, init: 2, cr: "1/4",
			environments: [ "cave", "dungeon", "forest", "ruins", "swamp", "underground", "urban" ],
			id: "c5cc5a1a-d412-40d3-9537-f22aa625f893",
		},
		{
			section: "Misc Creatures", name: "Swarm of Insects",
			size: "Medium", type: "Beast", tags: [ "Swarm" ],
			ac: 12, hp: 22, init: 1, cr: "1/2",
			environments: [ "cave", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban" ],
			id: "e3b72f35-5e72-4bfa-b238-f22062184c1c",
		},
		{
			section: "Misc Creatures", name: "Swarm of Poisonous Snakes",
			size: "Medium", type: "Beast", tags: [ "Swarm" ],
			ac: 14, hp: 36, init: 4, cr: "2",
			environments: [ "desert", "dungeon", "forest", "grassland", "swamp" ],
			id: "c37dd213-9373-41af-9c87-e27513d16ec5",
		},
		{
			section: "Misc Creatures", name: "Swarm of Quippers",
			size: "Medium", type: "Beast", tags: [ "Swarm" ],
			ac: 13, hp: 28, init: 3, cr: "1",
			environments: [ "aquatic" ],
			id: "d74a782b-6b71-4c9c-95d0-f8d61bb97e44",
		},
		{
			section: "Misc Creatures", name: "Swarm of Rats",
			size: "Medium", type: "Beast", tags: [ "Swarm" ],
			ac: 10, hp: 24, init: 0, cr: "1/4",
			environments: [ "cave", "dungeon", "forest", "grassland", "ruins", "swamp", "urban" ],
			id: "31c042ca-f348-4ba5-a749-bb659b296f8f",
		},
		{
			section: "Misc Creatures", name: "Swarm of Ravens",
			size: "Medium", type: "Beast", tags: [ "Swarm" ],
			ac: 12, hp: 24, init: 2, cr: "1/4",
			environments: [ "forest", "grassland", "mountain", "ruins", "urban" ],
			id: "adcec956-ebf2-42c3-9e60-4ec3f58c17e2",
		},
		{
			section: "Misc Creatures", name: "Tiger",
			size: "Large", type: "Beast",
			ac: 12, hp: 37, init: 2, cr: "1",
			environments: [ "forest", "grassland" ],
			id: "d0a5fb54-32bb-4704-ac1a-862a175d333b",
		},
		{
			section: "Misc Creatures", name: "Vulture",
			size: "Medium", type: "Beast",
			ac: 10, hp: 5, init: 0, cr: "0",
			environments: [ "desert", "grassland", "ruins" ],
			id: "b2f6a630-d8e2-42f5-8844-5a346f55c272",
		},
		{
			section: "Misc Creatures", name: "Warhorse",
			size: "Large", type: "Beast",
			ac: 11, hp: 19, init: 1, cr: "1/2",
			environments: [ "grassland", "urban" ],
			id: "8d0e875b-95f1-47a5-9d98-72ac4738c860",
		},
		{
			section: "Misc Creatures", name: "Weasel",
			size: "Tiny", type: "Beast",
			ac: 13, hp: 1, init: 3, cr: "0",
			environments: [ "grassland" ],
			id: "3306e2fd-7249-45d6-abcd-1797c8d8ca30",
		},
		{
			section: "Misc Creatures", name: "Winter Wolf",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 75, init: 1, cr: "3",
			alignment: alignments.ne,
			environments: [ "arctic", "cave", "forest", "grassland" ],
			id: "4da5597e-8f29-4fce-a4e7-d36ba2c5b6a7",
		},
		{
			section: "Misc Creatures", name: "Wolf",
			size: "Medium", type: "Beast",
			ac: 13, hp: 11, init: 2, cr: "1/4",
			environments: [ "arctic", "cave", "forest", "grassland" ],
			id: "9e4c024d-0b8b-40c7-9e4a-2b447450ab4e",
		},
		{
			section: "Misc Creatures", name: "Worg",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 26, init: 1, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "arctic", "cave", "forest", "grassland" ],
			id: "1d37bafc-ea8e-40e5-8546-475276cc903f",
		},

		// Monster Manual Appendix: Nonplayer Characters

		{
			section: "NPCs", name: "Acolyte",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 10, hp: 9, init: 0, cr: "1/4",
			alignment: alignments.any,
			environments: [ "arctic", "desert", "dungeon", "forest", "grassland", "mountain", "swamp", "underground", "urban" ],
			id: "f88906c2-146d-4abb-8537-8bf5e1d0ac97",
		},
		{
			section: "NPCs", name: "Archmage",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: "12 (15 with mage armor)", hp: 99, init: 2, cr: "12",
			alignment: alignments.any,
			environments: [ "ruins", "urban" ],
			id: "d4aec3c5-0b0a-4fff-b77b-fe7c900d7d31",
		},
		{
			section: "NPCs", name: "Assassin",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 15, hp: 78, init: 3, cr: "8",
			alignment: alignments.non_good,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "swamp", "underground", "urban" ],
			id: "f42ac24e-7196-4ba4-ae4a-3e34a744d3de",
		},
		{
			section: "NPCs", name: "Bandit",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 12, hp: 11, init: 1, cr: "1/8",
			alignment: alignments.non_lawful,
			environments: [ "arctic", "coast", "desert", "forest", "grassland", "mountain", "ruins", "urban" ],
			id: "d9d4ae84-bf86-4b94-9806-1b32f5cc69aa",
		},
		{
			section: "NPCs", name: "Bandit Captain",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 15, hp: 65, init: 3, cr: "2",
			alignment: alignments.non_lawful,
			environments: [ "arctic", "coast", "desert", "forest", "grassland", "mountain", "ruins", "urban" ],
			id: "f0109337-c855-4795-946c-93c92d97df29",
		},
		{
			section: "NPCs", name: "Berserker",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 13, hp: 67, init: 1, cr: "2",
			alignment: alignments.any_chaotic,
			environments: [ "arctic", "cave", "desert", "forest", "grassland", "mountain", "swamp", "urban" ],
			id: "8f6ae154-74f1-4ae2-b165-54f109fa2733",
		},
		{
			section: "NPCs", name: "Commoner",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 10, hp: 4, init: 0, cr: "0",
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "a5f5b9e0-71af-4788-a471-7135557c8321",
		},
		{
			section: "NPCs", name: "Cult Fanatic",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 13, hp: 33, init: 2, cr: "2",
			alignment: alignments.non_good,
			environments: [ "dungeon", "urban" ],
			id: "57f917eb-d654-4a66-b1ca-400245e59fc8",
		},
		{
			section: "NPCs", name: "Cultist",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 12, hp: 9, init: 1, cr: "1/8",
			alignment: alignments.non_good,
			environments: [ "dungeon", "urban" ],
			id: "51bea60c-7686-4bc7-8964-46c75e6953ff",
		},
		{
			section: "NPCs", name: "Druid",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 11, hp: 27, init: 1, cr: "2",
			alignment: alignments.any,
			environments: [ "arctic", "cave", "coast", "desert", "forest", "grassland", "mountain", "swamp", "underground" ],
			id: "aa328a81-cbcb-4800-96d4-3f9f7cc021f3",
		},
		{
			section: "NPCs", name: "Gladiator",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 16, hp: 112, init: 2, cr: "5",
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "95c84527-c3f5-41df-a449-3f9c2cb56953",
		},
		{
			section: "NPCs", name: "Guard",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 16, hp: 11, init: 1, cr: "1/8",
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "2dfd127c-8844-4289-ac04-b4fe2f1656e4",
		},
		{
			section: "NPCs", name: "Knight",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 18, hp: 52, init: 0, cr: "3",
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "9094f81d-5fab-43c6-baf5-4a5acbe94b9b",
		},
		{
			section: "NPCs", name: "Mage",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: "12 (15 with mage armor)", hp: 40, init: 2, cr: "6",
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "dd58be51-e15c-4abb-8cf4-97263526d5d5",
		},
		{
			section: "NPCs", name: "Noble",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 15, hp: 9, init: 1, cr: "1/8",
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "f9a076f4-da7e-457a-912e-9fe8d752ef3e",
		},
		{
			section: "NPCs", name: "Priest",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 13, hp: 27, init: 0, cr: "2",
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "cc9e3c32-1c13-40a5-9d06-0ded81c4e3cb",
		},
		{
			section: "NPCs", name: "Scout",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 13, hp: 16, init: 2, cr: "1/2",
			alignment: alignments.any,
			environments: [ "arctic", "coast", "desert", "forest", "grassland", "mountain", "swamp" ],
			id: "14f5f317-1640-4254-b8d7-4d2dadb97394",
		},
		{
			section: "NPCs", name: "Spy",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 12, hp: 27, init: 2, cr: "1",
			alignment: alignments.any,
			environments: [ "arctic", "cave", "coast", "desert", "forest", "grassland", "mountain", "ruins", "swamp", "urban" ],
			id: "a9524fbf-b1e5-4ca4-9f79-f4e494f93bcb",
		},
		{
			section: "NPCs", name: "Thug",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 11, hp: 32, init: 0, cr: "1/2",
			alignment: alignments.non_good,
			environments: [ "arctic", "cave", "coast", "forest", "grassland", "urban" ],
			id: "9d458fc1-a489-49f8-9417-1c6c495d5e98",
		},
		{
			section: "NPCs", name: "Tribal Warrior",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 12, hp: 11, init: 0, cr: "1/8",
			alignment: alignments.any,
			environments: [ "arctic", "cave", "desert", "forest", "grassland", "mountain", "swamp" ],
			id: "183f147b-1fa5-4495-8641-d655c57dbd07",
		},
		{
			section: "NPCs", name: "Veteran",
			size: "Medium", type: "Humanoid", tags: [ "any" ],
			ac: 17, hp: 58, init: 1, cr: "3",
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "595c04c7-7c4d-442a-932a-22be86d294c9",
		},

		// Hoard of the Dragon Queen

		{
			name: "Ambush Drake",
			size: "Medium", type: "Dragon",
			ac: 13, hp: 22, init: 2, cr: "1/2",
			environments: [ "cave", "dungeon", "forest", "mountain", "ruins", "swamp", "urban" ],
			id: "f495d63f-f936-4985-a2d3-6a8ec2a20fb0",
		},
		{
			name: "Azbara Jos", tags: [ "Human" ], unique: true,
			size: "Medium", type: "Humanoid",
			ac: 13, hp: 39, init: 3, cr: "4",
			alignment: alignments.le,
			id: "9e85c13d-ef1d-4baf-a01e-d8f59d8936ef",
		},
		{
			name: "Blagothkus", tags: [ "Cloud giant" ], unique: true,
			size: "Huge", type: "Giant",
			ac: 17, hp: 138, init: 1, cr: "9",
			alignment: alignments.ne,
			id: "cd3d6e12-28d4-4f1b-a0f2-97a932f932e3",
		},
		{
			name: "Captain Othelstan", tags: [ "Human" ], unique: true,
			size: "Medium", type: "Humanoid",
			ac: 19, hp: 93, init: 0, cr: "5",
			alignment: alignments.le,
			id: "a3ac6397-dfed-4461-9f0b-d63a29ea429d",
		},
		{
			name: "Dragonclaw",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 14, hp: 16, init: 3, cr: "1",
			alignment: alignments.ne,
			environments: [ "dungeon", "urban" ],
			id: "ddb767bf-4484-4d5e-b54d-b03a6f9c6795",
		},
		{
			name: "Dragonwing",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 14, hp: 32, init: 3, cr: "2",
			alignment: alignments.ne,
			environments: [ "dungeon", "urban" ],
			id: "3bb548b6-e049-4355-84cb-47bc1d94620a",
		},
		{
			name: "Dralmorrer Borngray", tags: [ "High-elf" ], unique: true,
			size: "Medium", type: "Humanoid",
			ac: 16, hp: 52, init: 2, cr: "3",
			alignment: alignments.ne,
			id: "c48931c8-30ce-4dca-bd44-367e0dac5296",
		},
		{
			name: "Frulam Mondath", tags: [ "Human" ], unique: true,
			size: "Medium", type: "Humanoid",
			ac: 16, hp: 44, init: 0, cr: "2",
			alignment: alignments.le,
			id: "70e1d732-ce01-4f48-b88b-1a45e1cd77df",
		},
		{
			name: "Guard Drake",
			size: "Medium", type: "Dragon",
			ac: 14, hp: 52, init: 0, cr: "2",
			environments: [ "dungeon", "urban" ],
			id: "8f11d800-1103-492b-ae24-320ef1013644",
		},
		{
			name: "Jamna Gleamsilver", tags: [ "Gnome" ], unique: true,
			size: "Small", type: "Humanoid",
			ac: 15, hp: 22, init: 3, cr: "1",
			alignment: alignments.n,
			id: "a76fc0b1-2c1f-4847-aa54-fa889c212c3f",
		},
		{
			name: "Langdedrosa Cynwrath", tags: [ "Half-Dragon" ], unique: true,
			size: "Medium", type: "Humanoid",
			ac: 17, hp: 57, init: 1, cr: "4",
			alignment: alignments.le,
			id: "708b2570-c88f-4e4f-a414-a98088faa52c",
		},
		{
			name: "Pharblex Spattergoo", tags: [ "Bullywug" ], unique: true,
			size: "Medium", type: "Humanoid",
			ac: 15, hp: 59, init: 1, cr: "3",
			alignment: alignments.ce,
			id: "5210357f-f874-4807-bbf6-c203d6431ab4",
		},
		{
			name: "Rath Modar", tags: [ "Human" ], unique: true,
			size: "Medium", type: "Humanoid",
			ac: 13, hp: 71, init: 3, cr: "6",
			alignment: alignments.le,
			id: "8db8b7f3-375c-4e14-abd5-f26e6622f330",
		},
		{
			name: "Rezmir", tags: [ "Half-black dragon" ], unique: true,
			size: "Medium", type: "Humanoid",
			ac: 13, hp: 90, init: 3, cr: "7",
			alignment: alignments.ne,
			id: "84df86ca-cc90-4080-a65c-f99314bb351d",
		},
		{
			name: "Talis the White", tags: [ "Half-elf" ], unique: true,
			size: "Medium", type: "Humanoid",
			ac: 18, hp: 58, init: 1, cr: "5",
			alignment: alignments.le,
			id: "bf42ec5e-94ff-4595-a36e-e7a5dba0d822",
		},

		// Princes of the Apocalypse

		{
			section: "Howling Hatred Cultists", name: "Feathergale knight",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 16, hp: 33, init: 2, cr: "1",
			alignment: alignments.le,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "grassland", "mountain", "ruins" ],
			id: "feadfec7-96a7-4ff2-8b22-6f6ab232d6d5",
		},
		{
			section: "Howling Hatred Cultists", name: "Howling Hatred Initiate",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 13, hp: 9, init: 2, cr: "1/8",
			alignment: alignments.ne,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "grassland", "mountain", "ruins" ],
			id: "0ba96911-ae8f-4a67-ab56-e206b404a16c",
		},
		{
			section: "Howling Hatred Cultists", name: "Howling Hatred Priest",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 15, hp: 45, init: 3, cr: "2",
			alignment: alignments.ne,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "grassland", "mountain", "ruins" ],
			id: "d54be24f-498d-41b6-9947-fe0d3eab8bda",
		},
		{
			section: "Howling Hatred Cultists", name: "Hurricane",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 14, hp: 33, init: 3, cr: "2",
			alignment: alignments.le,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "grassland", "mountain", "ruins" ],
			id: "64954fd2-b46e-4c35-95b4-4c6ff153fb41",
		},
		{
			section: "Howling Hatred Cultists", name: "Skyweaver",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 12, hp: 44, init: 2, cr: "3",
			alignment: alignments.ce,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "grassland", "mountain", "ruins" ],
			id: "a04fcf2a-bcce-4bce-b0d1-d8421034ef57",
		},
		{
			section: "Howling Hatred Cultists", name: "Thurl Merosska",
			size: "Medium", type: "Humanoid", tags: [ "Human" ], unique: true,
			ac: 16, hp: 71, init: 2, cr: "3",
			alignment: alignments.le,
			id: "b556c163-d83e-480e-b43c-20719bc337aa",
		},
		{
			section: "Howling Hatred Cultists", name: "Windharrow",
			size: "Medium", type: "Humanoid", tags: [ "Half-elf" ], unique: true,
			ac: 15, hp: 55, init: 3, cr: "3",
			alignment: alignments.ne,
			id: "58a87589-0a1c-4d4c-9874-e61d7bbff92b",
		},
		{
			section: "Howling Hatred Cultists", name: "Aerisi Kalinoth",
			size: "Medium", type: "Humanoid", tags: [ "Elf" ], unique: true,
			ac: 13, hp: 66, init: 3, cr: "7",
			alignment: alignments.ne,
			lair: false,
			id: "42e798b0-d4ce-48d8-9e2e-eb12b44ec2f9",
		},
		{
			section: "Howling Hatred Cultists", name: "Aerisi Kalinoth (in lair)",
			size: "Medium", type: "Humanoid", tags: [ "Elf" ], unique: true,
			ac: 13, hp: 66, init: 3, cr: "9",
			alignment: alignments.ne,
			lair: true,
			id: "110da8de-4ec0-4b5e-b531-c8a34d355a4b",
		},
		{
			section: "Black Earth Cultists", name: "Black Earth Guard",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 18, hp: 39, init: 0, cr: "2",
			alignment: alignments.ne,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "underground" ],
			id: "e677e29f-eba3-44ae-ae6e-47c5141291e1",
		},
		{
			section: "Black Earth Cultists", name: "Black Earth Priest",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 17, hp: 45, init: 0, cr: "3",
			alignment: alignments.ne,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "underground" ],
			id: "3a6fb726-4468-49fe-b079-1ca3daf8794d",
		},
		{
			section: "Black Earth Cultists", name: "Burrow Shark",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 18, hp: 82, init: 1, cr: "4",
			alignment: alignments.ne,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "underground" ],
			id: "6511413e-afd9-425d-a2d8-13c245bfff9a",
		},
		{
			section: "Black Earth Cultists", name: "Sacred Stone Monk",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 14, hp: 22, init: 2, cr: "1/2",
			alignment: alignments.le,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "underground" ],
			id: "7bfeb1e6-6ad4-4e1d-9565-993782b70f68",
		},
		{
			section: "Black Earth Cultists", name: "Stonemelder",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 17, hp: 75, init: 0, cr: "4",
			alignment: alignments.ne,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "underground" ],
			id: "8468bebf-a893-41c9-9a52-63097a71535b",
		},
		{
			section: "Black Earth Cultists", name: "Hellenrae",
			size: "Medium", type: "Humanoid", tags: [ "Human" ], unique: true,
			ac: 16, hp: 78, init: 4, cr: "5",
			alignment: alignments.ne,
			id: "808b9d5b-9de0-4692-88b3-c3c589cd04c2",
		},
		{
			section: "Black Earth Cultists", name: "Miraj Vizann",
			size: "Medium", type: "Humanoid", tags: [ "Earth genasi" ], unique: true,
			ac: 10, hp: 82, init: 0, cr: "6",
			alignment: alignments.ne,
			id: "474f3c52-7a41-4ffa-a882-42fa94b83fda",
		},
		{
			section: "Black Earth Cultists", name: "Marlos Urnrayle",
			size: "Medium", type: "Monstrosity", unique: true,
			ac: 15, hp: 136, init: 0, cr: "8",
			alignment: alignments.ne,
			lair: false,
			id: "d4f4981c-f46b-4a18-a9c0-62bda3aee9b0",
		},
		{
			section: "Black Earth Cultists", name: "Marlos Urnrayle (in lair)",
			size: "Medium", type: "Monstrosity", unique: true,
			ac: 15, hp: 136, init: 0, cr: "12",
			alignment: alignments.ne,
			lair: false,
			id: "21d312b3-de51-492a-966c-235c76960ff2",
		},
		{
			section: "Eternal Flame Cultists", name: "Eternal Flame Guardian",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 17, hp: 45, init: 1, cr: "2",
			alignment: alignments.ce,
			environments: [ "cave", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "underground" ],
			id: "11506c53-58eb-4732-a877-570ed1fb4408",
		},
		{
			section: "Eternal Flame Cultists", name: "Eternal Flame Priest",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 12, hp: 52, init: 2, cr: "3",
			alignment: alignments.ne,
			environments: [ "cave", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "underground" ],
			id: "81ff5c00-72f3-4225-96a4-0453a57aff9c",
		},
		{
			section: "Eternal Flame Cultists", name: "Flamewrath",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 12, hp: 105, init: 2, cr: "6",
			alignment: alignments.ce,
			environments: [ "cave", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "underground" ],
			id: "530d4e60-7c5f-4d84-aff8-608a033ec85f",
		},
		{
			section: "Eternal Flame Cultists", name: "Razerblast",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 17, hp: 112, init: 0, cr: "5",
			alignment: alignments.ce,
			environments: [ "cave", "desert", "dungeon", "forest", "grassland", "mountain", "ruins", "underground" ],
			id: "f71b3427-cb38-4e49-afab-1e23f67c64a2",
		},
		{
			section: "Eternal Flame Cultists", name: "Bastian Thermandar",
			size: "Medium", type: "Humanoid", tags: [ "Fire genasi" ], unique: true,
			ac: 12, hp: 78, init: 2, cr: "8",
			alignment: alignments.ce,
			id: "952018b8-9f08-4f18-827e-2dcd7e5e367a",
		},
		{
			section: "Eternal Flame Cultists", name: "Elizar Dryflagon",
			size: "Medium", type: "Humanoid", tags: [ "Human" ], unique: true,
			ac: 14, hp: 71, init: 2, cr: "5",
			alignment: alignments.ce,
			id: "19bb278f-988d-4c48-9fde-10e4ff357c19",
		},
		{
			section: "Eternal Flame Cultists", name: "Vanifer",
			size: "Medium", type: "Humanoid", tags: [ "Tiefling" ], unique: true,
			ac: 15, hp: 112, init: 3, cr: "9",
			alignment: alignments.ce,
			lair: false,
			id: "b2def732-06fb-483d-b0bd-41977e9726a4",
		},
		{
			section: "Eternal Flame Cultists", name: "Vanifer (in lair)",
			size: "Medium", type: "Humanoid", tags: [ "Tiefling" ], unique: true,
			ac: 15, hp: 112, init: 3, cr: "12",
			alignment: alignments.ce,
			lair: true,
			id: "8e7bb425-8d3b-4051-8dc8-40fd31a79f12",
		},
		{
			section: "Crushing Wave Cultists", name: "Crushing Wave Priest",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 13, hp: 52, init: 0, cr: "2",
			alignment: alignments.ne,
			environments: [ "aquatic", "cave", "coast", "grassland", "swamp", "underground" ],
			id: "10a656be-585c-4e2d-89fc-a44d742c0650",
		},
		{
			section: "Crushing Wave Cultists", name: "Crushing Wave Reaver",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 14, hp: 22, init: 2, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "aquatic", "cave", "coast", "grassland", "swamp", "underground" ],
			id: "0d17db23-30dd-4e07-9b8f-1ea31879a5f4",
		},
		{
			section: "Crushing Wave Cultists", name: "Dark Tide Knight",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 13, hp: 58, init: 3, cr: "3",
			alignment: alignments.le,
			environments: [ "aquatic", "cave", "coast", "grassland", "swamp", "underground" ],
			id: "f276978d-37ac-4acd-9559-52d3281365c6",
		},
		{
			section: "Crushing Wave Cultists", name: "Fathomer",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 10, hp: 52, init: 0, cr: "2",
			alignment: alignments.ne,
			environments: [ "aquatic", "cave", "coast", "grassland", "swamp", "underground" ],
			id: "151a7399-6612-4424-8a67-da8419f2af1d",
		},
		{
			section: "Crushing Wave Cultists", name: "One-Eyed Shiver",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 12, hp: 49, init: 2, cr: "3",
			alignment: alignments.ce,
			environments: [ "aquatic", "cave", "coast", "grassland", "swamp", "underground" ],
			id: "eb3c332a-e5c8-4a50-a212-bc6041ceec4d",
		},
		{
			section: "Crushing Wave Cultists", name: "Shoalar Quanderil",
			size: "Medium", type: "Humanoid", tags: [ "Water genasi" ], unique: true,
			ac: 10, hp: 60, init: 1, cr: "4",
			alignment: alignments.ce,
			id: "9653c256-e429-491a-82a4-14a7d35ccc7d",
		},
		{
			section: "Crushing Wave Cultists", name: "Gar Shatterkeel",
			size: "Medium", type: "Humanoid", tags: [ "Human" ], unique: true,
			ac: 16, hp: 112, init: 2, cr: "9",
			alignment: alignments.ce,
			lair: false,
			id: "77336909-5839-48c4-954d-3eaf416dc729",
		},
		{
			section: "Crushing Wave Cultists", name: "Gar Shatterkeel (in lair)",
			size: "Medium", type: "Humanoid", tags: [ "Human" ], unique: true,
			ac: 16, hp: 112, init: 2, cr: "13",
			alignment: alignments.ce,
			lair: false,
			id: "9b6c6412-5a3d-4ff1-8151-376eac201182",
		},
		{
			section: "Other Villains", name: "Drannin Splithelm", tags: [ "Shield dwarf" ], unique: true,
			size: "Medium", type: "Elemental",
			ac: 18, hp: 93, init: 0, cr: "7",
			alignment: alignments.ne,
			id: "c0ac9048-9d40-418a-b3b1-cdc58843e1cb",
		},
		{
			section: "Other Villains", name: "Ghald", tags: [ "Sahuagin" ], unique: true,
			size: "Medium", type: "Elemental",
			ac: 15, hp: 102, init: 3, cr: "7",
			alignment: alignments.le,
			id: "788ad772-47f1-442f-a7f8-74988b191b11",
		},
		{
			section: "Other Villains", name: "Oreioth", tags: [ "Human" ], unique: true,
			size: "Medium", type: "Elemental",
			ac: 11, hp: 39, init: 1, cr: "2",
			alignment: alignments.ce,
			id: "e1c70697-6681-42a7-9289-dcc8d441d422",
		},
		{
			section: "Other Villains", name: "Wiggan Nettlebee", tags: [ "Halfling" ], unique: true,
			size: "Medium", type: "Elemental",
			ac: 11, hp: 36, init: 1, cr: "2",
			alignment: alignments.ne,
			id: "489ae12c-5439-4bc0-8f7c-ab354a7bf3f3",
		},
		{
			section: "Elemental Myrmidons", name: "Air Elemental Myrmidon",
			size: "Medium", type: "Elemental",
			ac: 18, hp: 117, init: 2, cr: "7",
			alignment: alignments.n,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "planar", "ruins", "swamp", "underground" ],
			id: "e3d1956e-2243-4e4f-9794-ed71f0160122",
		},
		{
			section: "Elemental Myrmidons", name: "Earth Elemental Myrmidon",
			size: "Medium", type: "Elemental",
			ac: 18, hp: 127, init: 0, cr: "7",
			alignment: alignments.n,
			environments: [ "arctic", "cave", "coast", "desert", "dungeon", "forest", "grassland", "mountain", "planar", "ruins", "swamp", "underground" ],
			id: "f8ae5941-9f22-4089-a9ea-43c0163771c1",
		},
		{
			section: "Elemental Myrmidons", name: "Fire Elemental Myrmidon",
			size: "Medium", type: "Elemental",
			ac: 18, hp: 117, init: 4, cr: "7",
			alignment: alignments.n,
			environments: [ "cave", "coast", "desert", "dungeon", "grassland", "mountain", "planar", "ruins", "swamp", "underground", "urban" ],
			id: "a52b610e-729b-42bd-b124-62835ed4932b",
		},
		{
			section: "Elemental Myrmidons", name: "Water Elemental Myrmidon",
			size: "Medium", type: "Elemental",
			ac: 18, hp: 127, init: 2, cr: "7",
			alignment: alignments.n,
			environments: [ "aquatic", "arctic", "cave", "coast", "dungeon", "forest", "grassland", "mountain", "planar", "ruins", "swamp", "underground" ],
			id: "c7d911b4-2ae2-4314-949e-df469804c176",
		},
		{
			section: "Princes of Elemental Evil", name: "Imix", unique: true,
			size: "Huge", type: "Elemental",
			ac: 17, hp: 325, init: 7, cr: "19",
			alignment: alignments.ne,
			lair: true,
			legendary: true,
			id: "83b24acd-ca3b-416c-b66e-aa750c33581f",
		},
		{
			section: "Princes of Elemental Evil", name: "Ogrémoch", unique: true,
			size: "Huge", type: "Elemental",
			ac: 20, hp: 526, init: 0, cr: "20",
			alignment: alignments.ne,
			lair: true,
			legendary: true,
			id: "b7d4b220-33f9-4326-beaa-a0935acc4f64",
		},
		{
			section: "Princes of Elemental Evil", name: "Olhydra", unique: true,
			size: "Huge", type: "Elemental",
			ac: 18, hp: 324, init: 6, cr: "18",
			alignment: alignments.ne,
			lair: true,
			legendary: true,
			id: "6cea5f48-7326-4c1e-bbeb-b117997c4d95",
		},
		{
			section: "Princes of Elemental Evil", name: "Yan-C-Bin", unique: true,
			size: "Huge", type: "Elemental",
			ac: 22, hp: 283, init: 7, cr: "18",
			alignment: alignments.ne,
			lair: true,
			legendary: true,
			id: "1dd55750-d131-4b9b-998b-d1ce9833e82b",
		},

		// reddit /r/monsteraday
		{
			name: "Grave Titan",
			size: "Huge", type: "Undead",
			ac: 14, hp: 200, init: 0, cr: "10",
			alignment: alignments.ne,
			environments: [],
			id: "59dc127f-c93a-5f71-8b77-735936fb4ca0",
		},
		{
			name: "Rat Hermit",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 15, hp: 44, init: 3, cr: "3",
			alignment: alignments.non_good,
			environments: [],
			id: "2e38eaec-d231-51d2-beb3-da82cb7a1d44",
		},
		{
			name: "Morphlit",
			size: "Small", type: "Aberration",
			ac: 14, hp: 18, init: 4, cr: "2",
			alignment: alignments.ce,
			environments: [],
			id: "adbfd507-fff1-5649-9ee0-517bdeedad61",
		},
		{
			name: "Selachian",
			size: "Large", type: "Humanoid", tags: [ "Selachian" ],
			ac: 15, hp: 133, init: 0, cr: "8",
			alignment: alignments.any_chaotic,
			environments: [],
			id: "e01aaafc-acdd-56a9-8fcf-f8baa248c75a",
		},
		{
			name: "Kraken Hatchling",
			size: "Huge", type: "Monstrosity", tags: [ "Titan" ],
			ac: 17, hp: 230, init: 0, cr: "12",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "d985884d-650f-564f-845a-6a1d5ed04a1a",
		},
		{
			name: "Pustuloid",
			size: "Small", type: "Fiend", tags: [ "Demon" ],
			ac: 12, hp: 27, init: 2, cr: "1",
			alignment: alignments.ce,
			environments: [],
			id: "076fbeb4-e49f-5e35-9e99-78d229bf7ad2",
		},
		{
			name: "Herald of Rot",
			size: "Large", type: "Fiend", tags: [ "Demon" ],
			ac: 15, hp: 104, init: 2, cr: "6",
			alignment: alignments.ce,
			environments: [],
			id: "f78ce030-6101-5b66-abbb-0a1bde8f7277",
		},
		{
			name: "Priest of Blight",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 14, hp: 84, init: 2, cr: "8",
			alignment: alignments.ce,
			environments: [],
			id: "3fd4bc9b-3562-570b-a7ea-820fa582baad",
		},
		{
			name: "Fire Spire Initiate",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 15, hp: 55, init: 3, cr: "3",
			alignment: alignments.any_lawful,
			environments: [],
			id: "bb017345-9b98-56c7-aed1-da6dd50c2d9a",
		},
		{
			name: "Master of the Five Spires",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 17, hp: 91, init: 4, cr: "8",
			alignment: alignments.any_lawful,
			environments: [],
			id: "8c7a6f49-37be-5531-a58f-f3ec9da6fa17",
		},
		{
			name: "Myr",
			size: "Small", type: "Construct", tags: [ "Myr" ],
			ac: 14, hp: 9, init: 2, cr: "1/4",
			alignment: alignments.n,
			environments: [],
			id: "29e80beb-2c3a-50b3-b679-20618b641f0e",
		},
		{
			name: "Myr Battlesphere",
			size: "Huge", type: "Construct", tags: [ "Myr" ],
			ac: 18, hp: 105, init: 1, cr: "5",
			alignment: alignments.n,
			environments: [],
			id: "54c92db5-42cf-534a-8418-8d73b6f5c0ab",
		},
		{
			name: "Fusion Elemental",
			size: "Huge", type: "Elemental",
			ac: 17, hp: 250, init: 0, cr: "15",
			alignment: alignments.n,
			environments: [],
			legendary: true,
			id: "7aacbba6-e9fa-560a-83c5-c89cbb3dbcb4",
		},
		{
			name: "Fallen Angel",
			size: "Medium", type: "Celestial",
			ac: 17, hp: 136, init: 4, cr: "10",
			alignment: alignments.le,
			environments: [],
			id: "6aaea83f-cd45-5042-ac24-f586fcecdfad",
		},
		{
			name: "Bone Golem",
			size: "Large", type: "Construct",
			ac: 14, hp: 133, init: -1, cr: "9",
			alignment: alignments.unaligned,
			environments: [],
			id: "2f241d46-9f14-5991-a9a1-ce6fd8692c74",
		},
		{
			name: "Sliver",
			size: "Medium", type: "Monstrosity", tags: [ "Sliver" ],
			ac: 12, hp: 22, init: 2, cr: "1/2",
			alignment: alignments.ne,
			environments: [],
			id: "d437a412-3128-54af-a952-addebebab87c",
		},
		{
			name: "Might Sliver",
			size: "Large", type: "Monstrosity", tags: [ "Sliver" ],
			ac: 12, hp: 37, init: 2, cr: "2",
			alignment: alignments.ne,
			environments: [],
			id: "f8fef1f5-258b-588e-9557-ff8e5bff5a78",
		},
		{
			name: "Armour Sliver",
			size: "Large", type: "Monstrosity", tags: [ "Sliver" ],
			ac: 16, hp: 52, init: 2, cr: "3",
			alignment: alignments.ne,
			environments: [],
			id: "f77c175f-506d-557c-aef5-2f170ab90f0d",
		},
		{
			name: "Winged Sliver",
			size: "Large", type: "Monstrosity", tags: [ "Sliver" ],
			ac: 12, hp: 60, init: 2, cr: "3",
			alignment: alignments.ne,
			environments: [],
			id: "50576b80-6e26-5f03-bda5-a3dba5ca0700",
		},
		{
			name: "Virulent Sliver",
			size: "Large", type: "Monstrosity", tags: [ "Sliver" ],
			ac: 12, hp: 52, init: 2, cr: "3",
			alignment: alignments.ne,
			environments: [],
			id: "2adf3d0a-8617-5b52-99ea-de9477a51309",
		},
		{
			name: "Spitting Sliver",
			size: "Large", type: "Monstrosity", tags: [ "Sliver" ],
			ac: 12, hp: 45, init: 2, cr: "2",
			alignment: alignments.ne,
			environments: [],
			id: "a9792b74-860b-59ea-be7c-1cc44139b2ef",
		},
		{
			name: "Crystalline Sliver",
			size: "Large", type: "Monstrosity", tags: [ "Sliver" ],
			ac: 14, hp: 75, init: 2, cr: "4",
			alignment: alignments.ne,
			environments: [],
			id: "51a0186f-dbcd-520d-8f01-382aa2d0621f",
		},
		{
			name: "Sliver Queen",
			size: "Huge", type: "Monstrosity", tags: [ "Sliver" ],
			ac: 17, hp: 200, init: 2, cr: "13",
			alignment: alignments.ne,
			environments: [],
			legendary: true,
			id: "6c980cfc-5e86-58c7-ad36-9f4f30b69cf7",
		},
		{
			name: "Fern Lizard",
			size: "Small", type: "Beast",
			ac: 12, hp: 14, init: 2, cr: "1/2",
			alignment: alignments.unaligned,
			environments: [],
			id: "6ba203b8-fcd8-531c-8132-63d661d3d6be",
		},
		{
			name: "Luck Dragon",
			size: "Tiny", type: "Dragon",
			ac: 12, hp: 7, init: 2, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [],
			id: "5e68c5f1-4be0-53a3-b437-50e7afc8913a",
		},
		{
			name: "Gnoll Deathknight",
			size: "Medium", type: "Humanoid", tags: [ "Gnoll" ],
			ac: 17, hp: 120, init: 2, cr: "6",
			alignment: alignments.ce,
			environments: [],
			id: "db18b7ac-74da-56d2-94ac-576dd41bbe9c",
		},
		{
			name: "Fiendish Hyena",
			size: "Large", type: "Fiend",
			ac: 12, hp: 45, init: 1, cr: "2",
			alignment: alignments.ce,
			environments: [],
			id: "9ab66078-0d51-5ad0-b367-7b11ec247696",
		},
		{
			name: "Gnoll Deathmage",
			size: "Medium", type: "Humanoid", tags: [ "Gnoll" ],
			ac: 12, hp: 55, init: 2, cr: "7",
			alignment: alignments.ce,
			environments: [],
			id: "39d9c50f-5bc2-5de1-bea6-80e84dd86bd9",
		},
		{
			name: "Kobold Bully",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ],
			ac: 14, hp: 21, init: 2, cr: "1",
			alignment: alignments.le,
			environments: [],
			id: "5c7a660e-febe-5253-bdb3-00334c886ece",
		},
		{
			name: "Kobold Commander",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ],
			ac: 18, hp: 11, init: 1, cr: "1/2",
			alignment: alignments.le,
			environments: [],
			id: "8c408eef-4955-517b-a780-e604acee19b0",
		},
		{
			name: "Kobold Shaman",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ],
			ac: 13, hp: 27, init: 2, cr: "2",
			alignment: alignments.le,
			environments: [],
			id: "1bc1f162-c67a-5d1a-bfd5-cb8c27acae60",
		},
		{
			name: "Kobold Soldier",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ],
			ac: 15, hp: 7, init: 2, cr: "1/4",
			alignment: alignments.le,
			environments: [],
			id: "65866bec-846e-5717-89e7-1b593b41d78e",
		},
		{
			name: "Kobold Hero",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ],
			ac: 18, hp: 54, init: 2, cr: "4",
			alignment: alignments.le,
			environments: [],
			legendary: true,
			id: "3dca68a1-1e17-5291-a474-602075da5ee0",
		},
		{
			name: "Spirit",
			size: "Medium", type: "Undead",
			ac: 11, hp: 16, init: 1, cr: "1/2",
			alignment: alignments.any,
			environments: [],
			id: "46c49f1e-ece4-5713-a7d9-ece62dd64d0e",
		},
		{
			name: "Baneling",
			size: "Small", type: "Fiend", tags: [ "Demon" ],
			ac: 12, hp: 7, init: 2, cr: "1/2",
			alignment: alignments.ce,
			environments: [],
			id: "3bf8b6d5-48b9-5c67-abce-08864204d0bc",
		},
		{
			name: "Pact Devil",
			size: "Large", type: "Fiend", tags: [ "Devil" ],
			ac: 17, hp: 142, init: 3, cr: "9",
			alignment: alignments.le,
			environments: [],
			id: "f14e1cac-3f0b-5312-8927-720f4130e960",
		},
		{
			name: "Truesong Dancer",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 14, hp: 44, init: 3, cr: "3",
			alignment: alignments.cn,
			environments: [],
			id: "46f4e1d3-315b-5682-8c38-3445af06b159",
		},
		{
			name: "Truesong Dirge",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 16, hp: 91, init: 1, cr: "5",
			alignment: alignments.cn,
			environments: [],
			id: "d6000051-ecfd-5bf6-a7b2-8377bbacf114",
		},
		{
			name: "Leonin",
			size: "Medium", type: "Humanoid", tags: [ "Leonin" ],
			ac: 14, hp: 11, init: 2, cr: "1/4",
			alignment: alignments.any,
			environments: [],
			id: "4b87c32b-ed76-5713-b651-cdd186b4ee51",
		},
		{
			name: "Tuskaloth",
			size: "Gargantuan", type: "Beast",
			ac: 14, hp: 198, init: -1, cr: "10",
			alignment: alignments.unaligned,
			environments: [],
			id: "35022402-2e9b-5902-b195-31e3e3128775",
		},
		{
			name: "Clockwork Dragon",
			size: "Huge", type: "Construct",
			ac: 18, hp: 184, init: 0, cr: "14",
			alignment: alignments.unaligned,
			environments: [],
			legendary: true,
			id: "984ffc6a-48c5-5752-ab64-17b0c8e9b09f",
		},
		{
			name: "Arcanamite",
			size: "Small", type: "Monstrosity",
			ac: 15, hp: 27, init: 2, cr: "1",
			alignment: alignments.unaligned,
			environments: [],
			id: "c6d2824b-0c27-508d-ad1c-c9c6e045a8e8",
		},
		{
			name: "Gazellean",
			size: "Medium", type: "Humanoid", tags: [ "Gazellean" ],
			ac: 14, hp: 16, init: 3, cr: "1/2",
			alignment: alignments.n,
			environments: [],
			id: "86c8a930-7053-51af-9feb-a250233acf62",
		},
		{
			name: "Spellskite",
			size: "Large", type: "Construct",
			ac: 14, hp: 102, init: 2, cr: "5",
			alignment: alignments.unaligned,
			environments: [],
			id: "98a0cb71-6791-541f-90d7-fc586010e839",
		},
		{
			name: "Troll Boar",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 57, init: 0, cr: "3",
			alignment: alignments.ce,
			environments: [],
			id: "7f6ee622-ec69-52a8-a9de-62dd94df77ac",
		},
		{
			name: "Grove Guardian",
			size: "Large", type: "Fey",
			ac: 15, hp: 71, init: 3, cr: "5",
			alignment: alignments.n,
			environments: [],
			id: "1d99298b-976a-53eb-9100-1bc9cd2d37e0",
		},
		{
			name: "Silverpaw Dog",
			size: "Medium", type: "Fey",
			ac: 14, hp: 32, init: 3, cr: "1",
			alignment: alignments.n,
			environments: [],
			id: "212bc756-ae05-5452-b3b0-b7b3197b9384",
		},
		{
			name: "Silverpaw Paladin",
			size: "Small", type: "Humanoid", tags: [ "Halfling" ],
			ac: 15, hp: 65, init: 3, cr: "4",
			alignment: alignments.n,
			environments: [],
			id: "1500c9b6-65c4-5cb6-965f-454b09d853b1",
		},
		{
			name: "Dream Eater",
			size: "Large", type: "Aberration",
			ac: 17, hp: 133, init: 5, cr: "10",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "2c052371-15a4-5859-a35c-5e3a044de76a",
		},
		{
			name: "Coven Horror",
			size: "Large", type: "Monstrosity",
			ac: 15, hp: 123, init: 0, cr: "9",
			alignment: alignments.ce,
			environments: [],
			id: "6fb8d0a0-aa8a-53c6-afef-133981179bd7",
		},
		{
			name: "Burning Skeleton",
			size: "Medium", type: "Undead",
			ac: 15, hp: 26, init: 2, cr: "1",
			alignment: alignments.le,
			environments: [],
			id: "d983d439-66ba-512a-bb0f-4fbd5e512baf",
		},
		{
			name: "Eldrazi Scion",
			size: "Large", type: "Aberration",
			ac: 12, hp: 45, init: 2, cr: "1",
			alignment: alignments.ce,
			environments: [],
			id: "393c286b-0c0e-581f-a2fb-3711d00382a6",
		},
		{
			name: "Brood Monitor",
			size: "Huge", type: "Aberration",
			ac: 12, hp: 126, init: 2, cr: "7",
			alignment: alignments.ce,
			environments: [],
			id: "361e1f3d-3ca0-5c56-b651-e4fe1da80d29",
		},
		{
			name: "Brood Butcher",
			size: "Huge", type: "Aberration",
			ac: 14, hp: 184, init: 0, cr: "9",
			alignment: alignments.ce,
			environments: [],
			id: "df831f20-8493-59ea-9708-cb21adbe068c",
		},
		{
			name: "Sire of Stagnation",
			size: "Gargantuan", type: "Aberration",
			ac: 18, hp: 310, init: 0, cr: "17",
			alignment: alignments.ce,
			environments: [],
			id: "1e871052-ad86-5143-9643-1eb60e1a9c37",
		},
		{
			name: "Ulamog, the Ceaseless Hunger",
			size: "Colossal", type: "Aberration", tags: [ "Titan" ],
			ac: 25, hp: 717, init: 0, cr: "30",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "715fa170-48c8-5b1c-8473-62fa7bd8fe77",
		},
		{
			name: "Tentaghoul",
			size: "Large", type: "Undead",
			ac: 13, hp: 76, init: -1, cr: "3",
			alignment: alignments.ce,
			environments: [],
			id: "ea36ebf6-3fb3-5098-b38f-77e66298954d",
		},
		{
			name: "Death Widow",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 60, init: 3, cr: "3",
			alignment: alignments.unaligned,
			environments: [],
			id: "9490dc31-e70b-5585-a185-bb43445262b9",
		},
		{
			name: "Screecher",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 45, init: 2, cr: "2",
			alignment: alignments.n,
			environments: [],
			id: "63473bc9-006e-52b2-8a8a-f69a2be556de",
		},
		{
			name: "Gladeborn Trapper",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 16, hp: 52, init: 3, cr: "3",
			alignment: alignments.n,
			environments: [],
			id: "c1080389-7eb6-5f7c-a6d8-1db800992f82",
		},
		{
			name: "Gladeborn Hunter",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 16, hp: 91, init: 4, cr: "5",
			alignment: alignments.n,
			environments: [],
			id: "b024b624-9bbe-5f0a-9b02-027fc42365ac",
		},
		{
			name: "Spider Skull",
			size: "Tiny", type: "Undead",
			ac: 13, hp: 13, init: 3, cr: "1/2",
			alignment: alignments.ne,
			environments: [],
			id: "ae587e7a-dcd7-5c4b-b4d7-eeae5b167a8b",
		},
		{
			name: "Swarm of Squirrels",
			size: "Medium", type: "Beast", tags: [ "Swarm" ],
			ac: 14, hp: 36, init: 4, cr: "2",
			alignment: alignments.unaligned,
			environments: [],
			id: "385b9e74-056e-5f8f-af84-82a8a3f369c1",
		},
		{
			name: "Ginormous Squirrel",
			size: "Gargantuan", type: "Beast",
			ac: 20, hp: 248, init: 3, cr: "16",
			alignment: alignments.unaligned,
			environments: [],
			legendary: true,
			id: "90f3f751-373a-5d25-ba22-1d03e39398bf",
		},
		{
			name: "Verdalin",
			size: "Small", type: "Fey",
			ac: 13, hp: 18, init: 3, cr: "1/2",
			alignment: alignments.n,
			environments: [],
			id: "e1d6d3fc-8f5f-5aba-b531-471f5659051c",
		},
		{
			name: "Owlbear Matron",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 114, init: 2, cr: "5",
			alignment: alignments.unaligned,
			environments: [],
			id: "837f7fa0-d9a6-5a3a-a99a-1df012f90a39",
		},
		{
			name: "Snow Spider",
			size: "Large", type: "Beast",
			ac: 13, hp: 65, init: 2, cr: "3",
			alignment: alignments.unaligned,
			environments: [],
			id: "a896ebd5-dbb4-5efa-a3ef-90de48d771e8",
		},
		{
			name: "Winter Sprite",
			size: "Tiny", type: "Fey",
			ac: 15, hp: 7, init: 5, cr: "1",
			alignment: alignments.cn,
			environments: [],
			id: "85985297-b434-5c7a-9a03-39dca982c613",
		},
		{
			name: "Wight Walker",
			size: "Medium", type: "Undead",
			ac: 14, hp: 112, init: 2, cr: "6",
			alignment: alignments.ne,
			environments: [],
			id: "6159d5f3-547e-5a37-9519-cf0d0237f350",
		},
		{
			name: "Ice Golem",
			size: "Large", type: "Construct",
			ac: 16, hp: 152, init: 0, cr: "8",
			alignment: alignments.unaligned,
			environments: [],
			id: "abb92d58-da93-557d-a0fe-e9088b1a3f56",
		},
		{
			name: "Frost Giant Jarl",
			size: "Huge", type: "Giant",
			ac: 16, hp: 187, init: 0, cr: "11",
			alignment: alignments.ne,
			environments: [],
			legendary: true,
			id: "f48f3757-ba7f-5476-80ba-a09c3042543d",
		},
		{
			name: "Rusalka",
			size: "Medium", type: "Fey", tags: [ "Undead" ],
			ac: 17, hp: 97, init: 4, cr: "4",
			alignment: alignments.ne,
			environments: [],
			id: "44750eef-c3ac-51b1-b62f-5538630d38df",
		},
		{
			name: "Clockwork Pest",
			size: "Tiny", type: "Construct",
			ac: 14, hp: 7, init: 3, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [],
			id: "7f2bcc7b-9b97-5091-8309-77cac5232369",
		},
		{
			name: "Froghoul",
			size: "Medium", type: "Undead",
			ac: 14, hp: 27, init: 3, cr: "2",
			alignment: alignments.ce,
			environments: [],
			id: "c378b19d-65dc-5c65-866e-485f893a69cd",
		},
		{
			name: "Azure Enchanter",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 12, hp: 49, init: 2, cr: "7",
			alignment: alignments.any,
			environments: [],
			id: "3ebf14e5-778b-5dfc-a261-5ea9d291f6f9",
		},
		{
			name: "Azure Mind Scupltor",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 12, hp: 84, init: 2, cr: "10",
			alignment: alignments.any,
			environments: [],
			id: "caa85158-2825-5bde-9efd-645058ba6816",
		},
		{
			name: "Infestation Swarm",
			size: "Medium", type: "Swarm",
			ac: 14, hp: 44, init: 4, cr: "4",
			alignment: alignments.unaligned,
			environments: [],
			id: "f00c0b0d-3f6a-5072-afd4-53517987af03",
		},
		{
			name: "Living Spellbook",
			size: "Large", type: "Construct",
			ac: 14, hp: 90, init: 4, cr: "10",
			alignment: alignments.unaligned,
			environments: [],
			id: "2effdaec-6978-55c6-a67d-a85a55f3983b",
		},
		{
			name: "War Titan",
			size: "Huge", type: "Fiend", tags: [ "Titan" ],
			ac: 18, hp: 207, init: 0, cr: "16",
			alignment: alignments.any_chaotic,
			environments: [],
			legendary: true,
			id: "8489ece9-af4a-5494-b040-1796f3040318",
		},
		{
			name: "Magma Bear",
			size: "Large", type: "Elemental",
			ac: 13, hp: 75, init: 0, cr: "3",
			alignment: alignments.n,
			environments: [],
			id: "a5182d00-2561-5858-9202-81b512fc19ee",
		},
		{
			name: "Caustic Crawler",
			size: "Medium", type: "Monstrosity",
			ac: 14, hp: 102, init: 1, cr: "4",
			alignment: alignments.unaligned,
			environments: [],
			id: "c9e17c19-2e1c-52a7-af0b-a3e4e909a8be",
		},
		{
			name: "Evil Doll",
			size: "Tiny", type: "Construct", tags: [ "Fiend" ],
			ac: 14, hp: 21, init: 3, cr: "2",
			alignment: alignments.le,
			environments: [],
			id: "737d6217-c3da-57e6-85c9-c7f1546a74ce",
		},
		{
			name: "Gill-man",
			size: "Medium", type: "Monstrosity",
			ac: 16, hp: 102, init: 3, cr: "6",
			alignment: alignments.n,
			environments: [],
			id: "ee032904-c71c-553b-b3ac-f3b267dc6914",
		},
		{
			name: "Masked Killer",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 15, hp: 97, init: 3, cr: "5",
			alignment: alignments.ce,
			environments: [],
			id: "ec9f15d5-6c20-5c82-964a-c75a3739098c",
		},
		{
			name: "Headless Horseman",
			size: "Medium", type: "Fiend",
			ac: 15, hp: 153, init: 3, cr: "8",
			alignment: alignments.le,
			environments: [],
			id: "4fe1572b-5acb-55d9-9773-be0aa79d0c62",
		},
		{
			name: "Pumpkin King",
			size: "Huge", type: "Plant",
			ac: 17, hp: 225, init: 0, cr: "13",
			alignment: alignments.unaligned,
			environments: [],
			legendary: true,
			id: "3a01c90d-aae7-531a-9491-af8f00f720b1",
		},
		{
			name: "Winged Ape",
			size: "Medium", type: "Monstrosity",
			ac: 13, hp: 39, init: 2, cr: "2",
			alignment: alignments.n,
			environments: [],
			id: "ab1e249e-377f-53c8-b508-a0c78fe3b1bc",
		},
		{
			name: "Feyote",
			size: "Medium", type: "Fey",
			ac: 12, hp: 11, init: 2, cr: "1/4",
			alignment: alignments.n,
			environments: [],
			id: "e514a47e-37bf-5f24-88c1-f27d22ce589b",
		},
		{
			name: "Scorpikis",
			size: "Large", type: "Monstrosity",
			ac: 17, hp: 123, init: 3, cr: "6",
			alignment: alignments.ce,
			environments: [],
			id: "da89e087-058e-5d11-b7df-85a3cdd7a9a6",
		},
		{
			name: "Ancient Chronomancer",
			size: "Medium", type: "Construct",
			ac: 16, hp: 67, init: 2, cr: "7",
			alignment: alignments.n,
			environments: [],
			id: "e2b67f99-65e9-584e-9189-6506c71971ba",
		},
		{
			name: "Timeless Chronomancer",
			size: "Medium", type: "Construct",
			ac: 18, hp: 150, init: 2, cr: "14",
			alignment: alignments.n,
			environments: [],
			id: "52f02835-820d-5dc6-9c86-14b11dd11532",
		},
		{
			name: "Hawkfox",
			size: "Medium", type: "Monstrosity",
			ac: 13, hp: 38, init: 3, cr: "2",
			alignment: alignments.unaligned,
			environments: [],
			id: "0db8adb1-5dfb-517a-95bc-2bc16851c552",
		},
		{
			name: "Sylvan Stalker",
			size: "Medium", type: "Humanoid", tags: [ "Plant" ],
			ac: 15, hp: 78, init: 4, cr: "8",
			alignment: alignments.n,
			environments: [],
			id: "b5ba63d2-4eb9-5328-98e9-3cd51ea24dc5",
		},
		{
			name: "Werewolf Alpha",
			size: "Medium", type: "Humanoid",
			ac: 16, hp: 119, init: 2, cr: "9",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "123f6378-24e4-5b67-bebe-2f4b5ebb3c3d",
		},
		{
			name: "Technothug",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 16, hp: 19, init: 2, cr: "1/2",
			alignment: alignments.cn,
			environments: [],
			id: "cb35c29c-3459-5048-b75b-14e92d9b1bfc",
		},
		{
			name: "Chainer Geist",
			size: "Medium", type: "Undead",
			ac: 11, hp: 45, init: 4, cr: "4",
			alignment: alignments.ce,
			environments: [],
			id: "78580f59-20b6-5dfa-b358-6423529dd856",
		},
		{
			name: "Bullywug Shaman",
			size: "Medium", type: "Humanoid", tags: [ "Bullywug" ],
			ac: 14, hp: 27, init: 2, cr: "2",
			alignment: alignments.ne,
			environments: [],
			id: "b1f4e1b6-1da1-5da1-92f3-090bf8640d7c",
		},
		{
			name: "Goblin Alchemist",
			size: "Small", type: "Humanoid", tags: [ "Goblinoid" ],
			ac: 14, hp: 10, init: 2, cr: "1/2",
			alignment: alignments.ne,
			environments: [],
			id: "7f1cd765-a57b-5a3b-8e43-662a54e14d6e",
		},
		{
			name: "Goblin Ritualist",
			size: "Small", type: "Humanoid", tags: [ "Goblinoid" ],
			ac: 14, hp: 10, init: 2, cr: "1/2",
			alignment: alignments.ne,
			environments: [],
			id: "ee072afa-6337-557e-b9d0-d817210423dd",
		},
		{
			name: "Lizardfolk Monk",
			size: "Medium", type: "Humanoid", tags: [ "Lizardfolk" ],
			ac: 17, hp: 33, init: 3, cr: "2",
			alignment: alignments.n,
			environments: [],
			id: "10f2d054-d274-526a-8097-9f3921abc1c2",
		},
		{
			name: "Orc Berserker",
			size: "Medium", type: "Humanoid", tags: [ "Orc" ],
			ac: 14, hp: 30, init: 1, cr: "1",
			alignment: alignments.ce,
			environments: [],
			id: "f193a293-ade1-5b5f-98f4-b34980bd2cdc",
		},
		{
			name: "Orc Hand of Gruumsh",
			size: "Medium", type: "Humanoid", tags: [ "Orc" ],
			ac: 16, hp: 60, init: 1, cr: "3",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "81295b69-4438-5c59-9622-6a1f31ac8115",
		},
		{
			name: "Crystal Elemental",
			size: "Medium", type: "Elemental",
			ac: 15, hp: 57, init: 1, cr: "3",
			alignment: alignments.n,
			environments: [],
			id: "4b78c693-794c-5e30-a23c-e33f8c65dc75",
		},
		{
			name: "Armed Skeleton",
			size: "Medium", type: "Undead",
			ac: 13, hp: 26, init: 2, cr: "1",
			alignment: alignments.le,
			environments: [],
			id: "27d3cf23-0e72-5c9b-9a94-628c561529e4",
		},
		{
			name: "Dire Anglerfish",
			size: "Huge", type: "Beast",
			ac: 13, hp: 105, init: 2, cr: "5",
			alignment: alignments.unaligned,
			environments: [],
			id: "197fcb81-d34e-55e5-abc5-9a1275cf017f",
		},
		{
			name: "Pirate Axe Thrower",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 13, hp: 55, init: 2, cr: "2",
			alignment: alignments.non_lawful,
			environments: [],
			id: "1f81997d-fd0a-5ea9-b813-baab00fd9676",
		},
		{
			name: "Pirate Chain Swinger",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ],
			ac: 15, hp: 66, init: 3, cr: "3",
			alignment: alignments.non_lawful,
			environments: [],
			id: "dc7cf588-46c1-56d4-97cb-7c86cd1055b9",
		},
		{
			name: "Crowlock",
			size: "Tiny", type: "Monstrosity",
			ac: 13, hp: 10, init: 3, cr: "1/2",
			alignment: alignments.cn,
			environments: [],
			id: "f16c46ce-12e0-56e1-a295-85938fa93bc7",
		},
		{
			name: "Vodyanoy",
			size: "Medium", type: "Monstrosity",
			ac: 16, hp: 119, init: 3, cr: "5",
			alignment: alignments.cn,
			environments: [],
			id: "a3bfe860-8cc3-5ce3-8afe-986a55461553",
		},
		{
			name: "Crystalline Dragon",
			size: "Huge", type: "Dragon",
			ac: 20, hp: 270, init: 2, cr: "18",
			alignment: alignments.any_chaotic,
			environments: [],
			legendary: true,
			id: "7f194628-94f6-579c-862b-ac98afc84cd2",
		},
		{
			name: "Beast of Ill Omen",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 45, init: 2, cr: "2",
			alignment: alignments.ce,
			environments: [],
			id: "30890370-b47a-53c9-bf60-303294d9fc09",
		},
		{
			name: "Chamaelean",
			size: "Small", type: "Humanoid", tags: [ "Chamaelean" ],
			ac: 14, hp: 10, init: 2, cr: "1/2",
			alignment: alignments.n,
			environments: [],
			id: "f48a544b-f17d-5541-852d-afad6438e907",
		},
		{
			name: "Phelddagrif",
			size: "Huge", type: "Celestial",
			ac: 14, hp: 105, init: -1, cr: "5",
			alignment: alignments.ng,
			environments: [],
			id: "c7ee7278-4db9-5dcb-9259-bdaaf26e1b3d",
		},
		{
			name: "Stone Strix",
			size: "Huge", type: "Monstrosity",
			ac: 16, hp: 147, init: 3, cr: "8",
			alignment: alignments.unaligned,
			environments: [],
			id: "fb44e9eb-1edd-59f5-bbce-9ac84f631e71",
		},
		{
			name: "Aaztar-Ghola",
			size: "Medium", type: "Humanoid",
			ac: 13, hp: 38, init: 0, cr: "4",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "8858bfe7-3e4f-4614-9f37-4411493b22cf",
		},
		{
			name: "Adherer",
			size: "Medium", type: "Aberration",
			ac: 13, hp: 45, init: 1, cr: "2",
			alignment: alignments.le,
			environments: [ "forest", "underground" ],
			legendary: false,
			id: "e481ef5e-679d-4afe-b21e-7b31b6a1b6a6",
		},
		{
			name: "Aerial Servant",
			size: "Medium", type: "Fiend",
			ac: 18, hp: 152, init: 4, cr: "9",
			alignment: alignments.n,
			environments: [],
			legendary: false,
			id: "34aa1e77-a133-4bfa-a01d-b364fa9cd3b3",
		},
		{
			name: "Algoid",
			size: "Medium", type: "Plant",
			ac: 14, hp: 52, init: 0, cr: "3",
			alignment: alignments.n,
			environments: [ "swamp" ],
			legendary: false,
			id: "eeec8e91-0b42-4231-a782-a9ac8d1baa31",
		},
		{
			section: "Amphorons of Yothri", name: "Worker",
			size: "Small", type: "Construct",
			ac: 17, hp: 13, init: 0, cr: "1/2",
			alignment: alignments.n,
			environments: [],
			legendary: false,
			id: "37f04c1c-c541-46ae-8711-9a124d481108",
		},
		{
			section: "Amphorons of Yothri", name: "Warrior",
			size: "Medium", type: "Construct",
			ac: 17, hp: 33, init: 0, cr: "2",
			alignment: alignments.n,
			environments: [],
			legendary: false,
			id: "5c66baa2-20cb-4d18-9c71-b43add3b467f",
		},
		{
			section: "Amphorons of Yothri", name: "Juggernaut",
			size: "Large", type: "Construct",
			ac: 17, hp: 102, init: 0, cr: "6",
			alignment: alignments.n,
			environments: [],
			legendary: false,
			id: "f6eb324c-4236-440f-9708-7e6457bbd5b8",
		},
		{
			name: "Ant Lion",
			size: "Large", type: "Beast",
			ac: 15, hp: 93, init: 0, cr: "4",
			alignment: alignments.unaligned,
			environments: [ "desert" ],
			legendary: false,
			id: "fb39c66d-2d1b-465c-b790-250b7236a06b",
		},
		{
			name: "Flying Ape",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 45, init: 2, cr: "2",
			alignment: alignments.cn,
			environments: [],
			legendary: false,
			id: "cf00a20a-5160-41a3-9c33-53cdf9fbc7aa",
		},
		{
			name: "Arenea",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 39, init: 3, cr: "3",
			alignment: alignments.ce,
			environments: [ "forest", "cave", "dungeon" ],
			legendary: false,
			id: "9c48d00c-7ef1-4779-b733-b64becac876c",
		},
		{
			name: "Arcanoplasm",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 103, init: -2, cr: "4",
			alignment: alignments.n,
			environments: [ "underground" ],
			legendary: false,
			id: "0c83f120-fc3b-416d-a660-3eec3a09cbc9",
		},
		{
			name: "Artificer of Yothri",
			size: "Medium", type: "Aberration",
			ac: 16, hp: 66, init: 2, cr: "5",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "fc957e94-6739-4aa8-a58e-946e96c924d6",
		},
		{
			name: "Ascomoid",
			size: "Large", type: "Plant", tags: [ "Fungoid" ], 
			ac: 12, hp: 76, init: 1, cr: "3",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "24f44c14-a6b4-48e0-a985-52bcd71c867b",
		},
		{
			name: "Assassin Bug",
			size: "Medium", type: "Beast",
			ac: 16, hp: 120, init: 3, cr: "5",
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			legendary: false,
			id: "3889f8b7-6727-4edd-9694-27dfd206b541",
		},
		{
			name: "Astral Moth",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 32, init: 2, cr: "1/8",
			alignment: alignments.n,
			environments: [ "forest" ],
			legendary: false,
			id: "547e770c-ae8c-48fe-84b4-5e4dd901fdde",
		},
		{
			name: "Astral Shark",
			size: "Large", type: "Fiend",
			ac: 14, hp: 102, init: 2, cr: "5",
			alignment: alignments.n,
			environments: [ "planar" ],
			legendary: false,
			id: "98a090a3-c223-4d46-944a-0c03fb1d7fa9",
		},
		{
			name: "Aurumvorax (Golden Gorger)",
			size: "Small", type: "Monstrosity",
			ac: 16, hp: 78, init: 5, cr: "5",
			alignment: alignments.unaligned,
			environments: [ "forest", "grassland" ],
			legendary: false,
			id: "aa4af6ea-b5d7-454f-b149-7eb71ecea5f8",
		},
		{
			section: "Basilisks", name: "Crimson Basilisk",
			size: "Medium", type: "Monstrosity",
			ac: 13, hp: 60, init: 0, cr: "3",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "c4ee0612-11fc-4327-a641-2fc5cd6f5ee6",
		},
		{
			section: "Basilisks", name: "Greater Basilisk",
			size: "Large", type: "Monstrosity",
			ac: 16, hp: 95, init: -1, cr: "5",
			alignment: alignments.ne,
			environments: [ "desert" ],
			legendary: false,
			id: "c096015a-9bff-483e-b0c7-b67a948c59b1",
		},
		{
			name: "Doombat",
			size: "Large", type: "Monstrosity",
			ac: 15, hp: 59, init: 5, cr: "3",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "5f0cee9e-673f-419e-b4c6-bd45efe7fddd",
		},
		{
			name: "Giant Rhinoceros Beetle",
			size: "Large", type: "Beast",
			ac: 18, hp: 95, init: 0, cr: "4",
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			legendary: false,
			id: "b5a7f95d-023a-48ac-b87d-aee218afd4ce",
		},
		{
			name: "Giant Slicer Beetle",
			size: "Large", type: "Beast",
			ac: 15, hp: 59, init: 0, cr: "3",
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			legendary: false,
			id: "dc62f7b1-fc36-4e85-afa3-4cf25d0cabeb",
		},
		{
			name: "Giant Water Beetle",
			size: "Medium", type: "Beast", tags: [ "Aquatic" ], 
			ac: 14, hp: 30, init: 1, cr: "1/2",
			alignment: alignments.unaligned,
			environments: [ "aquatic" ],
			legendary: false,
			id: "a97cd7b9-152c-48f2-8908-5f08da9a5027",
		},
		{
			name: "Biclops",
			size: "Huge", type: "Giant",
			ac: 13, hp: 115, init: 1, cr: "6",
			alignment: alignments.n,
			environments: [ "mountain" ],
			legendary: false,
			id: "c3a84c7f-8036-4b60-81af-8be8a4b721f4",
		},
		{
			name: "Blood Hawk",
			size: "Small", type: "Monstrosity",
			ac: 13, hp: 5, init: 3, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "forest", "grassland", "mountain" ],
			legendary: false,
			id: "3460ab4e-0c73-46da-8264-c3cd738098ca",
		},
		{
			section: "Blood Orchid", name: "Blood Orchid",
			size: "Large", type: "Aberration",
			ac: 14, hp: 85, init: 1, cr: "5",
			alignment: alignments.ce,
			environments: [ "underground" ],
			legendary: false,
			id: "33f8a198-101e-42c8-9dc0-a30e427aec76",
		},
		{
			section: "Blood Orchid", name: "Blood Orchid Savant",
			size: "Large", type: "Aberration",
			ac: 15, hp: 82, init: 2, cr: "7",
			alignment: alignments.le,
			environments: [ "underground" ],
			legendary: false,
			id: "2c76f25c-fea5-41aa-95cd-9b3cff17aa5a",
		},
		{
			section: "Blood Orchid", name: "Blood Orchid Grand Savant",
			size: "Huge", type: "Aberration",
			ac: 16, hp: 136, init: 1, cr: "9",
			alignment: alignments.le,
			environments: [ "underground" ],
			legendary: false,
			id: "61486dcd-aea5-47a3-93b9-699578f57a2f",
		},
		{
			name: "Bloodsuckle",
			size: "Large", type: "Plant",
			ac: 13, hp: 57, init: 0, cr: "3",
			alignment: alignments.unaligned,
			environments: [ "grassland", "forest" ],
			legendary: false,
			id: "b909141f-f103-4c1b-a2f0-8c201a9d297f",
		},
		{
			name: "Bloody Bones",
			size: "Medium", type: "Undead",
			ac: 13, hp: 27, init: 1, cr: "2",
			alignment: alignments.ce,
			environments: [ "cave", "ruins" ],
			legendary: false,
			id: "7b554986-d466-4559-9165-7ae87e45f207",
		},
		{
			name: "Boalisk",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 39, init: 2, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "forest", "aquatic" ],
			legendary: false,
			id: "d8e494ed-78cb-411d-981b-6879c0654447",
		},
		{
			name: "Bone Cobbler",
			size: "Medium", type: "Aberration",
			ac: 13, hp: 22, init: 2, cr: "2",
			alignment: alignments.ce,
			environments: [ "underground" ],
			legendary: false,
			id: "8be204a1-450f-426f-a443-4a34d053088b",
		},
		{
			section: "Boneneedle", name: "Greater Boneneedle",
			size: "Medium", type: "Beast",
			ac: 13, hp: 31, init: 3, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "8fe9fbdc-e6bf-4c7f-b64b-3b537589a5df",
		},
		{
			section: "Boneneedle", name: "Lesser Boneneedle",
			size: "Small", type: "Beast",
			ac: 12, hp: 13, init: 2, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "14c8179e-6309-4d15-8c4a-8950209fbaff",
		},
		{
			name: "Bonesucker",
			size: "Large", type: "Aberration",
			ac: 15, hp: 68, init: 1, cr: "4",
			alignment: alignments.ne,
			environments: [ "underground" ],
			legendary: false,
			id: "06ed1123-cff6-4c57-8a3f-3021759e1030",
		},
		{
			name: "Borsin (Ape Centaur)",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 60, init: 2, cr: "3",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "ef3f7368-89b7-4ca1-aed4-cbdb44766fc0",
		},
		{
			name: "Brass Man",
			size: "Large", type: "Construct",
			ac: 18, hp: 95, init: 0, cr: "6",
			alignment: alignments.unaligned,
			environments: [ "planar" ],
			legendary: false,
			id: "1b899f2f-eda5-4196-9f9f-f6a5352d2850",
		},
		{
			name: "Brume",
			size: "Large", type: "Aberration",
			ac: 16, hp: 90, init: 3, cr: "6",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "30608f1b-aa83-43f8-b26a-ae1bedda7d52",
		},
		{
			name: "Burning Dervish",
			size: "Medium", type: "Fiend",
			ac: 16, hp: 65, init: 3, cr: "3",
			alignment: alignments.le,
			environments: [ "planar" ],
			legendary: false,
			id: "652e7842-051a-40ac-988d-a5a382142c96",
		},
		{
			name: "Cadaver",
			size: "Medium", type: "Undead",
			ac: 11, hp: 15, init: 1, cr: "1/2",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "e290d910-5ec3-42bb-90b6-6e27e4b1cb28",
		},
		{
			name: "Cadaver Lord",
			size: "Medium", type: "Undead",
			ac: 15, hp: 45, init: 2, cr: "3",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "e56ff88a-f223-4d90-b555-dc847b9cdafa",
		},
		{
			name: "Carbuncle",
			size: "Small", type: "Aberration",
			ac: 11, hp: 4, init: 0, cr: "1/8",
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			legendary: false,
			id: "eaeb0ca9-3904-4c36-b2c6-e4e178ded00a",
		},
		{
			name: "Caryatid Column",
			size: "Medium", type: "Construct",
			ac: 14, hp: 30, init: -1, cr: "1",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "ec0b8eb1-51f1-4dc3-ad1f-eec948e90724",
		},
		{
			name: "Feral Undead Cat",
			size: "Small", type: "Undead",
			ac: 12, hp: 3, init: 2, cr: "1/8",
			alignment: alignments.ce,
			environments: [ "ruins" ],
			legendary: false,
			id: "877eeff7-a54d-4beb-b94d-490a917a3c98",
		},
		{
			name: "Caterprism",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 87, init: 1, cr: "4",
			alignment: alignments.unaligned,
			environments: [ "planar" ],
			legendary: false,
			id: "082fc525-a4e5-41aa-8ccb-d1ec6d80a9ab",
		},
		{
			name: "Giant Electric Catfish",
			size: "Large", type: "Beast", tags: [ "Aquatic" ], 
			ac: 12, hp: 68, init: 2, cr: "3",
			alignment: alignments.unaligned,
			environments: [ "aquatic" ],
			legendary: false,
			id: "c1b7bebb-222f-4e83-a7b9-885fb8b958d1",
		},
		{
			name: "Catoblepas",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 76, init: 0, cr: "5",
			alignment: alignments.unaligned,
			environments: [ "swamp" ],
			legendary: false,
			id: "f6c69373-bbab-47e9-a255-dc660cb96843",
		},
		{
			name: "Cave Cricket",
			size: "Small", type: "Beast",
			ac: 13, hp: 5, init: 2, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "06f1b52b-0cfb-48a2-83f5-b548523cf24f",
		},
		{
			name: "Cave Eel",
			size: "Medium", type: "Beast",
			ac: 12, hp: 9, init: 2, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "cave", "dungeon" ],
			legendary: false,
			id: "6becceec-276c-42b0-8fa8-1c2ff87d84a9",
		},
		{
			name: "Cave Fisher",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 51, init: 2, cr: "2",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "431a88c4-19f8-4a5e-8861-1102ab2766cc",
		},
		{
			name: "Cave Leech",
			size: "Large", type: "Beast",
			ac: 10, hp: 102, init: 2, cr: "6",
			alignment: alignments.ce,
			environments: [ "underground" ],
			legendary: false,
			id: "27c84aed-9b9e-496a-9b2f-e8d36925b464",
		},
		{
			name: "Centipede Nest",
			size: "Medium", type: "Swarm", tags: [ "of Tiny Beasts" ], 
			ac: 11, hp: 22, init: 2, cr: "1/2",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "b25b5ed8-7ad5-48e6-bc4b-ea14fb6e5e22",
		},
		{
			name: "Cerebral Stalker",
			size: "Medium", type: "Aberration",
			ac: 16, hp: 85, init: 2, cr: "5",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "21294951-6251-4e74-b166-30726b85c3d4",
		},
		{
			name: "Chain Worm",
			size: "Large", type: "Beast",
			ac: 21, hp: 161, init: 3, cr: "12",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "6cb45236-ed84-468d-bb44-fc6b4ee27ef9",
		},
		{
			name: "Chaos Knight",
			size: "Medium", type: "Fiend",
			ac: 16, hp: 78, init: 2, cr: "3",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "388f5263-8df5-4b78-9469-dc82f25ea0d5",
		},
		{
			name: "Chupacabra",
			size: "Small", type: "Humanoid",
			ac: 12, hp: 27, init: 2, cr: "1",
			alignment: alignments.cn,
			environments: [ "forest", "urban" ],
			legendary: false,
			id: "b0c06424-9fc5-4c34-82ac-a1f3c2507b96",
		},
		{
			name: "Church Grim",
			size: "Medium", type: "Monstrosity", tags: [ "Incorporeal" ], 
			ac: 12, hp: 32, init: 2, cr: "1",
			alignment: alignments.lg,
			environments: [],
			legendary: false,
			id: "6874540a-1b44-4082-9e01-8abae4f99109",
		},
		{
			name: "Churr",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 57, init: 2, cr: "4",
			alignment: alignments.ne,
			environments: [ "forest" ],
			legendary: false,
			id: "3e1e5b6f-12c9-4b4c-8043-7b9283be7212",
		},
		{
			section: "Cimota", name: "Cimota",
			size: "Medium", type: "Undead",
			ac: 15, hp: 44, init: 3, cr: "2",
			alignment: alignments.le,
			environments: [],
			legendary: false,
			id: "1ba27eaa-c952-40c8-92f9-3073e1d9fc51",
		},
		{
			section: "Cimota", name: "Cimota Guardian",
			size: "Medium", type: "Undead",
			ac: 16, hp: 71, init: 3, cr: "4",
			alignment: alignments.le,
			environments: [],
			legendary: false,
			id: "5013a4e9-6072-49e3-a287-25cb0d43cf58",
		},
		{
			section: "Cimota", name: "High Cimota",
			size: "Medium", type: "Undead",
			ac: 17, hp: 99, init: 4, cr: "6",
			alignment: alignments.le,
			environments: [],
			legendary: false,
			id: "bdbbcb95-28fb-42af-a0e8-8becba855486",
		},
		{
			name: "Giant Clam",
			size: "Large", type: "Beast",
			ac: 14, hp: 22, init: 0, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "aquatic" ],
			legendary: false,
			id: "9ab9a2e0-347f-4645-9ac5-920e4109e442",
		},
		{
			name: "Clamor",
			size: "Medium", type: "Aberration", tags: [ "Incorporeal", "Extraplanar" ], 
			ac: 17, hp: 45, init: 7, cr: "2",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "61f8ab2e-a308-41d4-b063-3064babc0b7c",
		},
		{
			name: "Cobra Flower",
			size: "Large", type: "Plant",
			ac: 11, hp: 51, init: 1, cr: "2",
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			legendary: false,
			id: "a0d04c1f-e306-46dc-a483-049cdbef3bf1",
		},
		{
			name: "Coffer Corpse",
			size: "Medium", type: "Undead",
			ac: 12, hp: 45, init: 1, cr: "2",
			alignment: alignments.ce,
			environments: [ "underground" ],
			legendary: false,
			id: "e0b158b9-6847-4e07-92e8-149baadd0f06",
		},
		{
			name: "Cooshee",
			size: "Medium", type: "Monstrosity",
			ac: 13, hp: 13, init: 3, cr: "1",
			alignment: alignments.ng,
			environments: [ "forest" ],
			legendary: false,
			id: "5d2e03d9-7593-4d9f-9dee-c2eb8637d9fb",
		},
		{
			name: "Corpse Rook",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 45, init: 2, cr: "4",
			alignment: alignments.ne,
			environments: [ "grassland" ],
			legendary: false,
			id: "c73a2904-8c96-443a-96db-45c2d9c8308e",
		},
		{
			name: "Corpsespinner",
			size: "Huge", type: "Monstrosity", tags: [ "Extraplanar" ], 
			ac: 17, hp: 114, init: 3, cr: "5",
			alignment: alignments.unaligned,
			environments: [ "planar" ],
			legendary: false,
			id: "1e4d6002-0f2d-499a-9a7c-c07dc1369904",
		},
		{
			name: "Corpsespun",
			size: "Medium", type: "Undead",
			ac: 11, hp: 44, init: 1, cr: "1",
			alignment: alignments.n,
			environments: [ "planar" ],
			legendary: false,
			id: "15aca2d5-5da4-4a41-b4e3-eb926d6a3bcd",
		},
		{
			name: "Crabman",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 22, init: 0, cr: "1",
			alignment: alignments.n,
			environments: [ "aquatic" ],
			legendary: false,
			id: "f627523a-7a8d-4914-9709-a827f15e2ab1",
		},
		{
			name: "Monstrous Crayfish",
			size: "Large", type: "Beast", tags: [ "Aquatic" ], 
			ac: 14, hp: 45, init: 0, cr: "2",
			alignment: alignments.unaligned,
			environments: [ "aquatic" ],
			legendary: false,
			id: "a5a46e43-0367-4dd0-80e7-727a06f49c1e",
		},
		{
			name: "Crimson Mist",
			size: "Medium", type: "Aberration",
			ac: 17, hp: 127, init: 4, cr: "7",
			alignment: alignments.ne,
			environments: [ "swamp", "underground" ],
			legendary: false,
			id: "2e242225-28d7-4656-9199-445bdbec57fe",
		},
		{
			name: "Crypt Thing",
			size: "Medium", type: "Undead",
			ac: 15, hp: 52, init: 2, cr: "3",
			alignment: alignments.n,
			environments: [ "underground" ],
			legendary: false,
			id: "37a66de3-f1d3-4927-9761-bcc3ee9ccaed",
		},
		{
			name: "Dagon",
			size: "Large", type: "Fiend", tags: [ "Aquatic" ], 
			ac: 19, hp: 287, init: 4, cr: "20",
			alignment: alignments.ce,
			environments: [ "aquatic", "planar" ],
			legendary: true,
			id: "9fca5d72-502a-42e9-9712-d27ee1af479c",
		},
		{
			section: "Dark Folk", name: "Dark Creeper",
			size: "Small", type: "Humanoid",
			ac: 15, hp: 16, init: 3, cr: "1/4",
			alignment: alignments.cn,
			environments: [ "underground" ],
			legendary: false,
			id: "bb2f95fd-8125-40b5-bc22-c671f0dc4dc1",
		},
		{
			section: "Dark Folk", name: "Dark Stalker",
			size: "Medium", type: "Humanoid",
			ac: 15, hp: 48, init: 4, cr: "2",
			alignment: alignments.cn,
			environments: [ "underground" ],
			legendary: false,
			id: "a58f7528-0727-46a9-b382-52e3061f1a25",
		},
		{
			name: "Darno",
			size: "Medium", type: "Undead",
			ac: 12, hp: 52, init: 2, cr: "2",
			alignment: alignments.le,
			environments: [],
			legendary: false,
			id: "5af1c32d-ba8d-4b68-8258-ad58f9c586a2",
		},
		{
			name: "Death Dog",
			size: "Medium", type: "Monstrosity",
			ac: 13, hp: 26, init: 2, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "desert" ],
			legendary: false,
			id: "c8951c4f-344e-43b2-b347-7bfeb1342d95",
		},
		{
			name: "Death Worm",
			size: "Large", type: "Monstrosity",
			ac: 15, hp: 59, init: 1, cr: "3",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "d8340df1-64e8-4504-b4f3-fbb37815557b",
		},
		{
			name: "Decapus",
			size: "Medium", type: "Aberration",
			ac: 12, hp: 44, init: 1, cr: "2",
			alignment: alignments.ce,
			environments: [ "ruins", "underground", "forest" ],
			legendary: false,
			id: "748a1b33-972e-4d6b-bf93-66d4f17462a2",
		},
		{
			section: "Demons", name: "Teratashia",
			size: "Large", type: "Fiend",
			ac: 18, hp: 161, init: 4, cr: "15",
			alignment: alignments.ce,
			environments: [ "planar" ],
			legendary: false,
			id: "5dfef99c-ec51-4503-81e9-72408322a686",
		},
		{
			section: "Demons", name: "Thalasskoptis",
			size: "Large", type: "Fiend", tags: [ "Aquatic", "Demon Prince" ], 
			ac: 18, hp: 168, init: 4, cr: "10",
			alignment: alignments.ce,
			environments: [ "aquatic" ],
			legendary: true,
			id: "409b267d-1c8e-4d83-9073-754676435a06",
		},
		{
			name: "Demonic Knight",
			size: "Medium", type: "Fiend",
			ac: 17, hp: 81, init: 1, cr: "5",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "cf9a0fa9-e840-471f-8f20-218fe1d10d64",
		},
		{
			name: "Denizen of Leng",
			size: "Medium", type: "Aberration",
			ac: 16, hp: 85, init: 4, cr: "5",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "5df7b005-92a7-49b6-b994-8139341a1fa2",
		},
		{
			name: "Dire Corby",
			size: "Medium", type: "Monstrosity",
			ac: 11, hp: 11, init: 1, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "underground" ],
			legendary: false,
			id: "aedfee30-ec76-4cfc-adc5-71f9ac1151f8",
		},
		{
			name: "Dracolisk",
			size: "Large", type: "Dragon",
			ac: 17, hp: 114, init: 1, cr: "7",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "14ce29a0-f233-4ce5-bcc5-28497daad2b7",
		},
		{
			name: "Fire Drake",
			size: "Small", type: "Dragon",
			ac: 13, hp: 27, init: 1, cr: "1",
			alignment: alignments.ce,
			environments: [ "mountain" ],
			legendary: false,
			id: "8a9ee592-179e-4d88-9110-48a3f25aea2d",
		},
		{
			name: "Ice Drake",
			size: "Small", type: "Dragon",
			ac: 14, hp: 22, init: 1, cr: "1",
			alignment: alignments.ce,
			environments: [ "arctic" ],
			legendary: false,
			id: "fb3cb5da-279c-437e-8c5a-3d2dfe93f6e0",
		},
		{
			name: "Dust Digger",
			size: "Large", type: "Aberration",
			ac: 13, hp: 38, init: 0, cr: "3",
			alignment: alignments.unaligned,
			environments: [ "desert" ],
			legendary: false,
			id: "9edb5935-e824-48ef-9e61-1c2f5894f975",
		},
		{
			name: "Eblis",
			size: "Medium", type: "Monstrosity",
			ac: 12, hp: 22, init: 2, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "swamp" ],
			legendary: false,
			id: "2e2b546e-0154-4fca-b142-14a7e9ec68f9",
		},
		{
			name: "Ectoplasm",
			size: "Large", type: "Ooze", tags: [ "Incorporeal" ], 
			ac: 12, hp: 39, init: 1, cr: "2",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "96236a8d-483c-46ed-9af7-1a0033434c1d",
		},
		{
			name: "Giant Moray Eel",
			size: "Medium", type: "Beast", tags: [ "Aquatic" ], 
			ac: 12, hp: 52, init: 2, cr: "2",
			alignment: alignments.unaligned,
			environments: [ "aquatic" ],
			legendary: false,
			id: "f0d94abd-9d0d-49f9-b1a1-fad5818d8ac5",
		},
		{
			name: "Gulper Eel",
			size: "Large", type: "Beast", tags: [ "Aquatic" ], 
			ac: 14, hp: 60, init: 2, cr: "3",
			alignment: alignments.unaligned,
			environments: [ "aquatic" ],
			legendary: false,
			id: "a416b6de-fc27-40ab-b4be-25d74a333002",
		},
		{
			name: "Elusa Hound",
			size: "Medium", type: "Monstrosity",
			ac: 14, hp: 26, init: 2, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "forest", "grassland" ],
			legendary: false,
			id: "cfc78e02-ba1d-40a5-b6c8-4aff2f0f985b",
		},
		{
			name: "Encephalon Gorger (Psilian)",
			size: "Medium", type: "Aberration",
			ac: 13, hp: 65, init: 3, cr: "4",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "8aa24fcf-01dd-4c1f-986a-35f3a27b40a5",
		},
		{
			name: "Giant Ant Exoskeleton",
			size: "Large", type: "Construct",
			ac: 16, hp: 15, init: 1, cr: "1/2",
			alignment: alignments.le,
			environments: [ "desert", "grassland" ],
			legendary: false,
			id: "68c63f04-8e50-45ef-b0be-7c66313d7aad",
		},
		{
			name: "Giant Beetle Exoskeleton",
			size: "Large", type: "Construct",
			ac: 17, hp: 42, init: 1, cr: "2",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "150f864a-a381-4cdc-b983-47cd0cd2f6c8",
		},
		{
			name: "Giant Crab Exoskeleton",
			size: "Large", type: "Construct",
			ac: 18, hp: 57, init: 0, cr: "3",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "f2a457ae-756c-45e8-a159-a2e15eff43e0",
		},
		{
			name: "Fear Guard",
			size: "Medium", type: "Undead",
			ac: 17, hp: 51, init: 2, cr: "3",
			alignment: alignments.ce,
			environments: [ "underground" ],
			legendary: false,
			id: "44253d68-8f2c-4751-991f-abc921df8a9c",
		},
		{
			name: "Fen Witch",
			size: "Medium", type: "Monstrosity",
			ac: 12, hp: 33, init: 1, cr: "2",
			alignment: alignments.ce,
			environments: [ "swamp" ],
			legendary: false,
			id: "195d4017-bd24-4b10-9e1a-3a8b05e38977",
		},
		{
			name: "Fetch",
			size: "Medium", type: "Undead",
			ac: 13, hp: 16, init: 2, cr: "1",
			alignment: alignments.le,
			environments: [ "grassland", "mountain" ],
			legendary: false,
			id: "56e56efe-e085-41a7-8b68-16a6214a5fbe",
		},
		{
			name: "Greater Fire Crab",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 34, init: 0, cr: "2",
			alignment: alignments.unaligned,
			environments: [ "planar" ],
			legendary: false,
			id: "b47d2bf0-b548-4cd5-982b-c58ab7ef30dc",
		},
		{
			name: "Lesser Fire Crab",
			size: "Small", type: "Monstrosity",
			ac: 12, hp: 4, init: 2, cr: "1/8",
			alignment: alignments.unaligned,
			environments: [ "planar" ],
			legendary: false,
			id: "cd5f37bc-f0cb-41de-bff4-00ce7b0ec6b2",
		},
		{
			name: "Poisonous Fire Snake",
			size: "Small", type: "Fiend",
			ac: 13, hp: 13, init: 3, cr: "1/2",
			alignment: alignments.unaligned,
			environments: [ "planar" ],
			legendary: false,
			id: "925b7880-251a-4e01-8829-6231ed13ac1d",
		},
		{
			name: "Flail Snail",
			size: "Large", type: "Monstrosity",
			ac: 16, hp: 38, init: -1, cr: "3",
			alignment: alignments.unaligned,
			environments: [ "underground", "ruins" ],
			legendary: false,
			id: "50e8cce3-f0b6-4b53-8be5-4c9b3e99b2be",
		},
		{
			name: "Flowershroud",
			size: "Large", type: "Plant",
			ac: 11, hp: 19, init: 1, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "forest", "grassland" ],
			legendary: false,
			id: "3d630efa-9f83-43e4-9f02-9d10c9d7b7ce",
		},
		{
			name: "Foo Dog",
			size: "Medium", type: "Monstrosity",
			ac: 13, hp: 52, init: 2, cr: "3",
			alignment: alignments.cg,
			environments: [ "planar" ],
			legendary: false,
			id: "9fde7d89-902a-418c-96b9-fde58e5c088e",
		},
		{
			name: "Forester's Bane",
			size: "Large", type: "Plant",
			ac: 10, hp: 103, init: 0, cr: "5",
			alignment: alignments.unaligned,
			environments: [ "grassland" ],
			legendary: false,
			id: "4dffa61d-9d30-4710-9039-8f23ff84f11c",
		},
		{
			name: "Froghemoth",
			size: "Huge", type: "Aberration",
			ac: 15, hp: 200, init: 0, cr: "11",
			alignment: alignments.unaligned,
			environments: [ "swamp" ],
			legendary: false,
			id: "7d5c64eb-eefe-4152-be3c-c0f065d27c11",
		},
		{
			name: "Fungoid",
			size: "Medium", type: "Plant", tags: [ "Fungoid" ], 
			ac: 15, hp: 45, init: 1, cr: "2",
			alignment: alignments.ne,
			environments: [ "swamp" ],
			legendary: false,
			id: "61018b7f-fc0b-4204-ac4e-18d39d520b50",
		},
		{
			name: "Fungus Bat",
			size: "Medium", type: "Plant", tags: [ "Fungoid" ], 
			ac: 11, hp: 16, init: 1, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "0ab016e4-ac4e-4dff-ad91-cd731999ff6c",
		},
		{
			name: "Fyr",
			size: "Small", type: "Fey",
			ac: 11, hp: 9, init: 1, cr: "1/4",
			alignment: alignments.n,
			environments: [ "forest", "mountain" ],
			legendary: false,
			id: "2ed648cd-e401-4aa1-ad00-19cf596aa0c2",
		},
		{
			name: "Gallows Tree",
			size: "Huge", type: "Plant",
			ac: 15, hp: 225, init: 0, cr: "13",
			alignment: alignments.unaligned,
			environments: [ "forest", "swamp", "grassland" ],
			legendary: false,
			id: "6b3ba99c-30b6-4b19-8fea-b2ddc1397afc",
		},
		{
			name: "Gallows Tree Zombie",
			size: "Medium", type: "Plant",
			ac: 11, hp: 33, init: 1, cr: "2",
			alignment: alignments.unaligned,
			environments: [ "forest", "grassland", "swamp" ],
			legendary: false,
			id: "9680e243-fecb-4e71-b7fb-ebfc695cff84",
		},
		{
			section: "Gargoyles", name: "Four-Armed Gargoyle",
			size: "Medium", type: "Monstrosity",
			ac: 15, hp: 55, init: 2, cr: "4",
			alignment: alignments.ce,
			environments: [ "aquatic", "underground" ],
			legendary: false,
			id: "f305e58f-b209-4df7-a969-da60985f8952",
		},
		{
			section: "Gargoyles, Fungi", name: "Fungus Gargoyle",
			size: "Medium", type: "Plant",
			ac: 14, hp: 52, init: 2, cr: "1",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "a43a7260-f1ea-4c5d-98ca-929db9a1bd4a",
		},
		{
			section: "Gargoyles", name: "Green Guardian Gargoyle",
			size: "Medium", type: "Monstrosity",
			ac: 13, hp: 34, init: 2, cr: "1",
			alignment: alignments.ce,
			environments: [ "aquatic", "underground" ],
			legendary: false,
			id: "f5d27c86-df25-4f77-b7e4-fc018f151186",
		},
		{
			section: "Gargoyles", name: "Margoyle",
			size: "Medium", type: "Monstrosity",
			ac: 16, hp: 114, init: 2, cr: "5",
			alignment: alignments.ce,
			environments: [ "aquatic", "underground" ],
			legendary: false,
			id: "3be8ea59-4982-4a6d-af3f-d3b6f48a5f5c",
		},
		{
			section: "Genies", name: "Hawanar",
			size: "Large", type: "Fiend",
			ac: 17, hp: 97, init: 2, cr: "7",
			alignment: alignments.ln,
			environments: [ "planar" ],
			legendary: false,
			id: "bfa26d58-e035-402c-bddb-eeba284a9a97",
		},
		{
			name: "Ghost-Ammonite",
			size: "Medium", type: "Undead",
			ac: 10, hp: 33, init: 2, cr: "2",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "813dfa0d-6747-4c30-b98d-a7872a959d79",
		},
		{
			name: "Giant Slug of P'nakh",
			size: "Large", type: "Fiend",
			ac: 11, hp: 76, init: -1, cr: "4",
			alignment: alignments.ce,
			environments: [ "ruins", "underground" ],
			legendary: false,
			id: "fba44dbb-a3b3-44d7-81ce-bae7fd75e562",
		},
		{
			section: "Giants", name: "Jack-in-Irons",
			size: "Huge", type: "Giant",
			ac: 14, hp: 126, init: 1, cr: "7",
			alignment: alignments.ce,
			environments: [ "grassland", "forest" ],
			legendary: false,
			id: "7bdb5b8a-1f90-4e33-8b89-c0095ed0d7b8",
		},
		{
			name: "Gillmonkey",
			size: "Small", type: "Beast", tags: [ "Aquatic" ], 
			ac: 12, hp: 7, init: 2, cr: "1/4",
			alignment: alignments.ce,
			environments: [ "aquatic" ],
			legendary: false,
			id: "8f957588-da24-404d-915f-6f2e76399d82",
		},
		{
			name: "Gloom Crawler",
			size: "Huge", type: "Monstrosity",
			ac: 12, hp: 159, init: 2, cr: "10",
			alignment: alignments.n,
			environments: [],
			legendary: false,
			id: "10f215bf-29aa-4426-96d1-c6e6baaabf96",
		},
		{
			name: "Gnarlwood",
			size: "Huge", type: "Plant",
			ac: 16, hp: 132, init: -1, cr: "8",
			alignment: alignments.ne,
			environments: [ "forest" ],
			legendary: false,
			id: "63798c35-6c96-4e6f-be8c-d98e2e97b1cb",
		},
		{
			name: "Gohl",
			size: "Large", type: "Aberration",
			ac: 13, hp: 85, init: 3, cr: "8",
			alignment: alignments.ce,
			environments: [ "underground", "ruins" ],
			legendary: false,
			id: "1f20da7f-5464-4386-87dc-dc34e0928220",
		},
		{
			name: "Golden Cat",
			size: "Tiny", type: "Beast",
			ac: 12, hp: 3, init: 2, cr: "0",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "df1c7b07-15b6-4274-9d4f-dcad32e176cc",
		},
		{
			section: "Golems", name: "Flagstone Golem",
			size: "Large", type: "Construct",
			ac: 15, hp: 114, init: -1, cr: "7",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "da5d467a-61f9-4863-89dc-7b2cb828f12f",
		},
		{
			section: "Golems", name: "Furnace Golem",
			size: "Large", type: "Construct",
			ac: 16, hp: 152, init: -1, cr: "9",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "56d812d0-1e6c-4215-8add-69997bda3581",
		},
		{
			section: "Golems", name: "Stone Guardian Golem",
			size: "Medium", type: "Construct",
			ac: 14, hp: 42, init: -1, cr: "2",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "e72c259e-e85f-4b37-a79f-4ba6c0dca135",
		},
		{
			section: "Golems", name: "Wooden Golem",
			size: "Medium", type: "Construct",
			ac: 14, hp: 60, init: -1, cr: "3",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "aefb5349-effc-4072-9d41-9107040c81de",
		},
		{
			name: "Gorbel",
			size: "Small", type: "Aberration",
			ac: 12, hp: 11, init: 2, cr: "1/4",
			alignment: alignments.n,
			environments: [ "forest" ],
			legendary: false,
			id: "f44e122d-f1fd-473c-8233-9282c8c95fe0",
		},
		{
			name: "Gorgimera",
			size: "Large", type: "Monstrosity",
			ac: 17, hp: 95, init: 1, cr: "7",
			alignment: alignments.unaligned,
			environments: [ "mountain" ],
			legendary: false,
			id: "32e8f240-7de2-4261-8c37-0e2edaf48e85",
		},
		{
			name: "Gorilla Bear",
			size: "Medium", type: "Monstrosity",
			ac: 13, hp: 26, init: 2, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			legendary: false,
			id: "ffaf52f8-a1cc-4a5e-bd4d-5c10bdd48836",
		},
		{
			name: "Gray Nisp",
			size: "Large", type: "Fey",
			ac: 15, hp: 95, init: 3, cr: "6",
			alignment: alignments.cn,
			environments: [ "aquatic" ],
			legendary: false,
			id: "8d92db78-2370-4cc5-9c12-a47e645f4825",
		},
		{
			name: "Green Brain",
			size: "Small", type: "Plant",
			ac: 12, hp: 17, init: 2, cr: "1",
			alignment: alignments.le,
			environments: [ "underground" ],
			legendary: false,
			id: "7cb9a7e8-516b-4772-a429-148b4a6431f2",
		},
		{
			name: "Grimm",
			size: "Large", type: "Fey",
			ac: 14, hp: 104, init: 2, cr: "7",
			alignment: alignments.ne,
			environments: [ "mountain" ],
			legendary: false,
			id: "3e235c32-1cd0-4cc4-892e-a4a51d47d07c",
		},
		{
			name: "Grippli",
			size: "Small", type: "Humanoid",
			ac: 13, hp: 9, init: 3, cr: "1/4",
			alignment: alignments.n,
			environments: [ "forest", "swamp" ],
			legendary: false,
			id: "905d0a84-71ea-43ab-9e41-190373db01d6",
		},
		{
			name: "Grue (Type 1)",
			size: "Large", type: "Ooze",
			ac: 15, hp: 75, init: 0, cr: "4",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "4398adcd-87f3-4bd7-98ca-854f2a66bb77",
		},
		{
			name: "Grue (Type 2)",
			size: "Medium", type: "Aberration",
			ac: 13, hp: 36, init: 3, cr: "2",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "2953d90d-2079-49be-89de-5e1e4977e924",
		},
		{
			name: "Hanged Man",
			size: "Medium", type: "Undead",
			ac: 11, hp: 22, init: 1, cr: "1/2",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "169a5633-9680-4bc0-b172-e2775a45c514",
		},
		{
			name: "Hangman Tree",
			size: "Huge", type: "Plant",
			ac: 17, hp: 92, init: -2, cr: "7",
			alignment: alignments.ne,
			environments: [ "forest" ],
			legendary: false,
			id: "964941f9-1859-467d-b12c-e1afdb967cd0",
		},
		{
			name: "Hawktoad",
			size: "Small", type: "Monstrosity",
			ac: 12, hp: 5, init: 2, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "forest", "swamp" ],
			legendary: false,
			id: "5c1cc602-9168-43d9-8c57-a41debe78732",
		},
		{
			name: "Helix Moth Adult",
			size: "Huge", type: "Beast",
			ac: 14, hp: 114, init: 2, cr: "6",
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			legendary: false,
			id: "a2b10350-c778-42ee-90d9-06c8eabd79a2",
		},
		{
			name: "Helix Moth Larva",
			size: "Large", type: "Beast",
			ac: 14, hp: 65, init: 2, cr: "2",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "e33c82a2-9f11-49d8-b283-1d1188659bda",
		},
		{
			name: "Hieroglyphicroc",
			size: "Large", type: "Undead",
			ac: 13, hp: 52, init: 0, cr: "3",
			alignment: alignments.le,
			environments: [ "ruins" ],
			legendary: false,
			id: "963a4b94-940f-4d43-9d63-c0720ebf41a6",
		},
		{
			name: "Hippocampus",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 34, init: 2, cr: "1",
			alignment: alignments.cg,
			environments: [ "aquatic" ],
			legendary: false,
			id: "b0ed20be-5d74-4892-9e46-7503cc10263e",
		},
		{
			name: "Hoar Fox",
			size: "Small", type: "Monstrosity",
			ac: 14, hp: 26, init: 3, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "arctic", "forest" ],
			legendary: false,
			id: "cdda62de-1fc4-40af-87e0-b558b926ddac",
		},
		{
			name: "Giant Horsefly",
			size: "Large", type: "Beast",
			ac: 12, hp: 30, init: 2, cr: "1/2",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "d5d4329c-ab10-4a4f-8040-6a1a035c80da",
		},
		{
			name: "Huggermugger",
			size: "Small", type: "Humanoid",
			ac: 13, hp: 7, init: 3, cr: "1/4",
			alignment: alignments.ce,
			environments: [ "underground" ],
			legendary: false,
			id: "7ba610ba-b5a0-4d4b-83b5-2226acb81eb3",
		},
		{
			name: "Igniguana",
			size: "Medium", type: "Elemental",
			ac: 12, hp: 26, init: 0, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "underground", "planar" ],
			legendary: false,
			id: "4755c9ff-33ef-4795-a023-268fe0d330ed",
		},
		{
			name: "Jackal of Darkness",
			size: "Small", type: "Undead",
			ac: 13, hp: 21, init: 2, cr: "1",
			alignment: alignments.ne,
			environments: [ "ruins" ],
			legendary: false,
			id: "04cd2290-02d0-444d-aafc-5a944281fc07",
		},
		{
			name: "Jaculi",
			size: "Medium", type: "Monstrosity",
			ac: 14, hp: 4, init: 3, cr: "1/8",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "619a44e4-6157-4c91-ab34-b9074f031b80",
		},
		{
			name: "Mustard Jelly",
			size: "Large", type: "Ooze",
			ac: 14, hp: 85, init: 0, cr: "5",
			alignment: alignments.unaligned,
			environments: [ "swamp" ],
			legendary: false,
			id: "14a40422-3e78-4d99-8772-bec7b387e6eb",
		},
		{
			name: "Jupiter Bloodsucker",
			size: "Medium", type: "Plant",
			ac: 8, hp: 26, init: -3, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			legendary: false,
			id: "804dae66-0996-47ae-b2e0-497a87ff71ae",
		},
		{
			name: "Kamadan",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 30, init: 2, cr: "3",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "cf8c3aeb-fed2-480c-845f-1cd0800419de",
		},
		{
			name: "Kampfult",
			size: "Medium", type: "Plant",
			ac: 15, hp: 32, init: 1, cr: "2",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "418f42d0-b7d2-4425-8072-5612c0a54c35",
		},
		{
			name: "Kech",
			size: "Medium", type: "Monstrosity",
			ac: 13, hp: 27, init: 2, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "forest" ],
			legendary: false,
			id: "697094e6-3d30-402f-b0ab-e997c12a3293",
		},
		{
			name: "Kelpie",
			size: "Medium", type: "Plant",
			ac: 12, hp: 27, init: 2, cr: "1",
			alignment: alignments.ne,
			environments: [ "aquatic" ],
			legendary: false,
			id: "5df53170-860c-4cf6-9b89-eabc7f2d8890",
		},
		{
			name: "Khargra",
			size: "Small", type: "Fiend",
			ac: 16, hp: 33, init: 2, cr: "2",
			alignment: alignments.unaligned,
			environments: [ "planar" ],
			legendary: false,
			id: "cb027442-bf51-4e3d-989e-dfb87ebb1b9c",
		},
		{
			name: "Korred",
			size: "Small", type: "Fey",
			ac: 13, hp: 27, init: 2, cr: "1",
			alignment: alignments.cn,
			environments: [ "forest" ],
			legendary: false,
			id: "5b0d734a-48a4-4f75-b62e-6be805f15cf1",
		},
		{
			name: "Kurok-spirit",
			size: "Large", type: "Fiend",
			ac: 13, hp: 19, init: 3, cr: "1",
			alignment: alignments.cn,
			environments: [],
			legendary: false,
			id: "33310580-40d5-410b-b280-805940c79166",
		},
		{
			name: "Land Lamprey",
			size: "Small", type: "Beast",
			ac: 12, hp: 2, init: 2, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "75b436c0-5118-4a60-916d-b31a8d025813",
		},
		{
			name: "Lava Child",
			size: "Medium", type: "Elemental",
			ac: 11, hp: 22, init: 0, cr: "1",
			alignment: alignments.n,
			environments: [ "underground" ],
			legendary: false,
			id: "4e09d563-e9cc-4bab-a88c-2e32cb135c2e",
		},
		{
			name: "Leng Spider",
			size: "Huge", type: "Aberration",
			ac: 15, hp: 97, init: 3, cr: "6",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "4b3a36c1-7513-44ae-b422-00770ef80b6b",
		},
		{
			name: "Snow Leopard",
			size: "Medium", type: "Beast",
			ac: 12, hp: 16, init: 2, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "forest", "mountain", "arctic" ],
			legendary: false,
			id: "fe3a553f-eff8-4b22-be3a-c218f0322a6b",
		},
		{
			name: "Adult Leucrotta",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 39, init: 2, cr: "2",
			alignment: alignments.ce,
			environments: [ "forest" ],
			legendary: false,
			id: "29aa7820-a973-45ea-9d2c-221d98519c0b",
		},
		{
			name: "Young Leucrotta",
			size: "Medium", type: "Monstrosity",
			ac: 13, hp: 10, init: 2, cr: "1/4",
			alignment: alignments.ce,
			environments: [ "forest" ],
			legendary: false,
			id: "83570a96-43c8-4ebd-b3fc-e1caaf516983",
		},
		{
			name: "Lithonnite",
			size: "Large", type: "Monstrosity",
			ac: 18, hp: 68, init: 1, cr: "4",
			alignment: alignments.unaligned,
			environments: [ "aquatic", "underground" ],
			legendary: false,
			id: "103b318f-5844-4c28-88bc-0a88801599f6",
		},
		{
			name: "Magmoid",
			size: "Large", type: "Elemental",
			ac: 16, hp: 75, init: 2, cr: "4",
			alignment: alignments.unaligned,
			environments: [ "planar" ],
			legendary: false,
			id: "f57e8c30-656d-46af-9d1b-fec7eaf7f193",
		},
		{
			name: "Mandragora",
			size: "Small", type: "Plant", tags: [ "Fungoid" ], 
			ac: 11, hp: 4, init: 1, cr: "1/8",
			alignment: alignments.ne,
			environments: [ "forest" ],
			legendary: false,
			id: "25457afb-09cf-4b91-a4db-968bd4ec250d",
		},
		{
			name: "Mandrill",
			size: "Small", type: "Beast",
			ac: 12, hp: 9, init: 2, cr: "1/8",
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			legendary: false,
			id: "efd769f7-8915-4106-b3e6-6b82aae844fc",
		},
		{
			name: "Mantari",
			size: "Medium", type: "Monstrosity",
			ac: 12, hp: 4, init: 2, cr: "1/8",
			alignment: alignments.ne,
			environments: [ "underground" ],
			legendary: false,
			id: "c4382159-8969-4f0b-9c4f-ff00a99f776e",
		},
		{
			name: "Midnight Peddler",
			size: "Medium", type: "Fey",
			ac: 11, hp: 45, init: 1, cr: "1/2",
			alignment: alignments.n,
			environments: [],
			legendary: false,
			id: "f172980e-5b6c-4a14-826c-59cdbc9ad957",
		},
		{
			section: "Mites", name: "Mite",
			size: "Small", type: "Fey",
			ac: 11, hp: 3, init: 1, cr: "1/8",
			alignment: alignments.le,
			environments: [ "underground" ],
			legendary: false,
			id: "2bd24040-6384-4388-93f5-66846a471917",
		},
		{
			section: "Mites", name: "Pestie",
			size: "Small", type: "Fey",
			ac: 12, hp: 7, init: 2, cr: "1/4",
			alignment: alignments.le,
			environments: [ "underground" ],
			legendary: false,
			id: "61b6158a-05b7-4cc9-9b70-507a3ec22ef6",
		},
		{
			name: "Mummy of the Deep",
			size: "Medium", type: "Undead", tags: [ "Aquatic" ], 
			ac: 11, hp: 33, init: 0, cr: "2",
			alignment: alignments.ne,
			environments: [ "aquatic" ],
			legendary: false,
			id: "54c76671-883c-46f8-a3e4-6c742732d652",
		},
		{
			name: "Murder Crow",
			size: "Medium", type: "Undead",
			ac: 15, hp: 52, init: 3, cr: "3",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "24c71a8d-54d4-4e52-9e9a-67d8cc268a49",
		},
		{
			section: "Nagas", name: "Hanu-naga",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 39, init: 2, cr: "2",
			alignment: alignments.ce,
			environments: [ "forest", "mountain" ],
			legendary: false,
			id: "f5088d29-9ad8-40e0-bf14-85873c2a04c2",
		},
		{
			name: "Olive Slime",
			size: "Large", type: "Plant", tags: [ "Fungoid" ], 
			ac: 11, hp: 14, init: 1, cr: "0",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "a98dda59-e604-4397-a8bf-c3ebea465fe6",
		},
		{
			name: "Olive Slime Zombie",
			size: "Medium", type: "Plant",
			ac: 9, hp: 26, init: -1, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "underground" ],
			legendary: false,
			id: "c26c85a8-4d1f-4a71-8182-81590b7fc0ad",
		},
		{
			name: "Glacial Ooze",
			size: "Large", type: "Ooze",
			ac: 5, hp: 57, init: -5, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "arctic" ],
			legendary: false,
			id: "6cd7a61a-7734-49fb-94b3-8a4b7083e00b",
		},
		{
			name: "Magma Ooze",
			size: "Large", type: "Ooze",
			ac: 14, hp: 115, init: -5, cr: "5",
			alignment: alignments.unaligned,
			environments: [ "mountain", "underground" ],
			legendary: false,
			id: "c3e2ed63-41cf-4ccf-9977-31e1f97e934e",
		},
		{
			name: "Origami Warrior",
			size: "Medium", type: "Construct",
			ac: 15, hp: 9, init: 3, cr: "1/8",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "cfc83102-72b9-414d-a7eb-a01ee760fa51",
		},
		{
			name: "Pech",
			size: "Small", type: "Fey",
			ac: 11, hp: 18, init: 1, cr: "1/4",
			alignment: alignments.ng,
			environments: [ "underground", "planar" ],
			legendary: false,
			id: "e63a187e-1d25-46ff-acfd-ca869a6f664b",
		},
		{
			name: "Phycomid",
			size: "Small", type: "Plant", tags: [ "Fungoid" ], 
			ac: 10, hp: 22, init: 0, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "underground" ],
			legendary: false,
			id: "72d8df79-bede-4f5e-8584-e4425ed25b4a",
		},
		{
			section: "Pleistocene Animal", name: "Brontotherium",
			size: "Huge", type: "Beast",
			ac: 13, hp: 128, init: 0, cr: "6",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "842934bf-43fd-4a27-9178-0d29fe2791bb",
		},
		{
			section: "Pleistocene Animal", name: "Hyaenodon",
			size: "Large", type: "Beast",
			ac: 13, hp: 44, init: 2, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "grassland" ],
			legendary: false,
			id: "74ca7858-7ba7-4e4e-8c5d-9b50f13dad65",
		},
		{
			section: "Pleistocene Animal", name: "Mastodon",
			size: "Huge", type: "Beast",
			ac: 13, hp: 105, init: -1, cr: "4",
			alignment: alignments.unaligned,
			environments: [ "forest", "grassland" ],
			legendary: false,
			id: "2363ae59-7bb2-4714-adfe-dc61c37f80bc",
		},
		{
			section: "Pleistocene Animal", name: "Woolly Rhinoceros",
			size: "Large", type: "Beast",
			ac: 14, hp: 136, init: -1, cr: "6",
			alignment: alignments.unaligned,
			environments: [ "forest", "swamp", "grassland" ],
			legendary: false,
			id: "cb104764-015e-4a72-a3be-749cc07fbd63",
		},
		{
			name: "Blood Pudding",
			size: "Medium", type: "Ooze",
			ac: 10, hp: 42, init: 0, cr: "2",
			alignment: alignments.unaligned,
			environments: [ "swamp", "underground" ],
			legendary: false,
			id: "3a8536aa-c0df-4408-971c-cfaa17754cb8",
		},
		{
			name: "Pyrolisk",
			size: "Small", type: "Monstrosity",
			ac: 12, hp: 21, init: 2, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "underground" ],
			legendary: false,
			id: "613b4121-7fe3-4b23-be80-d0fcff54620f",
		},
		{
			name: "Quadricorn",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 59, init: 1, cr: "4",
			alignment: alignments.ne,
			environments: [ "grassland" ],
			legendary: false,
			id: "2f98de88-8424-4e9b-a658-95b0ee302a29",
		},
		{
			name: "Quickwood",
			size: "Huge", type: "Plant",
			ac: 14, hp: 149, init: 2, cr: "8",
			alignment: alignments.n,
			environments: [ "forest", "mountain" ],
			legendary: false,
			id: "47aa6784-4245-440f-9f51-b90e061bfc60",
		},
		{
			name: "Shadow Rat",
			size: "Tiny", type: "Undead",
			ac: 12, hp: 1, init: 2, cr: "0",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "a791b84a-57f7-4625-96ae-eed2d7451197",
		},
		{
			name: "Red Jester",
			size: "Medium", type: "Undead",
			ac: 14, hp: 67, init: 3, cr: "5",
			alignment: alignments.cn,
			environments: [],
			legendary: false,
			id: "52096bf8-1a8d-4cb3-88f7-91302e60b9cd",
		},
		{
			name: "Ronus",
			size: "Medium", type: "Monstrosity",
			ac: 14, hp: 16, init: 3, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			legendary: false,
			id: "084ba8ff-ab3b-4f76-aa3f-b577978f0e4d",
		},
		{
			name: "Russet Mold",
			size: "Medium", type: "Plant", tags: [ "Fungoid" ], 
			ac: 8, hp: 9, init: 2, cr: "1/2",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "ff870084-5a52-4c18-afcd-4f63ffb41cb5",
		},
		{
			name: "Ryven",
			size: "Medium", type: "Humanoid",
			ac: 13, hp: 19, init: 2, cr: "1",
			alignment: alignments.n,
			environments: [ "forest" ],
			legendary: false,
			id: "2496c9fa-a7d8-4b97-a20e-42c76c585660",
		},
		{
			name: "Sandling",
			size: "Large", type: "Elemental",
			ac: 15, hp: 26, init: 1, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "planar" ],
			legendary: false,
			id: "36e4e3ee-af3e-4093-b83c-7e1546628a9c",
		},
		{
			name: "Screaming Devilkin",
			size: "Small", type: "Fiend",
			ac: 12, hp: 13, init: 2, cr: "1/4",
			alignment: alignments.le,
			environments: [],
			legendary: false,
			id: "2a7f3c35-4fa9-465d-809a-fefbd79356b9",
		},
		{
			name: "Scythe Tree",
			size: "Huge", type: "Plant",
			ac: 14, hp: 76, init: -1, cr: "5",
			alignment: alignments.ce,
			environments: [ "forest" ],
			legendary: false,
			id: "8e2ff0f9-f028-4820-a066-79b048f089fa",
		},
		{
			name: "Brine Sea Serpent",
			size: "Huge", type: "Dragon", tags: [ "Aquatic" ],
			ac: 17, hp: 168, init: 2, cr: "10",
			alignment: alignments.ce,
			environments: [ "aquatic" ],
			legendary: true,
			id: "d64b71c7-026e-41c2-868a-9b18efd58eae",
		},

		{
			name: "Deep Hunter Sea Serpent",
			size: "Gargantuan", type: "Dragon", tags: [ "Aquatic" ],
			ac: 18, hp: 232, init: 2, cr: "14",
			alignment: alignments.ln,
			environments: [ "aquatic" ],
			legendary: true,
			id: "03355493-0eed-4b7f-a761-d3a092d52ec2",
		},
		{
			name: "Fanged Sea Serpent",
			size: "Large", type: "Dragon", tags: [ "Aquatic" ],
			ac: 18, hp: 85, init: 1, cr: "5",
			alignment: alignments.ne,
			environments: [ "aquatic" ],
			legendary: false,
			id: "9c7cddd1-1159-4d22-8cb1-db8d7722fe42",
		},
		{
			name: "Shipbreaker Sea Serpent",
			size: "Gargantuan", type: "Dragon", tags: [ "Aquatic" ],
			ac: 19, hp: 310, init: 1, cr: "20",
			alignment: alignments.cn,
			environments: [ "aquatic" ],
			legendary: true,
			id: "bda1c849-b316-46c9-b02f-74e1f023abd6",
		},
		{
			name: "Spitting Sea Serpent",
			size: "Large", type: "Dragon", tags: [ "Aquatic" ],
			ac: 14, hp: 97, init: 4, cr: "5",
			alignment: alignments.ce,
			environments: [ "aquatic" ],
			legendary: false,
			id: "415f28df-d304-4914-9c8e-06e6d12c1d57",
		},
		{
			name: "Giant Seahorse",
			size: "Large", type: "Beast",
			ac: 12, hp: 26, init: 2, cr: "1/2",
			alignment: alignments.unaligned,
			environments: [ "aquatic" ],
			legendary: false,
			id: "2dcf8e8b-f858-4acb-9a13-8f898ed872a9",
		},
		{
			name: "Sepulchral Guardian",
			size: "Medium", type: "Construct",
			ac: 14, hp: 65, init: 0, cr: "3",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "6db77354-d6ab-416b-b23b-90b142ef7c11",
		},
		{
			name: "Shadow Mastiff",
			size: "Medium", type: "Fiend",
			ac: 12, hp: 22, init: 2, cr: "1/2",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "2cef4f87-c829-4108-8b88-95e935af7297",
		},
		{
			name: "Lesser Shadow",
			size: "Medium", type: "Undead",
			ac: 12, hp: 7, init: 2, cr: "1/8",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "cfbcd4c4-a626-4274-9e9f-46359a39be3b",
		},
		{
			name: "Shroom",
			size: "Small", type: "Plant", tags: [ "Fungoid" ], 
			ac: 12, hp: 49, init: 0, cr: "4",
			alignment: alignments.ce,
			environments: [ "underground", "forest" ],
			legendary: false,
			lair: true,
			id: "b13be6df-2259-4bbf-9fbb-8712f11f6132",
		},
		{
			name: "Skeleton Warrior",
			size: "Medium", type: "Undead",
			ac: 19, hp: 150, init: 1, cr: "14",
			alignment: alignments.ne,
			environments: [ "underground" ],
			legendary: true,
			id: "94e4df5d-bba5-4810-99b7-bfd8a15e67c6",
		},
		{
			name: "Stygian Skeleton",
			size: "Medium", type: "Undead",
			ac: 16, hp: 97, init: 3, cr: "7",
			alignment: alignments.ce,
			environments: [ "underground" ],
			legendary: false,
			id: "8bf9526f-0d32-44d2-8d15-92ac6076cbf9",
		},
		{
			name: "Skelzi",
			size: "Medium", type: "Humanoid",
			ac: 14, hp: 44, init: 2, cr: "1",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "f5ec9872-59ff-4455-bd4d-e01a81a39851",
		},
		{
			name: "Skulk",
			size: "Medium", type: "Humanoid",
			ac: 13, hp: 18, init: 3, cr: "1/2",
			alignment: alignments.cn,
			environments: [ "underground" ],
			legendary: false,
			id: "16bc059c-afd0-4eae-b07c-9ff786f323e1",
		},
		{
			name: "Slithering Tracker",
			size: "Small", type: "Ooze",
			ac: 14, hp: 32, init: 4, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "fa7c0cd2-fce9-47e4-82c2-f217930e9940",
		},
		{
			name: "Soul Reaper",
			size: "Large", type: "Undead",
			ac: 19, hp: 152, init: 3, cr: "16",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "3e120c8e-9d56-4ffd-a791-ec4e5a610e5b",
		},
		{
			name: "Stegocentipede",
			size: "Huge", type: "Beast",
			ac: 14, hp: 76, init: 2, cr: "4",
			alignment: alignments.unaligned,
			environments: [ "forest", "underground" ],
			legendary: false,
			id: "f63952f3-3c3a-448e-afbf-ed6f7c9a9ee7",
		},
		{
			name: "Strangle Weed",
			size: "Large", type: "Plant", tags: [ "Aquatic" ],
			ac: 10, hp: 34, init: 0, cr: "2",
			alignment: alignments.unaligned,
			environments: [ "aquatic" ],
			legendary: false,
			id: "c06f6a75-6ea2-4466-b4ae-ec73b038f97c",
		},
		{
			name: "Tabaxi",
			size: "Medium", type: "Humanoid",
			ac: 12, hp: 11, init: 2, cr: "1/2",
			alignment: alignments.cn,
			environments: [ "forest" ],
			legendary: false,
			id: "83c265a3-3cd4-4f0e-bcdd-38582bc0e1e4",
		},
		{
			name: "Taer",
			size: "Medium", type: "Humanoid",
			ac: 14, hp: 26, init: 2, cr: "1",
			alignment: alignments.n,
			environments: [ "mountain" ],
			legendary: false,
			id: "ea2fba96-a553-40db-a5ef-66912d3f1d46",
		},
		{
			name: "Tangtal",
			size: "Medium", type: "Monstrosity",
			ac: 13, hp: 19, init: 3, cr: "1",
			alignment: alignments.ne,
			environments: [ "forest", "grassland" ],
			legendary: false,
			id: "e70c5539-e92b-43fb-b9b8-a1eafbe50c0a",
		},
		{
			name: "Tazelwurm / Tatzelwurm",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 45, init: 2, cr: "2",
			alignment: alignments.unaligned,
			environments: [ "mountain" ],
			legendary: false,
			id: "1c892be7-9839-4224-8989-8077f52f9e6e",
		},
		{
			name: "Temporal Crawler",
			size: "Medium", type: "Aberration",
			ac: 14, hp: 45, init: 3, cr: "2",
			alignment: alignments.ne,
			environments: [ "planar" ],
			legendary: false,
			id: "5722d06a-5388-4438-bbc3-7644ce74ed1e",
		},
		{
			name: "Tendriculos",
			size: "Large", type: "Plant",
			ac: 8, hp: 93, init: -2, cr: "4",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "b00b8450-8ea4-4fd7-98e9-5a9325ef542f",
		},
		{
			name: "Tentacled Horror",
			size: "Huge", type: "Aberration",
			ac: 17, hp: 171, init: -1, cr: "11",
			alignment: alignments.ce,
			environments: [ "underground" ],
			legendary: true,
			id: "d48b2e9f-df78-43ed-be7c-329cf4a67471",
		},
		{
			section: "Therianthrope", name: "Foxwere",
			size: "Small", type: "Monstrosity", tags: [ "Shapechanger" ],
			ac: 12, hp: 13, init: 2, cr: "1/2",
			alignment: alignments.le,
			environments: [ "forest", "underground" ],
			legendary: false,
			id: "25ae7268-2b42-487e-8bd5-3ff47eb97855",
		},
		{
			section: "Therianthrope", name: "Lionwere",
			size: "Large", type: "Monstrosity", tags: [ "Shapechanger" ],
			ac: 13, hp: 30, init: 3, cr: "2",
			alignment: alignments.ce,
			environments: [ "grassland", "underground" ],
			legendary: false,
			id: "5aece682-36f6-4760-bd9d-862cdbf315b4",
		},
		{
			section: "Therianthrope", name: "Owlwere",
			size: "Small", type: "Monstrosity", tags: [ "Shapechanger" ],
			ac: 13, hp: 13, init: 3, cr: "1/2",
			alignment: alignments.ce,
			environments: [ "grassland", "underground" ],
			legendary: false,
			id: "982f4e9e-01b6-4361-81e9-63f8448f8e8e",
		},
		{
			section: "Therianthrope", name: "Wolfwere",
			size: "Medium", type: "Monstrosity", tags: [ "Shapechanger" ], 
			ac: 14, hp: 19, init: 3, cr: "1",
			alignment: alignments.ce,
			environments: [ "grassland", "underground" ],
			legendary: false,
			id: "42db7f08-1537-484e-a7c4-eeabb41c31cf",
		},
		{
			name: "Lightning Treant",
			size: "Huge", type: "Plant",
			ac: 15, hp: 105, init: -2, cr: "6",
			alignment: alignments.ne,
			environments: [ "forest" ],
			legendary: false,
			id: "ba9171aa-dce5-471f-98a5-002524efea1d",
		},
		{
			name: "Tri-flower Frond",
			size: "Medium", type: "Plant",
			ac: 12, hp: 19, init: 0, cr: "1/2",
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			legendary: false,
			id: "4ba6fe62-4d05-4c9c-a79d-4dbc8ff944e3",
		},
		{
			name: "Dark Triton",
			size: "Large", type: "Monstrosity", tags: [ "Aquatic" ], 
			ac: 12, hp: 30, init: 0, cr: "1",
			alignment: alignments.ce,
			environments: [ "aquatic" ],
			legendary: false,
			id: "e50756f9-5450-40b8-a2b0-0e9d12cdfa46",
		},
		{
			section: "Trolls", name: "Spectral Troll",
			size: "Large", type: "Undead",
			ac: 15, hp: 52, init: 1, cr: "4",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "2e36753d-6831-4782-bde2-ea3d3ba7bd82",
		},
		{
			section: "Trolls", name: "Two-headed Troll",
			size: "Large", type: "Giant",
			ac: 15, hp: 105, init: 1, cr: "6",
			alignment: alignments.ce,
			environments: [ "mountain", "underground" ],
			legendary: false,
			id: "abefd210-c81e-4b0a-b783-99033d183706",
		},
		{
			name: "Tunnel Prawn",
			size: "Small", type: "Beast",
			ac: 14, hp: 7, init: 2, cr: "1/8",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "f894b14f-db34-4fe7-b56d-faaf3af5ae9c",
		},
		{
			name: "Tunnel Worm",
			size: "Huge", type: "Monstrosity",
			ac: 16, hp: 115, init: 1, cr: "8",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "61e73927-3a92-46ed-b036-26ef21f783d5",
		},
		{
			name: "Vampire Rose",
			size: "Small", type: "Plant",
			ac: 9, hp: 27, init: -1, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "7f18f6e9-7582-410a-9fac-dad94e33c49d",
		},
		{
			name: "Vegepygmy Commoner and Worker",
			size: "Small", type: "Plant", tags: [ "Fungoid" ], 
			ac: 12, hp: 10, init: 2, cr: "1/8",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "9dc6591a-0abc-41c7-8577-d432e698d734",
		},
		{
			name: "Vegepygmy Guard",
			size: "Small", type: "Plant", tags: [ "Fungoid" ], 
			ac: 13, hp: 28, init: 2, cr: "1/2",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "3ee667b4-dd1e-4c3b-a9b1-cbb7a67324e2",
		},
		{
			name: "Vegepygmy Chief",
			size: "Medium", type: "Plant", tags: [ "Fungoid" ], 
			ac: 14, hp: 60, init: 2, cr: "3",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "689d781c-3335-41d0-ac69-ca66d43b5f72",
		},
		{
			name: "Volt (Bolt Wurm)",
			size: "Small", type: "Aberration",
			ac: 13, hp: 13, init: 3, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "underground" ],
			legendary: false,
			id: "bee30fb9-d847-4a3c-bd00-02cc0da21369",
		},
		{
			name: "Vorin",
			size: "Huge", type: "Monstrosity", tags: [ "Aquatic" ], 
			ac: 14, hp: 149, init: 4, cr: "9",
			alignment: alignments.ce,
			environments: [ "swamp" ],
			legendary: false,
			id: "26aa0a9b-3c08-40cf-b262-025b902fac25",
		},
		{
			name: "Vulchling",
			size: "Medium", type: "Monstrosity",
			ac: 12, hp: 9, init: 2, cr: "1/8",
			alignment: alignments.ce,
			environments: [ "underground" ],
			legendary: false,
			id: "3a072df0-6203-467f-b638-074af40639d3",
		},
		{
			name: "Lava Weird",
			size: "Large", type: "Elemental",
			ac: 16, hp: 76, init: 2, cr: "4",
			alignment: alignments.ce,
			environments: [ "planar" ],
			legendary: false,
			id: "b4813d30-f494-455b-8f4b-c75ff3bdc854",
		},
		{
			name: "Were-mist",
			size: "Large", type: "Aberration",
			ac: 7, hp: 16, init: 2, cr: "2",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "d3b85b60-4b6b-4ee3-93b1-9baf49440aec",
		},
		{
			name: "Weredactyl",
			size: "Medium", type: "Humanoid", tags: [ "Shapechanger" ], 
			ac: 12, hp: 44, init: 2, cr: "2",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "bbeb8c00-df9b-477c-a485-bfb0cc6ec4e6",
		},
		{
			name: "Widow Creeper",
			size: "Large", type: "Plant",
			ac: 13, hp: 133, init: 1, cr: "10",
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			legendary: false,
			id: "7785b231-b5b2-4269-8aa3-f400c01632f6",
		},
		{
			name: "Witch Grass",
			size: "Small", type: "Plant",
			ac: 5, hp: 3, init: 0, cr: "0",
			alignment: alignments.unaligned,
			environments: [ "forest", "grassland" ],
			legendary: false,
			id: "8a5d973c-9698-4aed-a99b-f31dad99bae5",
		},
		{
			name: "Witherstench",
			size: "Small", type: "Monstrosity",
			ac: 12, hp: 1, init: 2, cr: "0",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "e002e4cd-51ea-4aab-b69b-15826cad2ccd",
		},
		{
			name: "Yellow Musk Creeper",
			size: "Large", type: "Plant",
			ac: 12, hp: 25, init: 2, cr: "1",
			alignment: alignments.unaligned,
			environments: [ "forest", "underground" ],
			legendary: false,
			id: "eb7f35d4-9cfc-4334-9c35-61d723fc658c",
		},
		{
			name: "Yellow Musk Zombie",
			size: "Medium", type: "Plant",
			ac: 9, hp: 19, init: -1, cr: "1/4",
			alignment: alignments.ne,
			environments: [ "forest", "underground" ],
			legendary: false,
			id: "1e77dc01-0354-45db-9915-4bebdb87d17b",
		},
		{
			name: "Zombie Raven",
			size: "Tiny", type: "Undead",
			ac: 11, hp: 3, init: 1, cr: "0",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "2591660e-aa93-45f2-9321-936928f894bd",
		},
		
		// Primeval Thule Campaign Setting
		{
			name: "Abominable Sloth",
			size: "Huge", type: "Beast",
			ac: 11, hp: 126, init: -1, cr: "6",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "2f347c0d-1e2a-40a7-8c1d-9f6d69c67341",
		},
		{
			name: "Crested Eagle",
			size: "Medium", type: "Beast",
			ac: 12, hp: 18, init: 2, cr: "1",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "5b20ac3f-0200-4594-ad60-322a04fb5c6b",
		},
		{
			name: "Giant Viper",
			size: "Huge", type: "Beast",
			ac: 13, hp: 115, init: 2, cr: "6",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "c65eb920-ad38-416b-949f-2e9639f764f7",
		},
		{
			name: "Mosasaur",
			size: "Huge", type: "Beast",
			ac: 13, hp: 145, init: 0, cr: "7",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "5b2de87c-1522-4dd3-a583-37bbb816c105",
		},
		{
			name: "Saber-Tooth Cat",
			size: "Large", type: "Beast",
			ac: 12, hp: 76, init: 2, cr: "4",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "3bd49b24-5cc9-46d3-9236-5a5f5de5f91e",
		},
		{
			name: "Short-Faced Bear",
			size: "Large", type: "Beast",
			ac: 12, hp: 95, init: 1, cr: "5",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "a9d19ad9-1422-4352-9be4-6f854ac116fb",
		},
		{
			name: "Thulean Elk",
			size: "Large", type: "Beast",
			ac: 12, hp: 51, init: 2, cr: "3",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "25194f7f-ec20-4eb9-bd83-b2fa498c42fa",
		},
		{
			name: "Thulean Musk Ox",
			size: "Large", type: "Beast",
			ac: 11, hp: 42, init: -1, cr: "2",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "b4b35e33-1234-47b7-8ce8-c9262eec8b0d",
		},
		{
			name: "Beastman Warrior",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 12, hp: 6, init: 0, cr: "1/4",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "51dcb902-e803-4ad1-b9b9-2a8ef2d6d511",
		},
		{
			name: "Beastman Hunter",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 13, hp: 13, init: 1, cr: "1/2",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "00bc926e-7062-4f89-8b46-01b1ef39cf24",
		},
		{
			name: "Beastman Cursemaker",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 12, hp: 39, init: 2, cr: "2",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "d37c5ee8-99dc-4d06-9473-9614ad66427a",
		},
		{
			name: "Beastman Warchief",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 13, hp: 75, init: 1, cr: "3",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "ef71b8e7-87f1-4fc7-b7b4-842821178169",
		},
		{
			name: "Black Circle Agent",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 15, hp: 58, init: 4, cr: "8",
			alignment: alignments.cn,
			environments: [],
			legendary: false,
			id: "81a79f9a-83be-48ee-bfd7-1a6d99db5f36",
		},
		{
			name: "Black Circle Wizard",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 15, hp: 84, init: 2, cr: "12",
			alignment: alignments.cn,
			environments: [],
			legendary: false,
			id: "a1bffaa9-aaf4-4a1c-ba3f-2c30857df62b",
		},
		{
			name: "Thulean Cyclops",
			size: "Large", type: "Giant",
			ac: 15, hp: 142, init: 1, cr: "10",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "fdeb4efb-ee1e-41ae-96e5-1a769b5bf24f",
		},

		{
			name: "Thulean Dragon",
			size: "Huge", type: "Dragon",
			ac: 17, hp: 195, init: 0, cr: "13",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "baec7ee0-da28-4970-96a0-fff6691b97ca",
		},
		{
			name: "Frost Corpse",
			size: "Medium", type: "Undead",
			ac: 17, hp: 76, init: 2, cr: "8",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "42e76b99-6891-4a05-9050-c855ca2b8ec1",
		},
		{
			name: "Polar Eidolon",
			size: "Huge", type: "Elemental",
			ac: 20, hp: 250, init: 4, cr: "14",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "4ca2cd2d-b92f-43a6-855a-6f8ace88ee53",
		},
		{
			name: "Phoori Beastmaster",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 14, hp: 52, init: 3, cr: "3",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "123ae354-398e-424f-9d34-83aea2bde199",
		},
		{
			name: "Phoori Death Adder",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 14, hp: 58, init: 3, cr: "4",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "9086a812-5ea0-499b-a788-53ae04f74e05",
		},
		{
			name: "Phoori Dark Shaman",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 16, hp: 65, init: 1, cr: "6",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "2ecb6237-f292-4da1-9bf3-764d95163237",
		},
		{
			name: "Rakshasa Honor Guard",
			size: "Medium", type: "Fiend", 
			ac: 18, hp: 76, init: 2, cr: "8",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "68b14ddd-d03b-4bdf-9ce3-d01f0d447dc2",
		},
		{
			name: "Rakshasa Infiltrator",
			size: "Medium", type: "Fiend", 
			ac: 19, hp: 93, init: 5, cr: "10",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "0fa5f768-2bb0-4610-96e9-86c9a34dc1be",
		},
		{
			name: "Rakshasa Raja",
			size: "Medium", type: "Fiend", 
			ac: 19, hp: 102, init: 4, cr: "12",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "6d34402b-7585-4e42-88e9-5b4d264b4464",
		},
		{
			name: "Rakshasa Swordspirit",
			size: "Medium", type: "Fiend", 
			ac: 13, hp: 27, init: 4, cr: "2",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "a44a009c-9cbc-49ad-b71a-8097deb66900",
		},
		{
			name: "Fang Guard",
			size: "Medium", type: "Monstrosity", tags: [ "Serpentman" ], 
			ac: 15, hp: 91, init: 4, cr: "5",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "37637f87-094e-4630-bf2d-877c5d42f350",
		},
		{
			name: "Nessk Champion",
			size: "Large", type: "Monstrosity", tags: [ "Serpentman" ], 
			ac: 17, hp: 126, init: 2, cr: "7",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "742e6ccb-1cd1-4be5-b1fe-7ec41ccf28a9",
		},
		{
			name: "Nessk Charmer",
			size: "Medium", type: "Monstrosity", tags: [ "Serpentman" ], 
			ac: 19, hp: 102, init: 3, cr: "9",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "677dc348-edfd-4a53-80e4-e01df1621c08",
		},
		{
			name: "Chosen Cultist",
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 12, hp: 39, init: 1, cr: "3",
			alignment: alignments.cn,
			environments: [],
			legendary: false,
			id: "68da7346-cfeb-44c1-bc48-032d3d3169ed",
		},
		{
			name: "Cult Priest",
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 17, hp: 76, init: 2, cr: "7",
			alignment: alignments.cn,
			environments: [],
			legendary: false,
			id: "ea56770e-b167-4eec-9ac5-e1cb24b7a13d",
		},
		{
			name: "Deep One Halfbreed",
			size: "Medium", type: "Aberration", 
			ac: 16, hp: 60, init: 1, cr: "3",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "f7a7e0ac-02b1-444a-bf6e-5e22e3996906",
		},
		{
			name: "Seven Knives Thug",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 13, hp: 16, init: 2, cr: "1/4",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "7f514635-f1a3-48e9-9113-8123bb65a330",
		},
		{
			name: "Seven Knives Enforcer",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 15, hp: 27, init: 3, cr: "1",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "290e225c-8c6f-47eb-bbfa-a0714602c307",
		},
		{
			name: "Seven Knives Darkblade",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 16, hp: 66, init: 4, cr: "3",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "26a646b8-778e-4fda-97ec-4d89918bfbb6",
		},
		{
			name: "The Fourth Knife",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 17, hp: 78, init: 4, cr: "5",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "0b996fb5-45ff-4987-9d42-f335afd254a9",
		},
		{
			name: "Winged Ape",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 95, init: 2, cr: "5",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "baddf11a-ca9a-4fb7-9a79-72b16173b5eb",
		},
		{
			name: "Dark Servant of Carcosa",
			size: "Huge", type: "Aberration", tags: [ "Extraterrene" ], 
			ac: 11, hp: 189, init: 1, cr: "11",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "109195a8-ae98-4586-8938-1d6126a9fb6e",
		},
		{
			name: "Gnoph-Keh of Serex",
			size: "Large", type: "Monstrosity", tags: [ "Extraterrene" ], 
			ac: 13, hp: 133, init: 1, cr: "10",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "bc609213-a5b9-4d58-bbd6-8b8aec4323c8",
		},
		{
			name: "Mi-Go, Starcrown",
			size: "Medium", type: "Plant", tags: [ "Extraterrene" ], 
			ac: 17, hp: 85, init: 4, cr: "6",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "65b39c43-194e-4ecc-ab80-19ef9bc0dc18",
		},
		{
			name: "Moon-Beast",
			size: "Large", type: "Aberration", tags: [ "Extraterrene" ], 
			ac: 16, hp: 126, init: 0, cr: "8",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "00ba1c71-e904-4503-b1cb-56ce666a13e0",
		},
		{
			name: "Nightgaunt, Khoori",
			size: "Medium", type: "Monstrosity", tags: [ "Extraterrene" ], 
			ac: 16, hp: 60, init: 3, cr: "4",
			alignment: alignments.cn,
			environments: [],
			legendary: false,
			id: "a0e3b279-b1a2-440b-85fb-7e7e7b57b491",
		},
		{
			name: "Shoggoth",
			size: "Gargantuan", type: "Ooze", tags: [ "Extraterrene" ], 
			ac: 8, hp: 280, init: -2, cr: "17",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "220a3d06-2097-4406-982b-b1335510694a",
		},
		{
			name: "Star-Thing of Nheb",
			size: "Large", type: "Aberration", tags: [ "Extraterrene" ], 
			ac: 17, hp: 133, init: 0, cr: "9",
			alignment: alignments.ne,
			environments: [],
			legendary: false,
			id: "96d32e9c-bd4c-41fd-854e-4a0621a72c30",
		},
		{
			name: "Dhuoth, Giver of Eyes", unique: true, 
			size: "Gargantuan", type: "Plant", tags: [ "Extraterrene" ], 
			ac: 20, hp: 390, init: 0, cr: "24",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "1192d10f-9d8c-4c6c-8b3f-df8b9773107b",
		},
		{
			name: "Plague Nomad",
			size: "Medium", type: "Humanoid", tags: [ "Extraterrene" ], 
			ac: 11, hp: 75, init: 1, cr: "4",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "544831b9-2060-458d-aa18-c087437d8e73",
		},
		{
			name: "Lorthnu'un of the Golden Chalice", unique: true, 
			size: "Huge", type: "Aberration", tags: [ "Extraterrene" ], 
			ac: 18, hp: 348, init: 1, cr: "22",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "e5a27b73-6905-4367-a2a3-109c1d480732",
		},
		{
			name: "Slave of the Chalice",
			size: "Medium", type: "Humanoid", tags: [ "Troglodyte" ], 
			ac: 14, hp: 90, init: 0, cr: "6",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "1e6f0d8b-a6f7-4fe5-b3ad-b642df2838a2",
		},
		{
			name: "Kelauklyth", unique: true, 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 12, hp: 22, init: 2, cr: "1",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "b2d31698-c47d-4330-a1b4-b36e58c061bc",
		},
		{
			name: "The Kelauble",
			size: "Small", type: "Aberration",
			ac: 17, hp: 22, init: 3, cr: "1",
			alignment: alignments.cn,
			environments: [],
			legendary: false,
			id: "575568dd-1e67-4784-99f6-907680c10ba3",
		},
		{
			name: "Mador Kheb, Priest of Set", unique: true, 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 14, hp: 32, init: 0, cr: "2",
			alignment: alignments.le,
			environments: [],
			legendary: false,
			id: "90a561bd-512e-486d-a146-3dad6ae2ef59",
		},
		{
			name: "Temple Guard of Set",
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 13, hp: 16, init: 1, cr: "1/4",
			alignment: alignments.le,
			environments: [],
			legendary: false,
			id: "b2b24fcc-f0f4-4797-a868-4ee55e73aa8e",
		},
		{
			name: "Nephys", unique: true, 
			size: "Medium", type: "Humanoid", tags: [ "Half-elf" ], 
			ac: 17, hp: 76, init: 2, cr: "8",
			alignment: alignments.le,
			environments: [],
			legendary: false,
			id: "84ae5fcf-674c-4bf8-b943-5e33b972a396",
		},
		{
			name: "Ruuk Nath", unique: true, 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 15, hp: 157, init: 3, cr: "7",
			alignment: alignments.cn,
			environments: [],
			legendary: false,
			id: "5c731d9a-6e8a-4109-b5db-5695fce83754",
		},

		// Out of the Abyss
		{
			name: "Derro",
			size: "Small", type: "Humanoid", tags: [ "Derro" ], 
			ac: 13, hp: 13, init: 2, cr: "1/4",
			alignment: alignments.ce,
			environments: [ "underground" ],
			legendary: false,
			id: "dd01bced-063c-41cb-ba10-1c933b9d9d88",
		},
		{
			name: "Ixitxachitl",
			size: "Small", type: "Aberration", 
			ac: 15, hp: 18, init: 3, cr: "1/4",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "df38742a-fad9-4039-a501-cf5149f2254e",
		},
		{
			name: "Vampiric Ixitxachitl",
			size: "Medium", type: "Aberration", 
			ac: 16, hp: 44, init: 4, cr: "2",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "8ccf2d1c-a9d9-48af-a91b-cceb1cd258cc",
		},
		{
			name: "Duergar Soulblade",
			size: "Medium", type: "Humanoid", tags: [ "Dwarf" ],
			ac: 14, hp: 18, init: 3, cr: "1",
			alignment: alignments.le,
			environments: [],
			legendary: false,
			id: "001aaabc-e829-4e64-8877-7b8db8d205d6",
		},
		{
			name: "Duergar Stone Guard",
			size: "Medium", type: "Humanoid", tags: [ "Dwarf" ],
			ac: 18, hp: 39, init: 0, cr: "2",
			alignment: alignments.le,
			environments: [],
			legendary: false,
			id: "2efccc81-8f74-45ff-8ccc-241552884efd",
		},
		{
			name: "Duergar Xarrorn",
			size: "Medium", type: "Humanoid", tags: [ "Dwarf" ],
			ac: 18, hp: 26, init: 0, cr: "2",
			alignment: alignments.le,
			environments: [],
			legendary: false,
			id: "0541ae2c-244b-4a26-92c6-d32df0a581ab",
		},
		{
			name: "Chuul Spore Servant",
			size: "Large", type: "Plant", 
			ac: 16, hp: 93, init: 0, cr: "4",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "eafb811a-c73d-4799-84cf-dd86bd50b79f",
		},
		{
			name: "Drow Spore Servant",
			size: "Medium", type: "Plant", 
			ac: 15, hp: 13, init: 2, cr: "1/8",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "62d870d7-71d3-45b8-a129-db41d42b2dd7",
		},
		{
			name: "Duergar Spore Servant",
			size: "Medium", type: "Plant", 
			ac: 16, hp: 26, init: 0, cr: "1/2",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "14123d05-16e0-4045-ba6b-b022bd5845e4",
		},
		{
			name: "Hook Horror Servant",
			size: "Medium", type: "Plant", 
			ac: 15, hp: 75, init: 0, cr: "3",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "39171a85-e224-425b-ac84-19d6996efe0e",
		},
		{
			name: "Troglodyte Champion of Laogzed",
			size: "Medium", type: "Humanoid", tags: [ "Troglodyte" ],
			ac: 14, hp: 59, init: 1, cr: "3",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "00a707e5-c44c-43ad-9568-e576abe476a1",
		},
		{
			name: "Bridesmaid of Zuggtmoy",
			size: "Medium", type: "Plant", 
			ac: 13, hp: 22, init: 0, cr: "1/8",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "4685b839-bb7b-47d2-8f3e-a31552bd37fc",
		},
		{
			name: "Chamberlain of Zuggtmoy",
			size: "Large", type: "Plant", 
			ac: 13, hp: 45, init: -2, cr: "2",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "dc3ee8c2-b9e6-43e7-b1c2-866dd293223a",
		},
		{
			name: "Female Steeder",
			size: "Large", type: "Beast", 
			ac: 14, hp: 30, init: 3, cr: "1",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "24206108-08c1-42cd-9a3d-d0223545d586",
		},
		{
			name: "Male Steeder",
			size: "Medium", type: "Beast", 
			ac: 12, hp: 13, init: 1, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [],
			legendary: false,
			id: "d9af029b-c451-4d74-bbf8-8fb25fdd609b",
		},
		{
			name: "Droki", unique: true,
			size: "Small", type: "Humanoid", tags: [ "Derro" ], 
			ac: 15, hp: 31, init: 3, cr: "2",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "dadd100d-b2ae-4683-8010-0cab2bbc5377",
		},
		{
			name: "Grisha", unique: true,
			size: "Medium", type: "Humanoid", tags: [ "Damaran Human" ], 
			ac: 18, hp: 33, init: 1, cr: "2",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "fbd25f01-f510-4790-b778-5e5313ad6a2b",
		},
		{
			name: "Narrak", unique: true,
			size: "Small", type: "Humanoid", tags: [ "Derro" ], 
			ac: 12, hp: 40, init: 2, cr: "2",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "516ba46d-27c1-4f5b-afc3-a4b216c88d52",
		},
		{
			name: "The Pudding King", unique: true,
			size: "Small", type: "Humanoid", tags: [ "Gnome", "Shapechanger" ], 
			ac: 13, hp: 49, init: 4, cr: "4",
			alignment: alignments.ce,
			environments: [],
			legendary: false,
			id: "5772d898-4440-4583-b157-73714db987db",
		},
		{
			name: "Yestabrod", unique: true,
			size: "Large", type: "Monstrosity", 
			ac: 15, hp: 75, init: 0, cr: "4",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "e49a7f28-3cf5-4778-b316-0b9fed11cca6",
		},
		{
			section: "Demon Lords", name: "Baphomet", unique: true,
			size: "Huge", type: "Fiend", tags: [ "Demon" ], 
			ac: 22, hp: 333, init: 2, cr: "23",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "d4ceb2aa-9505-443c-b76f-290f6a926df3",
		},
		{
			section: "Demon Lords", name: "Demogorgon", unique: true,
			size: "Huge", type: "Fiend", tags: [ "Demon" ], 
			ac: 22, hp: 496, init: 2, cr: "26",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "7346e68c-5d9c-47d2-9e14-d6b6f809adba",
		},
		{
			section: "Demon Lords", name: "Fraz-Urb'luu", unique: true,
			size: "Large", type: "Fiend", tags: [ "Demon" ], 
			ac: 18, hp: 350, init: 1, cr: "23",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "deabbe0c-ec60-4eee-87ed-2e02a5961892",
		},
		{
			section: "Demon Lords", name: "Graz'zt", unique: true,
			size: "Large", type: "Fiend", tags: [ "Demon", "Shapechanger" ], 
			ac: 20, hp: 378, init: 2, cr: "24",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "02e1b0f5-912e-447c-8118-4946a0c57ef4",
		},
		{
			section: "Demon Lords", name: "Juiblex", unique: true,
			size: "Huge", type: "Fiend", tags: [ "Demon" ], 
			ac: 18, hp: 350, init: 0, cr: "23",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "67fe91fb-6a04-41ba-9efe-7ebd5bec55b4",
		},
		{
			section: "Demon Lords", name: "Orcus", unique: true,
			size: "Huge", type: "Fiend", tags: [ "Demon" ], 
			ac: "17 (20 with Wand of Orcus)", hp: 405, init: 2, cr: "26",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "d6b88949-50e7-4b5f-b15a-7541485cfa62",
		},
		{
			section: "Demon Lords", name: "Yeenoghu", unique: true,
			size: "Huge", type: "Fiend", tags: [ "Demon" ], 
			ac: 22, hp: 348, init: 3, cr: "24",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "d6d31cb2-1b0a-4953-8301-4c16cb51434e",
		},
		{
			section: "Demon Lords", name: "Zuggtmoy", unique: true,
			size: "Large", type: "Fiend", tags: [ "Demon" ], 
			ac: 18, hp: 304, init: 2, cr: "23",
			alignment: alignments.ce,
			environments: [],
			legendary: true,
			id: "14a4af4f-0916-4015-9006-5c71985b07c5",
		},

		// Rise of Tiamat
		{
			name: "Dragonfang",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 15, hp: 78, init: 3, cr: "5",
			alignment: alignments.ne,
			environments: [ "dungeon", "urban" ],
			id: "14062b7c-449d-4dd8-b936-e6c3054bc4dd",
		},
		{
			name: "Dragonsoul",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 16, hp: 110, init: 4, cr: "7",
			alignment: alignments.ne,
			environments: [ "dungeon", "urban" ],
			id: "e69f331d-95ce-4ce4-a45e-ffea0ffc0892",
		},
		{
			name: "Dragonwing",
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 14, hp: 33, init: 3, cr: "2",
			alignment: alignments.ne,
			environments: [ "dungeon", "urban" ],
			id: "1280e58c-b863-4b7a-9753-359b3c76ef86",
		},
		{
			name: "Ice Toad",
			size: "Medium", type: "Monstrosity", 
			ac: 12, hp: 32, init: 0, cr: "1",
			alignment: alignments.n,
			environments: [ "arctic" ],
			id: "b47a1d38-ae42-4c8a-bd89-4cf83cdfc99e",
		},
		{
			name: "Naergoth Bladelord",
			size: "Medium", type: "Undead", 
			ac: 18, hp: 135, init: 1, cr: "11",
			alignment: alignments.ne,
			environments: [ "dungeon" ],
			id: "7e036002-2280-456a-82de-821060bebc86",
		},
		{
			name: "Neronvain",
			size: "Medium", type: "Humanoid", tags: [ "Elf" ],
			ac: 17, hp: 117, init: 3, cr: "9",
			alignment: alignments.ne,
			id: "652fe147-4367-4aa9-bf37-63ff054d034f",
		},
		{
			name: "Severin", unique: true,
			size: "Medium", type: "Humanoid", tags: [ "Human" ],
			ac: 16, hp: 150, init: 1, cr: "11",
			alignment: alignments.ne,
			legendary: true, 
			id: "decbfdf7-40a4-400c-9dad-92ca6869153d",
		},
		{
			name: "Tiamat", unique: true, 
			size: "Gargantuan", type: "Fiend", 
			ac: 25, hp: 615, init: 0, cr: "30",
			alignment: alignments.ce,
			legendary: true, 
			id: "ed941a4e-0d5f-449e-973c-50f1e737501a",
		},

		// Curse of Strahd
		{
			name: "Baba Lysaga's Creeping Hut", unique: true, 
			size: "Gargantuan", type: "Construct", 
			ac: 16, hp: 263, init: -2, cr: "11",
			alignment: alignments.unaligned,
			id: "f0502677-b3bc-45b5-9d2a-7372fddc1e34",
		},
		{
			name: "Broom of Animated Attack", 
			size: "Small", type: "Construct", 
			ac: 15, hp: 17, init: 3, cr: "1/4",
			alignment: alignments.unaligned,
			id: "e70abfb0-fa9f-4562-b65f-2fc63d4c2f9e",
		},
		{
			name: "Guardian Portrait", 
			size: "Medium", type: "Construct", 
			ac: 5, hp: 22, init: -5, cr: "1",
			alignment: alignments.unaligned,
			id: "d7bd3f20-e8da-49dd-87f6-22c2ad01927f",
		},
		{
			name: "Strahd's Animated Armor", unique: true, 
			size: "Medium", type: "Construct", 
			ac: 21, hp: 112, init: 1, cr: "6",
			alignment: alignments.le,
			id: "c90192cf-fbf1-4bef-8794-f7d82bee36b5",
		},
		{
			name: "Baba Lysaga", unique: true, 
			size: "Medium", type: "Humanoid", tags: [ "Human", "Shapechanger" ], 
			ac: 15, hp: 120, init: 0, cr: "11",
			alignment: alignments.ce,
			id: "75e7baad-6bbc-45c2-bf63-5b9e13b4bebd",
		},
		{
			name: "Barovian Witch", 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 10, hp: 16, init: 0, cr: "1/2",
			alignment: alignments.ce,
			id: "0f608e49-e8f8-4a97-9fbc-5cc989138b2c",
		},
		{
			name: "Tree Blight", 
			size: "Huge", type: "Plant", 
			ac: 15, hp: 149, init: 0, cr: "7",
			alignment: alignments.ne,
			id: "148e9550-d99f-4966-9179-00803048b7b9",
		},
		{
			name: "Ezmerelda d'Avenir", 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 17, hp: 82, init: 4, cr: "8",
			alignment: alignments.cg,
			id: "a9a45b1e-1bdd-4e3c-ba90-001df9c3012d",
		},
		{
			name: "Izek Strazni", 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 14, hp: 112, init: 2, cr: "5",
			alignment: alignments.ne,
			id: "a80002c2-40b7-4dab-976f-bef0cfb514f7",
		},
		{
			name: "Madam Eva", 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 10, hp: 88, init: 0, cr: "10",
			alignment: alignments.cn,
			id: "79c90ee5-0e3d-437c-90e0-e79b11dba0c1",
		},
		{
			name: "Mongrelfolk", 
			size: "Medium", type: "Humanoid", tags: [ "Mongrelfolk" ], 
			ac: 11, hp: 26, init: -1, cr: "1/4",
			alignment: alignments.any,
			id: "2ff5978f-9383-4e56-8fe6-27961eedfe77",
		},
		{
			name: "Phantom Warrior", 
			size: "Medium", type: "Undead", 
			ac: 16, hp: 45, init: 0, cr: "3",
			alignment: alignments.any,
			id: "e267fda0-3c81-48e2-b299-34c519fe74e1",
		},
		{
			name: "Pidlewick II", unique: true, 
			size: "Small", type: "Construct", 
			ac: 14, hp: 10, init: 2, cr: "1/4",
			alignment: alignments.ne,
			id: "fd46aa89-2747-4146-a6d3-e82acaeca48c",
		},
		{
			name: "Rahadin", unique: true, 
			size: "Medium", type: "Humanoid", tags: [ "Elf" ], 
			ac: 18, hp: 135, init: 6, cr: "10",
			alignment: alignments.le,
			id: "6bf0d8cb-cd69-4e17-85b8-7b8b35b5e5b1",
		},
		{
			name: "Rictavio", unique: true, 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 12, hp: 77, init: 1, cr: "5",
			alignment: alignments.lg,
			id: "40906ebd-8164-4827-9b90-0b40a0b653ff",
		},
		{
			name: "Strahd von Zarovich", unique: true, 
			size: "Medium", type: "Undead", 
			ac: 16, hp: 144, init: 4, cr: "15",
			alignment: alignments.le,
			legendary: true, 
			id: "80ff81db-e64f-48e4-8750-1b8002dec83e",
		},
		{
			name: "Strahd Zombie", 
			size: "Medium", type: "Undead", 
			ac: 8, hp: 30, init: -2, cr: "1",
			alignment: alignments.unaligned,
			id: "8c5b9532-9129-48bd-a7ba-2778dc429629",
		},
		{
			name: "Vladimir Horngaard", unique: true, 
			size: "Medium", type: "Undead", 
			ac: 17, hp: 192, init: 2, cr: "7",
			alignment: alignments.le,
			id: "4565f845-09c8-4842-b298-ad3dd4055b53",
		},
		{
			name: "Wereraven", 
			size: "Medium", type: "Humanoid", tags: [ "Human", "Shapechanger" ], 
			ac: 12, hp: 31, init: 2, cr: "2",
			alignment: alignments.lg,
			id: "2f23a622-a37b-4c8e-8e1c-a91b11ca6983",
		},

		// Primeval Thule Gamemaster's Companion
		{
			name: "Thulean Chimera", 
			size: "Large", type: "Monstrosity", 
			ac: 15, hp: 123, init: 2, cr: "7",
			alignment: alignments.ce,
			id: "3aa474b6-f6b6-429f-bc2a-76fbfa3d76bd",
		},
		{
			name: "Thulean Manticore", 
			size: "Large", type: "Monstrosity", 
			ac: 17, hp: 152, init: 4, cr: "9",
			alignment: alignments.ne,
			id: "bb4350a6-9d82-4ae2-b722-04847b465f61",
		},
		{
			section: "The Pale Hand", name: "Pale Hand Reaver", 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 16, hp: 127, init: 1, cr: "10",
			alignment: alignments.le,
			id: "1783dc58-0a43-4c52-9fbb-66a0c35a446e",
		},
		{
			section: "The Pale Hand", name: "Sword Weird", 
			size: "Large", type: "Elemental", 
			ac: 14, hp: 119, init: 4, cr: "9",
			alignment: alignments.ne,
			id: "6de43730-b5a7-4f0a-aa92-d94a94c28741",
		},
		{
			section: "The Pale Hand", name: "Prince of the Pale Hand", 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 15, hp: 127, init: 2, cr: "13",
			alignment: alignments.le,
			id: "3e067b55-bd1a-425e-aae0-a0adbb1c145b",
		},
		{
			section: "The Pride of Nergal", name: "Bronze Lion", 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 20, hp: 91, init: 2, cr: "5",
			alignment: alignments.n,
			id: "95c8a285-abf6-41aa-b3b4-9b0d8d3f2904",
		},
		{
			section: "The Pride of Nergal", name: "Scorpion Helot", 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 15, hp: 55, init: 3, cr: "3",
			alignment: alignments.n,
			id: "815fb4dd-ac17-439d-9153-9119ba7f68f5",
		},
		{
			section: "The Pride of Nergal", name: "Red Chimera", 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 14, hp: 112, init: 2, cr: "7",
			alignment: alignments.n,
			id: "00016fd0-4f98-4eea-90cd-7c9461376e05",
		},
		{
			section: "The Pride of Nergal", name: "Lioness of Nergal", 
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 12, hp: 67, init: 2, cr: "6",
			alignment: alignments.n,
			id: "303eb3ae-2872-4b77-b496-bb3a52762811",
		},
		{
			section: "Tcho-Tcho", name: "Tcho-Tcho Cannibal", 
			size: "Small", type: "Humanoid", tags: [ "Human" ], 
			ac: 15, hp: 22, init: 3, cr: "1/2",
			alignment: alignments.ce,
			id: "fd8abecd-454d-4585-ba60-d7dd7ac54cb3",
		},
		{
			section: "Tcho-Tcho", name: "Tcho-Tcho Lama", 
			size: "Small", type: "Humanoid", tags: [ "Human" ], 
			ac: 16, hp: 49, init: 2, cr: "4",
			alignment: alignments.ce,
			id: "f5813b49-1665-456d-827d-6edb80d75c72",
		},
		{
			section: "Tcho-Tcho", name: "Tcho-Tcho Watcher", 
			size: "Small", type: "Humanoid", tags: [ "Human" ], 
			ac: 15, hp: 52, init: 3, cr: "3",
			alignment: alignments.ce,
			id: "f8b7fbc4-42ed-4647-94f2-8977d23a26bb",
		},
		{
			name: "Yga-Ygo, The Dweller in Dreams", unique: true,
			size: "Huge", type: "Aberration", tags: [ "Extraterrene" ], 
			ac: 19, hp: 287, init: 7, cr: "23",
			alignment: alignments.ne,
			id: "73b97ac0-db84-4d2a-b426-958a0b74166e",
		},
		{
			name: "Dream-Seeker of Yga-Ygo", 
			size: "Small", type: "Humanoid", tags: [ "Human" ], 
			ac: 14, hp: 44, init: 2, cr: "3",
			alignment: alignments.ne,
			id: "fe27811d-000f-4462-8e63-157770fbb5b5",
		},

		// Tome of Beasts
		
		{
			name: "Nihileth", 
			size: "Large", type: "Undead", 
			ac: 17, hp: 135, init: -1, cr: 12,
			alignment: alignments.ce,
			legendary: true,
			lair: true,
			id: "fcd7e583-025c-412e-a35f-7ba1c5843206",
		},
		{
			name: "Nihilethic Zombie", 
			size: "Medium", type: "Undead", 
			ac: 9, hp: 22, init: -2, cr: 1,
			alignment: alignments.ne,
			id: "49945869-1d13-4bdf-9f15-dffdc93aeeb4",
		},
		{
			name: "Abominable Beauty", 
			size: "Medium", type: "Fey", 
			ac: 18, hp: 187, init: 4, cr: 11,
			alignment: alignments.ne,
			id: "1a633d85-3731-4a4d-8c9e-a536d9adfad6",
		},
		{
			name: "Accursed Defiler", 
			size: "Medium", type: "Undead", 
			ac: 12, hp: 75, init: 2, cr: 4,
			alignment: alignments.ne,
			id: "3c3d5ba0-b614-4566-aaaa-95fc0c8d961f",
		},
		{
			name: "Ala",
			size: "Medium", type: "Fey",
			ac: 17, hp: 127, init: 3, cr: 8,
			alignment: alignments.ce,
			id: "3ce5021d-916a-443d-a310-c41dfd8a3580",
		},
		{
			name: "Algorith",
			size: "Medium", type: "Construct",
			ac: 18, hp: 136, init: 2, cr: 10,
			alignment: alignments.ln,
			id: "1e860d7b-4e49-4f53-81e0-7dba9c83555b",
		},
		{
			name: "Alseid",
			size: "Medium", type: "Monstrosity",
			ac: 14, hp: 49, init: 3, cr: "1/2",
			alignment: alignments.cn,
			id: "c642e6fe-042c-4286-b0f9-b150b31bc284",
		},
		{
			name: "Alseid Grovekeeper",
			size: "Medium", type: "Monstrosity",
			ac: 15, hp: 71, init: 3, cr: 3,
			alignment: alignments.cn,
			id: "ced91f29-a25f-4964-838e-a870b9997862",
		},
		{
			name: "Amphiptere",
			size: "Medium", type: "Beast",
			ac: 15, hp: 60, init: 4, cr: 3,
			alignment: alignments.unaligned,
			id: "90ff1f35-d729-4844-abed-fd54471d6e8c",
		},
		{
			name: "Andrenjinyi",
			size: "Gargantuan", type: "Celestial",
			ac: 18, hp: 228, init: 3, cr: 15,
			alignment: alignments.n,
			id: "b2434c8b-600d-47ed-b3cd-4cc60718aa3f",
		},
		{
			name: "Angatra",
			size: "Medium", type: "Undead",
			ac: 17, hp: 85, init: 5, cr: 6,
			alignment: alignments.ne,
			id: "d50661d0-ae1e-424e-a25e-6431db6bc3cf",
		},
		{
			name: "Chained Angel",
			size: "Medium", type: "Celestial",
			ac: 16, hp: 88, init: 3, cr: 8,
			alignment: alignments.ne,
			id: "5ae8fdbc-34b8-4a42-b737-72b0ac88111e",
		},
		{
			name: "Fidele ",
			size: "Medium", type: "Celestial", tags: [ "Shapechanger" ], 
			ac: 16, hp: 104, init: 4, cr: 5,
			alignment: alignments.lg,
			id: "e4b1e894-6d70-43bb-afe7-8f51cd8a69a8",
		},
		{
			name: "Angler Worm",
			size: "Huge", type: "Monstrosity",
			ac: 14, hp: 133, init: -3, cr: 4,
			alignment: alignments.unaligned,
			id: "7c81fe4e-ee03-46a9-92f4-51beef2e627f",
		},
		{
			name: "Giant Ant",
			size: "Large", type: "Beast",
			ac: 14, hp: 52, init: 1, cr: 2,
			alignment: alignments.unaligned,
			id: "ded2487d-834b-40c2-b5d1-a4a3fca49ed5",
		},
		{
			name: "Giant Ant Queen",
			size: "Large", type: "Beast",
			ac: 15, hp: 85, init: 1, cr: 4,
			alignment: alignments.unaligned,
			id: "e7f62072-f6da-4e2f-98ab-d319a99f70e9",
		},
		{
			name: "Anubian",
			size: "Medium", type: "Elemental",
			ac: 13, hp: 44, init: 3, cr: 2,
			alignment: alignments.ce,
			id: "e9e27407-0f34-477c-bf29-5b467dd8688d",
		},
		{
			name: "Arboreal Grappler",
			size: "Medium", type: "Aberration",
			ac: 14, hp: 90, init: 3, cr: 3,
			alignment: alignments.ne,
			id: "0d31b96c-68c9-467c-b193-24ab298f9301",
		},
		{
			name: "Aridni",
			size: "Small", type: "Fey",
			ac: 15, hp: 82, init: 5, cr: 5,
			alignment: alignments.ne,
			id: "5ebbc6d7-8854-4aa6-8aee-7ee021327a25",
		},
		{
			name: "Asanbosam",
			size: "Large", type: "Aberration",
			ac: 14, hp: 102, init: 1, cr: 5,
			alignment: alignments.ce,
			id: "98620d9d-449e-4459-ab8b-328aeec551a7",
		},
		{
			name: "Azza Gremlin",
			size: "Small", type: "Fey",
			ac: 14, hp: 7, init: 4, cr: "1/4",
			alignment: alignments.n,
			id: "b1a5f8d4-b1c1-4f4b-8079-3124445f3d56",
		},
		{
			name: "Baba Yagas Horsemen",
			size: "Medium", type: "Fey",
			ac: 20, hp: 171, init: 0, cr: 11,
			alignment: alignments.ln,
			id: "267e5321-57ba-4bef-880e-95b1fadcaf2f",
		},
		{
			name: "Bagiennik",
			size: "Medium", type: "Aberration",
			ac: 15, hp: 75, init: 4, cr: 3,
			alignment: alignments.cn,
			id: "9024f9d0-bab8-4d68-8414-62550e8f2171",
		},
		{
			name: "Bastet Temple Cat",
			size: "Small", type: "Beast",
			ac: 14, hp: 40, init: 4, cr: 1,
			alignment: alignments.cn,
			id: "b28a0279-4cc4-4cec-a11a-4dc9afb93e55",
		},
		{
			name: "Bearfolk",
			size: "Medium", type: "Humanoid", tags: [ "Bearfolk" ], 
			ac: 14, hp: 45, init: 2, cr: 3,
			alignment: alignments.cg,
			id: "13ccff69-326d-4414-984b-a7e5407eb71b",
		},
		{
			name: "Behtu",
			size: "Small", type: "Humanoid",
			ac: 14, hp: 52, init: 3, cr: 2,
			alignment: alignments.ce,
			id: "d4d6352d-b990-4c99-9f9d-ab5c5ba159a4",
		},
		{
			name: "Beli",
			size: "Small", type: "Fey",
			ac: 15, hp: 45, init: 3, cr: 2,
			alignment: alignments.ne,
			id: "e301d09b-5c14-45cc-bc8c-c3a2489095b8",
		},
		{
			name: "Bereginyas",
			size: "Tiny", type: "Fey",
			ac: 15, hp: 70, init: 5, cr: 4,
			alignment: alignments.ne,
			id: "9c8588ee-09b7-44fa-b772-2ea263f28e6c",
		},
		{
			name: "Blemmyes",
			size: "Large", type: "Monstrosity",
			ac: 15, hp: 168, init: 1, cr: 8,
			alignment: alignments.ce,
			id: "af3a3b15-91d9-464d-85d7-abf95204a27a",
		},
		{
			name: "Boloti",
			size: "Tiny", type: "Fey",
			ac: 15, hp: 63, init: 5, cr: 1,
			alignment: alignments.ne,
			id: "f36499ae-b897-427c-87b5-c60d63c9f68b",
		},
		{
			name: "Bone Collective",
			size: "Small", type: "Undead",
			ac: 17, hp: 120, init: 5, cr: 8,
			alignment: alignments.ce,
			id: "5b6e8646-2883-4816-b406-6ffb609d3a48",
		},
		{
			name: "Bone Crab ",
			size: "Small", type: "Beast",
			ac: 13, hp: 33, init: 2, cr: "1/2",
			alignment: alignments.n,
			id: "f28d1e74-980d-4ef1-912a-68e23b3bbe95",
		},
		{
			name: "Bone Swarm",
			size: "Large", type: "Undead", tags: [ "Swarm" ], 
			ac: 17, hp: 198, init: 4, cr: 10,
			alignment: alignments.ce,
			id: "cdf3875f-178a-4a99-bcb5-15fabc681244",
		},
		{
			name: "Boreas",
			size: "Medium", type: "Elemental", unique: true,
			ac: 20, hp: 168, init: 6, cr: 17,
			alignment: alignments.ce,
			legendary: true, 
			id: "12a75eb1-cddd-4af7-9afd-94d639bc40e1",
		},
		{
			name: "Bouda",
			size: "Medium", type: "Fiend", tags: [ "Shapechanger" ], 
			ac: 15, hp: 93, init: 2, cr: 5,
			alignment: alignments.ne,
			id: "83d71bdd-22d2-4206-8e5d-c6009f6d31ff",
		},
		{
			name: "Broodiken",
			size: "Tiny", type: "Construct",
			ac: 13, hp: 55, init: 2, cr: 1,
			alignment: alignments.n,
			id: "d32bb8f5-ec73-4b91-a5f6-266466720410",
		},
		{
			name: "Bucca",
			size: "Tiny", type: "Fey",
			ac: 14, hp: 27, init: 3, cr: "1/2",
			alignment: alignments.ne,
			id: "9f5ab0a9-5c7c-4e6c-a26f-dc00b32c4523",
		},
		{
			name: "Bukavac",
			size: "Large", type: "Monstrosity",
			ac: 16, hp: 199, init: 3, cr: 9,
			alignment: alignments.ne,
			id: "4184047d-c775-4d83-8577-cac0bffa6a1c",
		},
		{
			name: "Buraq",
			size: "Medium", type: "Celestial",
			ac: 17, hp: 152, init: 4, cr: 11,
			alignment: alignments.lg,
			id: "54c396e9-6b6d-4463-bf45-2e83a01e4ef5",
		},
		{
			name: "Burrowling",
			size: "Small", type: "Humanoid", tags: [ "Burrowling" ], 
			ac: 13, hp: 27, init: 3, cr: "1/2",
			alignment: alignments.ln,
			id: "89f9f934-37cb-40f2-b3c1-188df4a4a08e",
		},
		{
			name: "Cactid",
			size: "Large", type: "Plant",
			ac: 14, hp: 76, init: -1, cr: 3,
			alignment: alignments.unaligned,
			id: "674fd6b5-592f-4717-9b03-177c1cf4f5bf",
		},
		{
			name: "Cambium",
			size: "Large", type: "Fiend",
			ac: 19, hp: 264, init: 3, cr: 14,
			alignment: alignments.ne,
			id: "e6f3dd42-c20b-495d-a760-a6f4d8505e99",
		},
		{
			name: "Carrion Beetle",
			size: "Large", type: "Beast",
			ac: 15, hp: 127, init: 1, cr: 4,
			alignment: alignments.n,
			id: "b1c14b61-f2db-475c-b900-4d2ccc2a8fc1",
		},
		{
			name: "Cavelight Moss",
			size: "Large", type: "Plant",
			ac: 15, hp: 95, init: 0, cr: 4,
			alignment: alignments.n,
			id: "0a40557f-8f49-47c7-823b-139cd49a4d2f",
		},
		{
			name: "Chelicerae",
			size: "Large", type: "Aberration",
			ac: 16, hp: 153, init: 3, cr: 7,
			alignment: alignments.ne,
			id: "5cb25d80-ed86-4817-af6a-4d934b9a633b",
		},
		{
			name: "Chernomoi",
			size: "Tiny", type: "Fey",
			ac: 13, hp: 32, init: 4, cr: 1,
			alignment: alignments.n,
			id: "8a8dfede-f0b5-4173-9aac-dd3bd9d08077",
		},
		{
			name: "Child of the Briar",
			size: "Tiny", type: "Plant",
			ac: 13, hp: 50, init: 3, cr: 1,
			alignment: alignments.ne,
			id: "0f659c11-520c-4ce5-a957-d2409ccac868",
		},
		{
			name: "Chronalmental",
			size: "Large", type: "Elemental",
			ac: 17, hp: 152, init: 5, cr: 8,
			alignment: alignments.unaligned,
			id: "991dd272-dc07-47e6-8b5f-707d1099ceee",
		},
		{
			name: "Cikavak",
			size: "Tiny", type: "Beast",
			ac: 12, hp: 17, init: 2, cr: 1,
			alignment: alignments.n,
			id: "4faaaab2-447c-4fe1-a1b5-fc5487e4311f",
		},
		{
			name: "Clockwork Abomination",
			size: "Large", type: "Fiend", tags: [ "Devil", "Construct" ],
			ac: 16, hp: 76, init: 1, cr: 5,
			alignment: alignments.le,
			id: "4af41011-a054-40e9-aae0-827aa8a7a198",
		},
		{
			name: "Clockwork Beetle",
			size: "Tiny", type: "Construct",
			ac: 14, hp: 15, init: 3, cr: "1/2",
			alignment: alignments.unaligned,
			id: "7ba732bf-d9ba-44e3-9ac7-db55bb55c17b",
		},
		{
			name: "Clockwork Beetle Swarm",
			size: "Large", type: "Construct", tags: [ "Swarm" ],
			ac: 14, hp: 52, init: 3, cr: 3,
			alignment: alignments.n,
			id: "c96276b1-d369-46d8-bf47-a18e630e4623",
		},
		{
			name: "Clockwork Hound",
			size: "Medium", type: "Construct",
			ac: 12, hp: 71, init: 2, cr: 2,
			alignment: alignments.unaligned,
			id: "69b8876f-11e3-4ff6-8c14-c7a238a1b3a5",
		},
		{
			name: "Clockwork Huntsman",
			size: "Medium", type: "Construct",
			ac: 14, hp: 110, init: 2, cr: 3,
			alignment: alignments.unaligned,
			id: "8aa5470b-b117-4f0f-bda0-a1049f445268",
		},
		{
			name: "Clockwork Myrmidon",
			size: "Large", type: "Construct",
			ac: 16, hp: 153, init: 2, cr: 6,
			alignment: alignments.unaligned,
			id: "bb046b76-72f1-4277-940e-2dbb87d73073",
		},
		{
			name: "Clockwork Watchman",
			size: "Medium", type: "Construct",
			ac: 14, hp: 55, init: 1, cr: "1/2",
			alignment: alignments.unaligned,
			id: "1cd6c9c3-ddb4-4f51-ada9-479ed2751c23",
		},
		{
			name: "Clockwork Weaving Spider",
			size: "Tiny", type: "Construct",
			ac: 15, hp: 25, init: 3, cr: 1,
			alignment: alignments.unaligned,
			id: "d80c84ff-8bce-40e8-b7a1-035b2cded742",
		},
		{
			name: "Clurichaun",
			size: "Tiny", type: "Fey",
			ac: 14, hp: 22, init: 1, cr: "1/4",
			alignment: alignments.cn,
			id: "c8ba631f-38db-4bf3-9188-d35cedc3fee5",
		},
		{
			name: "Cobbleswarm",
			size: "Medium", type: "Monstrosity", tags: [ "Swarm" ], 
			ac: 15, hp: 36, init: 0, cr: 2,
			alignment: alignments.unaligned,
			id: "da9a6770-9136-427d-afe6-6edcefe41b17",
		},
		{
			name: "Corpse Mound",
			size: "Huge", type: "Undead",
			ac: 16, hp: 207, init: 0, cr: 11,
			alignment: alignments.ne,
			id: "5df42798-f133-4df3-aea6-e249eed5f49d",
		},
		{
			name: "Dau",
			size: "Small", type: "Fey",
			ac: 13, hp: 49, init: 3, cr: 4,
			alignment: alignments.cn,
			id: "a8b87110-5394-4035-b4fb-27671b127a7d",
		},
		{
			name: "Death Butterfly Swarm",
			size: "Large", type: "Beast", tags: [ "Swarm" ], 
			ac: 15, hp: 60, init: 1, cr: 4,
			alignment: alignments.ce,
			id: "5d7b51f8-f1dc-4e42-a469-c44e38be0996",
		},
		{
			name: "Greater Death Butterfly Swarm",
			size: "Huge", type: "Beast", tags: [ "Swarm" ], 
			ac: 15, hp: 84, init: 3, cr: 6,
			alignment: alignments.ce,
			id: "217f088a-529d-42fd-a815-4880c393cbd5",
		},
		{
			name: "Deathwisp",
			size: "Medium", type: "Undead",
			ac: 15, hp: 82, init: 5, cr: 7,
			alignment: alignments.ne,
			id: "9bfde490-5c91-4097-a6b0-b63427b1ab0a",
		},
		{
			name: "Deep One",
			size: "Medium", type: "Humanoid", tags: [ "Deep One" ], 
			ac: 13, hp: 91, init: 1, cr: 2,
			alignment: alignments.ce,
			id: "c2c6bb2e-0372-42a9-a91d-a97b604f4ba2",
		},
		{
			name: "Deep One Hybrid Priest",
			size: "Medium", type: "Humanoid", tags: [ "Deep One" ], 
			ac: 14, hp: 120, init: 2, cr: 4,
			alignment: alignments.ce,
			id: "8ca21423-f105-4240-9f58-8073e2579cdc",
		},
		{
			name: "Deep One Archimandrite",
			size: "Large", type: "Humanoid", tags: [ "Deep One" ], 
			ac: 15, hp: 153, init: 2, cr: 8,
			alignment: alignments.ce,
			id: "7b3d0676-429c-4e98-b1e4-2a30dc4c8a35",
		},
		{
			section: "Demons", name: "Apau Perape",
			size: "Large", type: "Fiend", tags: [ "Demon" ], 
			ac: 16, hp: 95, init: 4, cr: 6,
			alignment: alignments.ce,
			id: "8d774866-4341-42c4-8679-b24b59fc6f5b",
		},
		{
			section: "Demons", name: "Berstuc",
			size: "Large", type: "Fiend", tags: [ "Demon" ], 
			ac: 18, hp: 157, init: 0, cr: 11,
			alignment: alignments.ce,
			id: "b1d88741-cd79-4752-bb6f-1ef696b7a9a4",
		},
		{
			section: "Demons", name: "Kishi",
			size: "Medium", type: "Fiend", tags: [ "Demon" ], 
			ac: 18, hp: 119, init: 5, cr: 8,
			alignment: alignments.ce,
			id: "dc7c2dcc-7512-4743-ad9c-4700f63625a6",
		},
		{
			section: "Demons", name: "Malakbel",
			size: "Medium", type: "Fiend", tags: [ "Demon" ], 
			ac: 14, hp: 102, init: 3, cr: 9,
			alignment: alignments.ce,
			id: "d321e41e-ddb9-449b-a03a-066d24566c14",
		},
		{
			section: "Demons", name: "Psoglav",
			size: "Large", type: "Fiend", tags: [ "Demon" ], 
			ac: 17, hp: 115, init: 6, cr: 7,
			alignment: alignments.ce,
			id: "5394d8bb-772d-4a44-aac1-db6300bf4b9e",
		},
		{
			section: "Demons", name: "Rubezahl",
			size: "Medium", type: "Fiend", tags: [ "Demon" ], 
			ac: 15, hp: 110, init: 2, cr: 10,
			alignment: alignments.ce,
			id: "bc46fd53-e06a-499a-b781-8ca3824b8b4e",
		},
		{
			section: "Demon Lords", name: "Akyishigal, Demon Lord of Cockroaches",
			size: "Large", type: "Fiend", tags: [ "Demon" ], unique: true, 
			ac: 18, hp: 138, init: 3, cr: 12,
			alignment: alignments.ce,
			legendary: true, 
			id: "85acd254-e004-4c15-91b3-990d1880575d",
		},
		{
			name: "Spawn of Akyishigal",
			size: "Large", type: "Fiend", tags: [ "Demon" ], 
			ac: 15, hp: 119, init: 1, cr: 5,
			alignment: alignments.ce,
			id: "49b94afc-5003-4b15-8aac-09f4decdc506",
		},
		{
			section: "Demon Lords", name: "Alquam, Demon Lord of Night",
			size: "Huge", type: "Fiend", tags: [ "Demon" ], unique: true,  
			ac: 20, hp: 350, init: 4, cr: 21,
			alignment: alignments.ce,
			legendary: true, 
			lair: true,
			id: "6618d8f9-4006-4a59-8519-db3fbd103d3a",
		},
		{
			section: "Demon Lords", name: "Camazotz, Demon Lord of Bats and Fire",
			size: "Large", type: "Fiend", tags: [ "Demon", "Shapechanger" ], unique: true, 
			ac: 19, hp: 537, init: 6, cr: 22,
			alignment: alignments.ce,
			legendary: true, 
			id: "4b6e0da3-3261-4d4e-a3c7-8873d4479070",
		},
		{
			name: "Skin Bat",
			size: "Small", type: "Undead", 
			ac: 13, hp: 14, init: 3, cr: "1/2",
			alignment: alignments.ne,
			id: "d3568a44-6269-47cd-b213-35782c1f25b2",
		},
		{
			section: "Demon Lords", name: "Mechuiti, Demon Lord of Apes",
			size: "Gargantuan", type: "Fiend", tags: [ "Demon" ], unique: true,  
			ac: 19, hp: 370, init: 4, cr: 27,
			alignment: alignments.ce,
			legendary: true, 
			lair: true, 
			id: "6ff39a6c-254a-44b9-9054-1b454266a7d5",
		},
		{
			section: "Demon Lords", name: "Qorgeth, Demon Lord of the Devouring Worm",
			size: "Gargantuan", type: "Fiend", tags: [ "Demon" ], unique: true,  
			ac: 21, hp: 370, init: -2, cr: 23,
			alignment: alignments.ce,
			legendary: true, 
			lair: true, 
			id: "f53799a6-554d-4893-a48e-f66ab4577894",
		},
		{
			name: "Derro Fetal Savant",
			size: "Tiny", type: "Humanoid", tags: [ "Derro" ], 
			ac: 15, hp: 2, init: -5, cr: 4,
			alignment: alignments.ce,
			id: "b9a861e7-02b9-4281-9703-876ee53b345d",
		},
		{
			name: "Derro Shadow Antipaladin",
			size: "Small", type: "Humanoid", tags: [ "Derro" ], 
			ac: 18, hp: 82, init: 4, cr: 5,
			alignment: alignments.ce,
			id: "e61dd711-d229-48d3-abe7-444efdb3f415",
		},
		{
			section: "Arch-Devils", name: "Arbeyach",
			size: "Large", type: "Fiend", tags: [ "Devil" ], unique: true, 
			ac: 17, hp: 275, init: 5, cr: 21,
			alignment: alignments.le,
			legendary: true, 
			id: "d09d224e-f273-43b6-8d15-d7d302d859f0",
		},
		{
			name: "Spawn of Arbeyach",
			size: "Medium", type: "Aberration",
			ac: 17, hp: 78, init: 2, cr: 5,
			alignment: alignments.le,
			id: "c28ba1f4-62a3-4193-a571-9cd0fc9029d9",
		},
		{
			section: "Arch-Devils", name: "Ia'Affrat",
			size: "Large", type: "Elemental", tags: [ "Swarm" ], unique: true, 
			ac: 17, hp: 170, init: 5, cr: 15,
			alignment: alignments.le,
			id: "afe75252-bdbf-490e-990e-0496b14fe729",
		},
		{
			section: "Arch-Devils", name: "Mammon",
			size: "Huge", type: "Fiend", tags: [ "Devil" ], unique: true, 
			ac: 20, hp: 378, init: 1, cr: 25,
			alignment: alignments.le,
			legendary: true, 
			lair: true, 
			id: "3a75d531-eef3-4bec-a386-5c984ff90369",
		},
		{
			section: "Arch-Devils", name: "Totivillus, Scribe of Hell",
			size: "Medium", type: "Fiend", tags: [ "Devil" ], unique: true, 
			ac: 19, hp: 299, init: 4, cr: 24,
			alignment: alignments.le,
			legendary: true, 
			id: "56cebeca-6791-4465-a8b0-04b96bc02d53",
		},
		{
			section: "Devils", name: "Automata Devil",
			size: "Large", type: "Fiend", tags: [ "Devil" ], 
			ac: 17, hp: 168, init: 3, cr: 10,
			alignment: alignments.le,
			id: "4f7e3706-2145-47d5-8367-6ba0381fd997",
		},
		{
			section: "Devils", name: "Cohort Devil",
			size: "Medium", type: "Fiend", tags: [ "Devil" ], 
			ac: 18, hp: 187, init: 5, cr: 12,
			alignment: alignments.le,
			id: "40d36b04-a33c-4b9a-84ed-a4506de964ad",
		},
		{
			section: "Devils", name: "Crystalline Devil",
			size: "Medium", type: "Fiend", tags: [ "Devil" ], 
			ac: 15, hp: 102, init: 1, cr: 6,
			alignment: alignments.le,
			id: "b46b05ee-656f-4588-b0a0-68322c3f8116",
		},
		{
			section: "Devils", name: "Gilded Devil",
			size: "Medium", type: "Fiend", tags: [ "Devil" ], 
			ac: 16, hp: 112, init: 2, cr: 7,
			alignment: alignments.le,
			id: "7b581c15-0da9-4718-a7da-ec08a140dc73",
		},
		{
			section: "Devils", name: "Ink Devil",
			size: "Small", type: "Fiend", tags: [ "Devil" ], 
			ac: 14, hp: 54, init: 4, cr: 2,
			alignment: alignments.le,
			id: "7d7c18e6-c80b-483d-8302-ecb14033cc33",
		},
		{
			section: "Devils", name: "Koralk (Harvester Devil)",
			size: "Large", type: "Outsider", 
			ac: 15, hp: 136, init: 1, cr: 11,
			alignment: alignments.le,
			id: "39d0b4b1-0025-4634-86c0-3bf717c91725",
		},
		{
			section: "Devils", name: "Lunar Devil",
			size: "Large", type: "Fiend", tags: [ "Devil" ], 
			ac: 16, hp: 94, init: 5, cr: 8,
			alignment: alignments.le,
			id: "66c123d3-a888-459c-bb7f-84d84ab90406",
		},
		{
			section: "Devils", name: "Orobas Devil ",
			size: "Large", type: "Fiend", tags: [ "Devil" ], 
			ac: 19, hp: 261, init: 2, cr: 14,
			alignment: alignments.le,
			id: "c3a683d3-be46-4d12-95d4-a7bc4b0ce6df",
		},
		{
			section: "Devils", name: "Salt Devil",
			size: "Medium", type: "Fiend", tags: [ "Devil" ], 
			ac: 13, hp: 93, init: 1, cr: 6,
			alignment: alignments.le,
			id: "30495e72-f1fd-4ee3-8ed3-c4c1492b50ff",
		},
		{
			section: "Dinosaurs", name: "Mbielu",
			size: "Huge", type: "Beast",
			ac: 15, hp: 95, init: 2, cr: 3,
			alignment: alignments.unaligned,
			id: "4cc7e076-cde9-465a-865a-826fbfb772e8",
		},
		{
			section: "Dinosaurs", name: "Ngobou",
			size: "Large", type: "Beast",
			ac: 15, hp: 85, init: -1, cr: 5,
			alignment: alignments.unaligned,
			id: "c2955321-3e1e-44b3-9d9c-fff7bbe0c1c8",
		},
		{
			section: "Dinosaurs", name: "Spinosaurus",
			size: "Gargantuan", type: "Beast",
			ac: 15, hp: 231, init: -1, cr: 13,
			alignment: alignments.unaligned,
			id: "2fcdadab-7ad8-4a4a-9119-f3fd7c2222d7",
		},
		{
			section: "Dinosaurs", name: "Young Spinosaurus",
			size: "Huge", type: "Beast",
			ac: 14, hp: 105, init: 0, cr: 5,
			alignment: alignments.unaligned,
			id: "a2dbba10-4493-47d2-b83c-f3d84194d6a8",
		},
		{
			name: "Dipsa",
			size: "Tiny", type: "Ooze",
			ac: 15, hp: 27, init: 3, cr: "1/4",
			alignment: alignments.unaligned,
			id: "029b2de7-9340-480f-b6af-ff0977938314",
		},
		{
			name: "Dissimortuum",
			size: "Medium", type: "Undead",
			ac: 15, hp: 112, init: 0, cr: 7,
			alignment: alignments.ce,
			id: "136623a6-3663-4fe4-b735-a76dc2555bac",
		},
		{
			name: "Dogmole",
			size: "Medium", type: "Beast",
			ac: 14, hp: 71, init: 3, cr: 1,
			alignment: alignments.n,
			id: "743a4dd7-3466-473a-b63a-e2a20202a911",
		},
		{
			name: "Dogmole Juggernaut",
			size: "Large", type: "Monstrosity",
			ac: 15, hp: 126, init: 2, cr: 5,
			alignment: alignments.n,
			id: "1f9e3430-2364-4963-951c-293834918685",
		},
		{
			name: "Domovoi",
			size: "Medium", type: "Fey",
			ac: 15, hp: 93, init: 1, cr: 4,
			alignment: alignments.cn,
			id: "1a197bad-659e-46b1-a068-c8431a34b6f1",
		},
		{
			name: "Doppelrat",
			size: "Tiny", type: "Monstrosity",
			ac: 13, hp: 22, init: 3, cr: 2,
			alignment: alignments.unaligned,
			id: "4ccf6f2d-e76f-4ee6-aff2-95fbcea22886",
		},
		{
			name: "Dorreq",
			size: "Medium", type: "Aberration",
			ac: 15, hp: 93, init: 4, cr: 4,
			alignment: alignments.ne,
			id: "9b159862-bb1d-4d99-9088-67b06781af2b",
		},
		{
			section: "Dragons", name: "Adult Cave Dragon",
			size: "Huge", type: "Dragon",
			ac: 18, hp: 243, init: 1, cr: 16,
			alignment: alignments.ne,
			legendary: true,
			lair: true, 
			id: "40aded6f-4cd4-4a24-969e-7d68648e9ac2",
		},
		{
			section: "Dragons", name: "Young Cave Dragon",
			size: "Large", type: "Dragon",
			ac: 17, hp: 157, init: 1, cr: 8,
			alignment: alignments.ne,
			id: "c7d443c2-ed3c-4015-9e9e-7b11e15e0e9d",
		},
		{
			section: "Dragons", name: "Cave Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 16, hp: 75, init: 1, cr: 2,
			alignment: alignments.ne,
			id: "307aaf51-a949-4afd-909d-d6c31680802b",
		},

		{
			section: "Dragons", name: "Ancient Flame Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 22, hp: 481, init: 2, cr: 24,
			alignment: alignments.ce,
			legendary: true, 
			lair: true, 
			id: "9bf4904d-c617-4523-9628-464d8c5179d1",
		},
		{
			section: "Dragons", name: "Adult Flame Dragon",
			size: "Huge", type: "Dragon",
			ac: 19, hp: 212, init: 2, cr: 16,
			alignment: alignments.ce,
			legendary: true, 
			lair: true, 
			id: "8e7c88ec-81bf-4a79-be26-7012eb81390a",
		},
		{
			section: "Dragons", name: "Young Flame Dragon",
			size: "Large", type: "Dragon",
			ac: 18, hp: 161, init: 2, cr: 9,
			alignment: alignments.ce,
			id: "12314cf6-d600-4846-b720-6b9c8c0c7126",
		},
		{
			section: "Dragons", name: "Flame Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 17, hp: 52, init: 2, cr: 3,
			alignment: alignments.ce,
			id: "47d3a59e-3344-4904-a708-b16f19ef4ff1",
		},
		{
			section: "Dragons", name: "Ancient Mithral Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 20, hp: 297, init: 3, cr: 18,
			alignment: alignments.n,
			legendary: true, 
			id: "b661391a-b533-48f0-9147-bf0c9f648244",
		},
		{
			section: "Dragons", name: "Adult Mithral Dragon",
			size: "Huge", type: "Dragon",
			ac: 18, hp: 184, init: 4, cr: 14,
			alignment: alignments.n,
			legendary: true,
			id: "77fb4076-f427-492c-8d0a-526481be91f2",
		},
		{
			section: "Dragons", name: "Young Mithral Dragon",
			size: "Medium", type: "Dragon",
			ac: 16, hp: 92, init: 6, cr: 6,
			alignment: alignments.n,
			id: "1b0d62f6-3c35-47e2-9390-32cd6319a146",
		},
		{
			section: "Dragons", name: "Ancient Sea Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 22, hp: 481, init: 0, cr: 22,
			alignment: alignments.ne,
			legendary: true, 
			lair: true, 
			id: "baa33773-4a28-4fb3-b676-28e91ff82180",
		},
		{
			section: "Dragons", name: "Adult Sea Dragon",
			size: "Huge", type: "Dragon",
			ac: 19, hp: 225, init: 0, cr: 16,
			alignment: alignments.ne,
			legendary: true, 
			lair: true, 
			id: "44f93eee-8261-4407-b407-0abd856def1c",
		},
		{
			section: "Dragons", name: "Young Sea Dragon",
			size: "Large", type: "Dragon",
			ac: 18, hp: 152, init: 0, cr: 9,
			alignment: alignments.ne,
			id: "fa12b6ea-08af-4c29-a08f-d1cf4645eecc",
		},
		{
			section: "Dragons", name: "Sea Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 17, hp: 52, init: 0, cr: 2,
			alignment: alignments.ne,
			id: "7c077d65-f465-4c33-8ce3-f0a864822a8f",
		},
		{
			section: "Dragons", name: "Ancient Void Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 22, hp: 448, init: 0, cr: 24,
			alignment: alignments.cn,
			legendary: true, 
			lair: true, 
			id: "1d027163-d5ff-41a6-be7c-c1459ceb1832",
		},
		{
			section: "Dragons", name: "Adult Void Dragon",
			size: "Huge", type: "Dragon",
			ac: 19, hp: 229, init: 0, cr: 14,
			alignment: alignments.cn,
			legendary: true, 
			lair: true, 
			id: "6b0abf48-3dc7-4b64-8639-40e43d15fb88",
		},
		{
			section: "Dragons", name: "Young Void Dragon",
			size: "Large", type: "Dragon",
			ac: 18, hp: 157, init: 0, cr: 9,
			alignment: alignments.cn,
			id: "b474ce40-7d47-468c-b901-9107d20bb9ac",
		},
		{
			section: "Dragons", name: "Void Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 17, hp: 45, init: 0, cr: 2,
			alignment: alignments.cn,
			id: "bdf8d1f6-bb8f-4015-a671-e4e013d79fe8",
		},
		{
			section: "Dragons", name: "Ancient Wind Dragon",
			size: "Gargantuan", type: "Dragon",
			ac: 20, hp: 425, init: 4, cr: 22,
			alignment: alignments.cn,
			legendary: true, 
			lair: true, 
			id: "4fe57631-65e5-4584-b195-534c717098f8",
		},
		{
			section: "Dragons", name: "Adult Wind Dragon",
			size: "Huge", type: "Dragon",
			ac: 19, hp: 237, init: 4, cr: 17,
			alignment: alignments.cn,
			legendary: true, 
			lair: true, 
			id: "654e6a8e-ffdf-4f4c-9eaa-5ced89556dc3",
		},
		{
			section: "Dragons", name: "Young Wind Dragon",
			size: "Large", type: "Dragon",
			ac: 17, hp: 150, init: 4, cr: 6,
			alignment: alignments.cn,
			id: "d70e8de5-8d09-4a58-a3b6-b41f64cddb5b",
		},
		{
			section: "Dragons", name: "Wind Dragon Wyrmling",
			size: "Medium", type: "Dragon",
			ac: 14, hp: 45, init: 4, cr: 1,
			alignment: alignments.cn,
			id: "3810e7f1-c595-4e0b-910e-4bc644a42c47",
		},
		{
			name: "Dragon Eel",
			size: "Huge", type: "Dragon",
			ac: 18, hp: 230, init: 1, cr: 12,
			alignment: alignments.n,
			id: "75ef5141-52cd-4613-a607-8a9959900940",
		},
		{
			name: "Dragonleaf Tree",
			size: "Large", type: "Plant",
			ac: 16, hp: 152, init: 0, cr: 8,
			alignment: alignments.unaligned,
			id: "1c6b62a3-1101-4dd6-999b-3343d54f264f",
		},
		{
			name: "Alehouse Drake",
			size: "Tiny", type: "Dragon",
			ac: 13, hp: 65, init: 3, cr: "1/2",
			alignment: alignments.cn,
			id: "9dcf1a47-aeca-4fa1-b998-ef708761952d",
		},
		{
			name: "Ash Drake",
			size: "Small", type: "Dragon",
			ac: 16, hp: 117, init: 2, cr: 4,
			alignment: alignments.ne,
			id: "cc506bd5-3b36-49d7-8b21-37d663cfad08",
		},
		{
			name: "Coral Drake",
			size: "Medium", type: "Dragon",
			ac: 16, hp: 127, init: 3, cr: 7,
			alignment: alignments.ne,
			id: "401ae8c3-edcb-4906-a9df-acbc204106fa",
		},
		{
			name: "Crimson Drake",
			size: "Tiny", type: "Dragon",
			ac: 14, hp: 54, init: 2, cr: 1,
			alignment: alignments.ce,
			id: "2a77207b-389f-4b54-a22d-821e367a25c7",
		},
		{
			name: "Deep Drake",
			size: "Large", type: "Dragon",
			ac: 17, hp: 150, init: 4, cr: 9,
			alignment: alignments.ce,
			id: "9594c378-0403-4772-9b5b-f3d070bc7640",
		},
		{
			name: "Elder Shadow Drake",
			size: "Large", type: "Dragon",
			ac: 16, hp: 114, init: 1, cr: 7,
			alignment: alignments.ce,
			id: "19ffeed1-fdb3-4f41-921a-b5210336fc13",
		},
		{
			name: "Paper Drake",
			size: "Small", type: "Dragon",
			ac: 13, hp: 78, init: 3, cr: 2,
			alignment: alignments.n,
			id: "d4869e67-414e-48ac-af84-e0749fbc0620",
		},
		{
			name: "Rust Drake",
			size: "Medium", type: "Dragon",
			ac: 17, hp: 161, init: 2, cr: 8,
			alignment: alignments.ce,
			id: "8b7fad59-5da7-48bc-b59e-488ac96ad53e",
		},
		{
			name: "Star Drake",
			size: "Large", type: "Dragon",
			ac: 19, hp: 189, init: 3, cr: 15,
			alignment: alignments.n,
			legendary: true, 
			id: "b79c129f-19b4-48f4-ac7c-9fa2419244f9",
		},
		{
			name: "Drakon",
			size: "Large", type: "Beast",
			ac: 16, hp: 105, init: 4, cr: 5,
			alignment: alignments.unaligned,
			id: "b8a31b8a-d11d-4e27-a34d-b576b27f640c",
		},
		{
			name: "Dream Eater",
			size: "Medium", type: "Fiend",
			ac: 15, hp: 75, init: 4, cr: 5,
			alignment: alignments.le,
			id: "c23f0728-6994-4cc7-971e-4b5602a486c1",
		},
		{
			name: "Drowned Maiden",
			size: "Medium", type: "Undead",
			ac: 15, hp: 90, init: 3, cr: 5,
			alignment: alignments.ne,
			id: "ed9f2396-2262-41ef-ae8c-3345b2cc33ee",
		},
		{
			name: "Duskthorn Dryad",
			size: "Medium", type: "Fey",
			ac: 17, hp: 77, init: 5, cr: 3,
			alignment: alignments.any_chaotic,
			id: "066cca78-8b42-4915-8a64-b7e267038291",
		},
		{
			name: "Dullahan",
			size: "Large", type: "Fey",
			ac: 17, hp: 178, init: 4, cr: 11,
			alignment: alignments.le,
			id: "9ef3a0d8-e22b-4762-b00c-e9ebe0058d65",
		},
		{
			name: "Dune Mimic",
			size: "Huge", type: "Monstrosity", tags: [ "Shapechanger" ], 
			ac: 13, hp: 168, init: -1, cr: 8,
			alignment: alignments.n,
			id: "55e6009c-cff8-4d2c-8501-d7cd3baf3134",
		},
		{
			name: "Eala",
			size: "Small", type: "Monstrosity",
			ac: 15, hp: 40, init: 3, cr: 2,
			alignment: alignments.unaligned,
			id: "7ab3b1d5-191a-4ace-8260-1a9f21d09731",
		},
		{
			name: "Eater of Dust (Yakat-Shi)",
			size: "Medium", type: "Aberration",
			ac: 17, hp: 114, init: 2, cr: 9,
			alignment: alignments.ne,
			id: "f10694f0-7524-4c57-8c58-460311054173",
		},
		{
			name: "Edimmu",
			size: "Medium", type: "Undead",
			ac: 15, hp: 75, init: 4, cr: 4,
			alignment: alignments.ce,
			id: "92fac7ff-874d-44fb-88d8-40fc9da7aeaa",
		},
		{
			name: "Eel Hound",
			size: "Medium", type: "Fey",
			ac: 14, hp: 77, init: 3, cr: 2,
			alignment: alignments.n,
			id: "803be8be-eeba-4268-b744-3241121b18bf",
		},
		{
			name: "Einherjar",
			size: "Medium", type: "Humanoid", tags: [ "Extraplanar" ], 
			ac: 18, hp: 119, init: 3, cr: 7,
			alignment: alignments.cn,
			id: "0dc2c9fd-f27f-498d-8a62-170affe57912",
		},
		{
			name: "Eleinomae",
			size: "Medium", type: "Fey",
			ac: 18, hp: 112, init: 4, cr: 5,
			alignment: alignments.ce,
			id: "b1da3df9-d072-4065-9b72-7618b1fdd63e",
		},
		{
			name: "Elemental Locus",
			size: "Gargantuan", type: "Elemental",
			ac: 16, hp: 290, init: -5, cr: 17,
			alignment: alignments.n,
			id: "fa9f893b-ee78-4c5c-86f6-b81b8b6da480",
		},
		{
			section: "Shadow Fey", name: "Shadow Fey",
			size: "Medium", type: "Humanoid", tags: [ "Elf" ], 
			ac: 15, hp: 31, init: 2, cr: "1/4",
			alignment: alignments.le,
			id: "92373a97-adcc-4f8b-bf0a-85a27b579622",
		},
		{
			section: "Shadow Fey", name: "Duelist",
			size: "Medium", type: "Humanoid", tags: [ "Elf" ], 
			ac: 17, hp: 117, init: 5, cr: 6,
			alignment: alignments.le,
			id: "63c3f89d-8e30-4fc2-8379-3710aa667ef2",
		},
		{
			section: "Shadow Fey", name: "Enchantress",
			size: "Medium", type: "Humanoid", tags: [ "Elf" ], 
			ac: 16, hp: 123, init: 2, cr: 7,
			alignment: alignments.le,
			id: "09284d2c-0858-4068-9c14-8f0dbf1b9e64",
		},
		{
			section: "Shadow Fey", name: "Forest Hunter",
			size: "Medium", type: "Humanoid", tags: [ "Elf" ], 
			ac: 15, hp: 104, init: 4, cr: 5,
			alignment: alignments.le,
			id: "a306eb36-72ce-42c8-9fcf-37e08f7c5449",
		},
		{
			section: "Shadow Fey", name: "Guardian",
			size: "Large", type: "Humanoid", tags: [ "Elf" ], 
			ac: 15, hp: 110, init: 2, cr: 4,
			alignment: alignments.ne,
			id: "c8e4e372-cc37-4f27-a022-4bec53e42f86",
		},
		{
			name: "Emerald Eye",
			size: "Tiny", type: "Construct",
			ac: 14, hp: 54, init: 2, cr: 1,
			alignment: alignments.ce,
			id: "14030ab3-bd1e-4c69-8818-5364f467512b",
		},
		{
			name: "Empty Cloak",
			size: "Medium", type: "Construct",
			ac: 13, hp: 45, init: 2, cr: "1/2",
			alignment: alignments.unaligned,
			id: "38b543df-57e6-4ace-b87a-3ec5e7c91c5f",
		},
		{
			name: "Eonic Drifter",
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 13, hp: 65, init: 2, cr: 1,
			alignment: alignments.ne,
			id: "416dfb18-57cd-4ac0-b998-d41e07fb8be5",
		},
		{
			name: "Erina Scrounger",
			size: "Small", type: "Humanoid", tags: [ "Erina" ], 
			ac: 12, hp: 22, init: 1, cr: "1/4",
			alignment: alignments.n,
			id: "e339ccf0-fe7e-4d51-b475-887daee0cfc2",
		},
		{
			name: "Erina Defender",
			size: "Small", type: "Humanoid", tags: [ "Erina" ], 
			ac: 15, hp: 44, init: 2, cr: 1,
			alignment: alignments.n,
			id: "633a9e5a-2793-466f-88dd-db7cc8d6ef8e",
		},
		{
			name: "Far Darrig",
			size: "Small", type: "Fey",
			ac: 14, hp: 104, init: 3, cr: 3,
			alignment: alignments.n,
			id: "6a4bee2e-adab-4628-891c-31bc997057e8",
		},
		{
			name: "Fate Eater",
			size: "Medium", type: "Aberration",
			ac: 16, hp: 182, init: 1, cr: 6,
			alignment: alignments.n,
			id: "25dd1d23-f7bb-429d-af3a-7b495cf629b6",
		},
		{
			name: "Fear Smith (Fiarsídhe)",
			size: "Medium", type: "Fey",
			ac: 17, hp: 123, init: 3, cr: 10,
			alignment: alignments.cn,
			id: "dc2b965d-9806-4d19-8d6c-7f93e97d52f7",
		},
		{
			name: "Fellforged",
			size: "Medium", type: "Construct",
			ac: 15, hp: 135, init: 1, cr: 5,
			alignment: alignments.le,
			id: "f85b099e-aa81-4c1d-a348-fadb42c0cf1f",
		},
		{
			name: "Fext",
			size: "Medium", type: "Undead",
			ac: 17, hp: 60, init: 3, cr: 6,
			alignment: alignments.any,
			id: "48d45583-8e9f-44cd-9111-d42d8ba9db77",
		},
		{
			section: "Fey Lords and Ladies", name: "Bear King",
			size: "Medium", type: "Fey", tags: [ "Shapechanger" ], unique: true, 
			ac: 18, hp: 133, init: 0, cr: 12,
			alignment: alignments.ln,
			legendary: true, 
			lair: true, 
			id: "f5c3f40a-d646-4ea4-b3f0-b0e7330ac189",
		},
		{
			section: "Fey Lords and Ladies", name: "Lord of the Hunt",
			size: "Medium", type: "Fey", unique: true, 
			ac: 18, hp: 229, init: 4, cr: 18,
			alignment: alignments.ln,
			legendary: true, 
			lair: true, 
			id: "003f9549-a03a-4a79-9c1c-67ff59f3a10d",
		},
		{
			section: "Fey Lords and Ladies", name: "Moonlit King",
			size: "Medium", type: "Fey", unique: true, 
			ac: 17, hp: 170, init: 5, cr: 17,
			alignment: alignments.ng,
			legendary: true, 
			lair: true, 
			id: "225d53b7-e40b-4342-9b71-912181571ad3",
		},
		{
			section: "Fey Lords and Ladies", name: "Sarastra, Queen of Night and Magic",
			size: "Medium", type: "Fey", unique: true, 
			ac: 15, hp: 180, init: 5, cr: 21,
			alignment: alignments.ne,
			legendary: true, 
			lair: true, 
			id: "d21f72c3-71d4-4837-98d7-8318c1c19d39",
		},
		{
			section: "Fey Lords and Ladies", name: "Nicnevin, Queen of Witches",
			size: "Medium", type: "Fey", unique: true, 
			ac: 18, hp: 123, init: 0, cr: 17,
			alignment: alignments.n,
			legendary: true, 
			lair: true, 
			id: "a79f7bc9-1738-41d7-8ef6-445fe0d611b1",
		},
		{
			section: "Fey Lords and Ladies", name: "River King",
			size: "Medium", type: "Fey", unique: true, 
			ac: 18, hp: 152, init: 3, cr: 16,
			alignment: alignments.cn,
			legendary: true, 
			lair: true, 
			id: "a7844f48-dad1-4b9e-9b32-3fb71531b4a0",
		},
		{
			section: "Fey Lords and Ladies", name: "Snow Queen",
			size: "Medium", type: "Fey", unique: true, 
			ac: 17, hp: 123, init: 4, cr: 16,
			alignment: alignments.ne,
			legendary: true, 
			lair: true, 
			id: "cf64275d-3f5c-4645-a30e-46b6084bc2f9",
		},
		{
			name: "Feyward Tree",
			size: "Huge", type: "Construct",
			ac: 17, hp: 94, init: 0, cr: 8,
			alignment: alignments.unaligned,
			id: "ca404e71-3c35-4ab8-b178-1caaede06b96",
		},
		{
			name: "Firebird",
			size: "Small", type: "Celestial",
			ac: 16, hp: 99, init: 4, cr: 4,
			alignment: alignments.ng,
			id: "efbc9c05-e8ec-4bee-8ead-84b9e733ac7e",
		},
		{
			name: "Firegeist",
			size: "Small", type: "Elemental",
			ac: 14, hp: 87, init: 4, cr: 2,
			alignment: alignments.ne,
			id: "e2de0148-1043-4af9-91dc-856deed95fb3",
		},
		{
			name: "Flutterflesh",
			size: "Large", type: "Undead",
			ac: 16, hp: 187, init: 4, cr: 12,
			alignment: alignments.ce,
			id: "d856a88f-7b06-4ff0-b825-b130c108052e",
		},
		{
			name: "Folk of Leng",
			size: "Medium", type: "Humanoid",
			ac: 14, hp: 68, init: 2, cr: 2,
			alignment: alignments.ne,
			id: "88408152-a902-4d52-bfc0-14c28ffdb451",
		},
		{
			name: "Forest Marauder",
			size: "Large", type: "Giant",
			ac: 15, hp: 114, init: 0, cr: 4,
			alignment: alignments.ce,
			id: "9135b2db-4372-41c2-9048-d6052aae9967",
		},
		{
			name: "Fraughashar",
			size: "Small", type: "Fey",
			ac: 15, hp: 18, init: 2, cr: "1/2",
			alignment: alignments.ne,
			id: "b79ee777-7b7f-4cf1-9d03-a495ebcaf8d5",
		},
		{
			name: "Frostveil",
			size: "Medium", type: "Plant",
			ac: 16, hp: 67, init: 5, cr: 4,
			alignment: alignments.unaligned,
			id: "5148765a-00fd-4c12-8b54-2223384dda5e",
		},
		{
			name: "Garroter Crab",
			size: "Tiny", type: "Beast",
			ac: 13, hp: 18, init: 2, cr: "1/4",
			alignment: alignments.unaligned,
			id: "7690e783-f332-4322-95fd-11883a6a5c9e",
		},
		{
			name: "Gbahali",
			size: "Huge", type: "Beast",
			ac: 15, hp: 126, init: 2, cr: 6,
			alignment: alignments.unaligned,
			id: "1386b5e8-2319-425a-b56e-5f06708d56a2",
		},
		{
			name: "Gearforged Templar",
			size: "Medium", type: "Humanoid", tags: [ "Gearforged" ], 
			ac: 18, hp: 71, init: -1, cr: 6,
			alignment: alignments.ln,
			id: "21d6deb9-1187-4314-a6b0-bd44431b3571",
		},
		{
			section: "Genies", name: "Al-Aeshma",
			size: "Large", type: "Elemental",
			ac: 17, hp: 172, init: 2, cr: 9,
			alignment: alignments.ce,
			id: "435835c6-f0b4-4d77-a235-c14f51f5b34b",
		},
		{
			name: "Gerridae",
			size: "Large", type: "Fey",
			ac: 14, hp: 77, init: 2, cr: 1,
			alignment: alignments.n,
			id: "9cb17598-90df-4509-adbf-850d667d8a20",
		},
		{
			section: "Ghouls", name: "Beggar Ghoul",
			size: "Medium", type: "Undead",
			ac: 12, hp: 13, init: 2, cr: "1/2",
			alignment: alignments.ce,
			id: "64722438-83d8-4323-ab65-a72eb2c28b8f",
		},
		{
			section: "Ghouls", name: "Bonepowder Ghoul",
			size: "Small", type: "Undead",
			ac: 18, hp: 195, init: 5, cr: 12,
			alignment: alignments.ne,
			id: "996fbcb6-dabd-4971-a5f9-6486169578a8",
		},
		{
			section: "Ghouls", name: "Darakhul",
			size: "Medium", type: "Undead",
			ac: 16, hp: 78, init: 3, cr: 3,
			alignment: alignments.ne,
			id: "df165796-ec47-44f5-82ef-f7826ea7558f",
		},
		{
			section: "Ghouls", name: "Emperor of the Ghouls",
			size: "Medium", type: "Undead", unique: true, 
			ac: 20, hp: 204, init: 2, cr: 20,
			alignment: alignments.ne,
			legendary: true, 
			lair: true, 
			id: "51d1bec6-f450-47ac-b272-490908ac946c",
		},
		{
			section: "Ghouls", name: "Imperial Ghoul",
			size: "Medium", type: "Undead",
			ac: 16, hp: 93, init: 2, cr: 4,
			alignment: alignments.le,
			id: "98e4f5bf-1ce6-4ef1-ae2f-5453ec4d226e",
		},
		{
			section: "Ghouls", name: "Iron Ghoul",
			size: "Medium", type: "Undead",
			ac: 16, hp: 143, init: 3, cr: 5,
			alignment: alignments.le,
			id: "754c4f9f-0e40-44b1-a224-2c139eb4c87b",
		},
		{
			section: "Giants", name: "Desert Giant",
			size: "Huge", type: "Giant",
			ac: 17, hp: 175, init: 0, cr: 9,
			alignment: alignments.n,
			id: "619e4252-154d-4145-9114-1bb6bec06cb1",
		},
		{
			section: "Giants", name: "Flab Giant",
			size: "Large", type: "Giant",
			ac: 14, hp: 110, init: -2, cr: 4,
			alignment: alignments.ce,
			id: "749c0d19-9a3d-4630-abfb-67b38ebdeb95",
		},
		{
			section: "Giants", name: "Hraesvelgr the Corpse Swallower",
			size: "Huge", type: "Giant", tags: [ "Shapechanger", "Titan" ], unique: true, 
			ac: 19, hp: 241, init: 0, cr: 19,
			alignment: alignments.n,
			legendary: true, 
			lair: true, 
			id: "fd1aeb7c-b900-4902-9877-eab76d043ad1",
		},
		{
			section: "Giants", name: "Jotun Giant",
			size: "Gargantuan", type: "Giant",
			ac: 20, hp: 407, init: -1, cr: 22,
			alignment: alignments.cn,
			legendary: true, 
			id: "3f00395a-2553-4637-9173-2f0f88328dc7",
		},
		{
			section: "Giants", name: "Thursir Giant",
			size: "Large", type: "Giant",
			ac: 13, hp: 114, init: 0, cr: 3,
			alignment: alignments.ne_le,
			id: "3fd0b2fa-1278-4a49-a747-42070b79f484",
		},
		{
			name: "Glass Gator",
			size: "Large", type: "Beast",
			ac: 15, hp: 45, init: 2, cr: 1,
			alignment: alignments.unaligned,
			id: "6a8a0e0e-b21d-41fe-b22b-21c3d684e54c",
		},
		{
			name: "Gnarljak",
			size: "Small", type: "Construct",
			ac: 16, hp: 63, init: 6, cr: 6,
			alignment: alignments.unaligned,
			id: "95b73cb9-41af-4f89-adac-e439519edf95",
		},
		{
			name: "Gnoll Havoc Runner",
			size: "Large", type: "Humanoid", tags: [ "Gnolls" ], 
			ac: 15, hp: 58, init: 2, cr: 3,
			alignment: alignments.ce,
			id: "298c17d7-4cbb-44ce-a568-7baffd4c4fd9",
		},
		{
			name: "Goat-Man",
			size: "Medium", type: "Monstrosity",
			ac: 14, hp: 65, init: 2, cr: 3,
			alignment: alignments.ce,
			id: "4b33b198-5433-4bbe-98bf-0dafd08849e9",
		},
		{
			name: "Dust Goblin",
			size: "Small", type: "Humanoid", tags: [ "Goblinoid" ], 
			ac: 14, hp: 5, init: 3, cr: "1/4",
			alignment: alignments.ne,
			id: "b1f85c31-e2a1-4f3e-bb85-3aab8d35c838",
		},
		{
			section: "Golems", name: "Eye Golem",
			size: "Large", type: "Construct",
			ac: 20, hp: 157, init: -1, cr: 11,
			alignment: alignments.unaligned,
			id: "fa41ee99-97f3-4a5c-b7d0-1344c1a239db",
		},
		{
			section: "Golems", name: "Hoard Golem",
			size: "Huge", type: "Construct",
			ac: 18, hp: 161, init: 2, cr: 12,
			alignment: alignments.unaligned,
			id: "813f82e7-2f01-499b-83a1-f1a3b098c111",
		},
		{
			section: "Golems", name: "Salt Golem",
			size: "Large", type: "Construct",
			ac: 17, hp: 110, init: -1, cr: 10,
			alignment: alignments.unaligned,
			id: "d2472029-19f6-41cb-9c64-fd390e502113",
		},
		{
			section: "Golems", name: "Smaragdine Golem",
			size: "Large", type: "Construct",
			ac: 17, hp: 231, init: 0, cr: 14,
			alignment: alignments.unaligned,
			id: "a49d09bc-994b-4dac-b74b-7af6d15d1474",
		},
		{
			section: "Golems", name: "Steam Golem",
			size: "Large", type: "Construct",
			ac: 18, hp: 171, init: 1, cr: 13,
			alignment: alignments.unaligned,
			id: "0a801471-c25f-475e-859c-88469cb65c7d",
		},
		{
			name: "Gray Thirster",
			size: "Medium", type: "Undead",
			ac: 13, hp: 39, init: 3, cr: 2,
			alignment: alignments.ne,
			id: "0f8f4f7b-163b-41cd-84c4-de8795eecda1",
		},
		{
			name: "Rum Gremlin",
			size: "Tiny", type: "Fey",
			ac: 13, hp: 22, init: 3, cr: "1/2",
			alignment: alignments.ce,
			id: "be0ec63c-9581-4b68-9fa1-be740b08f25c",
		},
		{
			name: "Grim Jester",
			size: "Medium", type: "Undead",
			ac: 18, hp: 136, init: 6, cr: 11,
			alignment: alignments.ce,
			id: "300e4c5c-cb8a-421e-9a10-08fa915a91c9",
		},
		{
			name: "Gug",
			size: "Huge", type: "Giant",
			ac: 17, hp: 270, init: 0, cr: 12,
			alignment: alignments.ne,
			id: "d41959b5-0ffa-4f62-a5f3-6b79771b7c83",
		},
		{
			section: "Hags", name: "Blood Hag",
			size: "Medium", type: "Fey",
			ac: 16, hp: 178, init: 3, cr: 11,
			alignment: alignments.ce,
			id: "4e484541-a397-48ef-a75d-42b63cdebf39",
		},
		{
			section: "Hags", name: "Mirror Hag",
			size: "Medium", type: "Fey",
			ac: 16, hp: 168, init: 3, cr: 6,
			alignment: alignments.cn,
			id: "3e3e00ea-f3df-4983-85e6-6bc98f9e7718",
		},
		{
			section: "Hags", name: "Red Hag",
			size: "Medium", type: "Fey",
			ac: 15, hp: 119, init: 3, cr: 7,
			alignment: alignments.ne,
			id: "e9a2b266-b2ef-44a4-b743-30d9a590738d",
		},
		{
			section: "Hags", name: "Sand Hag",
			size: "Medium", type: "Monstrosity",
			ac: 17, hp: 112, init: 2, cr: 5,
			alignment: alignments.ce,
			id: "e39d2eb8-0484-4ca5-8edd-9567d74ecdf2",
		},
		{
			name: "Owl Harpy",
			size: "Medium", type: "Monstrosity",
			ac: 14, hp: 112, init: 3, cr: 5,
			alignment: alignments.ne,
			id: "a59e74b9-67f1-4253-baee-dce393e1ad08",
		},
		{
			name: "Haugbui",
			size: "Medium", type: "Undead",
			ac: 18, hp: 136, init: 3, cr: 13,
			alignment: alignments.ln,
			id: "6d0f8e4d-41a7-42c4-87b8-d04c6f7c0f07",
		},
		{
			name: "Herald of Blood",
			size: "Huge", type: "Fiend",
			ac: 15, hp: 115, init: 1, cr: 12,
			alignment: alignments.ne,
			legendary: true, 
			id: "f0f0f99f-1932-46fc-8f27-21b27c89ba8c",
		},
		{
			name: "Herald of Darkness",
			size: "Large", type: "Fiend",
			ac: 15, hp: 105, init: 2, cr: 7,
			alignment: alignments.ne,
			id: "c12988ad-2cfa-4ba8-bc89-04601b2c697c",
		},
		{
			name: "Horakh",
			size: "Medium", type: "Monstrosity",
			ac: 17, hp: 161, init: 4, cr: 9,
			alignment: alignments.n,
			id: "24b25746-878f-460c-b818-75dc293e3014",
		},
		{
			name: "Hound of the Night",
			size: "Large", type: "Monstrosity",
			ac: 16, hp: 112, init: 3, cr: 5,
			alignment: alignments.unaligned,
			id: "e1114e9f-be10-4e5b-9532-592b0fe06912",
		},
		{
			name: "Hulking Whelp",
			size: "Small", type: "Fey", tags: [ "Shapechanger" ], 
			ac: 15, hp: 94, init: 0, cr: 5,
			alignment: alignments.cn,
			id: "b6bfda21-3254-4c0d-95f9-0ada9553914b",
		},
		{
			name: "Hundun",
			size: "Large", type: "Celestial",
			ac: 18, hp: 153, init: 1, cr: 10,
			alignment: alignments.cg,
			id: "1e62b94c-bbf7-4c76-bc01-c251728e90dc",
		},
		{
			name: "Ice Maiden",
			size: "Medium", type: "Fey",
			ac: 16, hp: 84, init: 3, cr: 6,
			alignment: alignments.le,
			id: "0318f819-bc9e-446e-9832-23f1af88a506",
		},
		{
			name: "Idolic Deity",
			size: "Small", type: "Construct",
			ac: 17, hp: 90, init: 5, cr: 8,
			alignment: alignments.ne,
			id: "0005d604-f4c1-4818-8baf-0d773669da9d",
		},
		{
			name: "Imy-ut Ushabti",
			size: "Medium", type: "Monstrosity",
			ac: 15, hp: 97, init: 2, cr: 3,
			alignment: alignments.n,
			id: "e5539c30-b567-4a2a-81b6-6b732c5950b0",
		},
		{
			name: "Isonade",
			size: "Gargantuan", type: "Monstrosity",
			ac: 18, hp: 222, init: 2, cr: 14,
			alignment: alignments.cn,
			id: "db9b059c-c217-4db2-9d79-727e22521346",
		},
		{
			name: "Jaculus",
			size: "Small", type: "Dragon",
			ac: 18, hp: 65, init: 4, cr: 3,
			alignment: alignments.ne,
			id: "fc0960cb-0825-45b6-9d50-7a4b848166db",
		},
		{
			name: "Kalke",
			size: "Small", type: "Fiend",
			ac: 14, hp: 9, init: 3, cr: "1/4",
			alignment: alignments.ne,
			id: "830b7368-6df3-440c-a012-658e652f3c5d",
		},
		{
			name: "Kikimora",
			size: "Medium", type: "Fey",
			ac: 15, hp: 65, init: 4, cr: 5,
			alignment: alignments.cn,
			id: "ab55775c-a713-44b4-a339-1862db2399f7",
		},
		{
			section: "Kobolds", name: "Kobold Alchemist",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ], 
			ac: 15, hp: 44, init: 3, cr: 2,
			alignment: alignments.ln,
			id: "f954aa0d-b8a1-4df4-966e-07708d9c62bb",
		},
		{
			section: "Kobolds", name: "Kobold Chieftain",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ], 
			ac: 17, hp: 82, init: 3, cr: 4,
			alignment: alignments.le,
			id: "221ee346-3107-4c96-a805-6fb37afcf7c2",
		},
		{
			section: "Kobolds", name: "Kobold Trapsmith",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ], 
			ac: 14, hp: 36, init: 3, cr: 1,
			alignment: alignments.ln,
			id: "9bcf7aaa-46b2-4c38-b8fe-6b5a6fd1be5d",
		},
		{
			name: "Kongamato",
			size: "Large", type: "Beast",
			ac: 16, hp: 112, init: 4, cr: 5,
			alignment: alignments.unaligned,
			id: "ead59ca0-f8a4-48b5-9c05-f5f2d0bbbf72",
		},
		{
			name: "Koschei",
			size: "Medium", type: "Fiend", unique: true,
			ac: 18, hp: 135, init: 1, cr: 17,
			alignment: alignments.ne,
			legendary: true,
			lair: true, 
			id: "68df8dde-ed1e-4eb5-8342-85581b863860",
		},
		{
			name: "Kot Bayun",
			size: "Medium", type: "Monstrosity",
			ac: 15, hp: 44, init: 3, cr: 2,
			alignment: alignments.n,
			id: "70464573-6341-466e-a1a2-0d1e16ee3cac",
		},
		{
			name: "Krake Spawn",
			size: "Huge", type: "Monstrosity",
			ac: 16, hp: 150, init: 1, cr: 9,
			alignment: alignments.ne,
			id: "1137b654-dc13-41b4-a965-0c84d47e2129",
		},
		{
			name: "Lantern Dragonette",
			size: "Tiny", type: "Dragon",
			ac: 13, hp: 28, init: 1, cr: "1/2",
			alignment: alignments.ln,
			id: "864c7316-05b4-47c8-bbd6-2fdf7a73f7ba",
		},
		{
			section: "Lemurfolk (Kaguani)", name: "Lemurfolk",
			size: "Small", type: "Humanoid", tags: [ "Lemurfolk" ], 
			ac: 13, hp: 14, init: 2, cr: "1/4",
			alignment: alignments.n,
			id: "ce982410-eda8-4b2a-a592-9d5258ed84b6",
		},
		{
			section: "Lemurfolk (Kaguani)", name: "Lemurfolk Greyfur",
			size: "Small", type: "Humanoid", tags: [ "Lemurfolk" ], 
			ac: 13, hp: 67, init: 3, cr: 4,
			alignment: alignments.n,
			id: "c71df1a8-4823-4c63-84cf-c003519c22b5",
		},
		{
			name: "Leshy",
			size: "Medium", type: "Monstrosity",
			ac: 14, hp: 84, init: 1, cr: 1,
			alignment: alignments.cn,
			id: "dccfe297-282f-400d-94b3-2e2cd3d30ea1",
		},
		{
			name: "Library Automaton",
			size: "Small", type: "Construct",
			ac: 13, hp: 7, init: 1, cr: "1/2",
			alignment: alignments.ln,
			id: "4db5e660-2911-4985-9b82-4110b28fcd3e",
		},
		{
			name: "Lich Hound",
			size: "Medium", type: "Undead",
			ac: 14, hp: 119, init: 4, cr: 4,
			alignment: alignments.ne,
			id: "07a48219-8dfe-46f0-8e1f-38bcdee8d8e2",
		},
		{
			name: "Likho",
			size: "Medium", type: "Monstrosity",
			ac: 15, hp: 90, init: 4, cr: 6,
			alignment: alignments.ce,
			id: "ec12f4b4-f1c8-4f2c-ba67-fcea3f854fab",
		},
		{
			name: "Lindwurm",
			size: "Large", type: "Dragon",
			ac: 15, hp: 136, init: 5, cr: 5,
			alignment: alignments.ne,
			id: "082e911f-3b02-4d58-bd46-9edbc57ac6f1",
		},
		{
			name: "Liosalfar",
			size: "Large", type: "Elemental",
			ac: 17, hp: 110, init: 7, cr: 8,
			alignment: alignments.n,
			id: "4611c643-2e59-47aa-95fc-bbbea10e9857",
		},
		{
			name: "Living Wick",
			size: "Small", type: "Construct",
			ac: 13, hp: 28, init: 0, cr: "1/4",
			alignment: alignments.unaligned,
			id: "e5c0ec0a-dda9-4bb4-a610-f3f042101520",
		},
		{
			name: "Lorelei",
			size: "Medium", type: "Fey",
			ac: 15, hp: 76, init: 5, cr: 5,
			alignment: alignments.ce,
			id: "4e9797ff-3f6f-44fa-b457-62bca4e86793",
		},
		{
			name: "Loxoda",
			size: "Huge", type: "Monstrosity",
			ac: 13, hp: 147, init: 1, cr: 6,
			alignment: alignments.ne,
			id: "8af19666-35bd-453c-8eb3-adc8c9d79cd4",
		},
		{
			name: "Mahoru",
			size: "Large", type: "Monstrosity",
			ac: 15, hp: 91, init: 4, cr: 3,
			alignment: alignments.unaligned,
			id: "188416a0-926d-4431-bae2-cd910ca69f8a",
		},
		{
			name: "Mallqui",
			size: "Medium", type: "Undead",
			ac: 14, hp: 120, init: -1, cr: 8,
			alignment: alignments.ln,
			id: "14c1e073-609c-49a6-8e83-2a699a28a1cf",
		},
		{
			name: "Malphas",
			size: "Medium", type: "Fey",
			ac: 16, hp: 120, init: 4, cr: 6,
			alignment: alignments.ne,
			id: "761f8822-cac0-4cbf-b2e5-9c17e94bfed2",
		},
		{
			name: "Mamura",
			size: "Small", type: "Aberration", tags: [ "Fey" ], 
			ac: 16, hp: 97, init: 4, cr: 6,
			alignment: alignments.ne,
			id: "225e09ef-58e7-4dc8-a970-6a392f015332",
		},
		{
			name: "Mask Wight",
			size: "Medium", type: "Undead",
			ac: 19, hp: 207, init: 4, cr: 13,
			alignment: alignments.ne,
			id: "d8d600f1-018c-47cc-b892-f3bbf1c59f0c",
		},
		{
			name: "Mavka",
			size: "Medium", type: "Undead", tags: [ "Fey" ], 
			ac: 17, hp: 170, init: 2, cr: 12,
			alignment: alignments.ce,
			id: "31defc11-6717-4609-89aa-1ff48e31aa07",
		},
		{
			name: "Mi-Go",
			size: "Medium", type: "Plant",
			ac: 17, hp: 76, init: 4, cr: 5,
			alignment: alignments.ne,
			id: "894f78a1-c43d-44ac-9720-a2fc661d170e",
		},
		{
			name: "Millitaur",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 85, init: 2, cr: 3,
			alignment: alignments.n,
			id: "f74a8a6c-71c0-42b3-9595-432e9e437d1a",
		},
		{
			name: "Map Mimic",
			size: "Tiny", type: "Aberration",
			ac: 14, hp: 32, init: 2, cr: "1/4",
			alignment: alignments.n,
			id: "e07a7d74-0cf0-4daa-827b-5c9b93d7982e",
		},
		{
			name: "Mindrot Thrall",
			size: "Medium", type: "Plant",
			ac: 15, hp: 82, init: 2, cr: 3,
			alignment: alignments.n,
			id: "2a615acd-cae3-4c10-9cfc-e1b4fc20b872",
		},
		{
			name: "Mirager",
			size: "Medium", type: "Fey", tags: [ "Shapechanger" ], 
			ac: 13, hp: 78, init: 3, cr: 3,
			alignment: alignments.ne,
			id: "747b7cd2-7b7b-4151-8c7c-f99bf2ffbce7",
		},
		{
			name: "Miremal",
			size: "Small", type: "Fey",
			ac: 13, hp: 22, init: 3, cr: "1/2",
			alignment: alignments.ce,
			id: "414e421e-9e97-45cd-a4f2-4b758194a89e",
		},
		{
			name: "Mngwa",
			size: "Medium", type: "Aberration",
			ac: 16, hp: 91, init: 3, cr: 4,
			alignment: alignments.ne,
			id: "e047b224-e15c-49d3-960c-d17cac10d792",
		},
		{
			name: "Monolith Champion",
			size: "Large", type: "Construct",
			ac: 17, hp: 102, init: 1, cr: 8,
			alignment: alignments.unaligned,
			id: "90f94b43-4214-4cb2-973a-eef90bd08efa",
		},
		{
			name: "Monolith Footman",
			size: "Large", type: "Construct",
			ac: 14, hp: 60, init: 1, cr: 3,
			alignment: alignments.unaligned,
			id: "251dc434-0130-4739-8f3c-d70a286cf60e",
		},
		{
			name: "Mordant Snare",
			size: "Gargantuan", type: "Aberration",
			ac: 18, hp: 264, init: 3, cr: 15,
			alignment: alignments.ce,
			id: "2170e25b-bdd5-4455-9c0a-29754201f6ff",
		},
		{
			name: "Morphoi",
			size: "Medium", type: "Plant",
			ac: 13, hp: 33, init: 3, cr: "1/2",
			alignment: alignments.ce,
			id: "14e6a85f-252c-463b-9dff-64f2f3af56e8",
		},
		{
			name: "Moss Lurker",
			size: "Small", type: "Humanoid",
			ac: 15, hp: 45, init: 2, cr: 1,
			alignment: alignments.cn,
			id: "47b9ae76-4f66-4eb2-8e3d-3e28706e3edb",
		},
		{
			name: "Venomous Mummy",
			size: "Medium", type: "Undead",
			ac: 11, hp: 58, init: -1, cr: 3,
			alignment: alignments.le,
			id: "e1118b50-8ff5-4fdf-9750-ce728151b720",
		},
		{
			name: "Deathcap Myconid",
			size: "Medium", type: "Plant",
			ac: 15, hp: 90, init: 0, cr: 4,
			alignment: alignments.ne,
			id: "59ebdf97-4b28-478d-a8ee-fd1de8082513",
		},
		{
			name: "Myling",
			size: "Small", type: "Undead",
			ac: 13, hp: 45, init: 0, cr: 2,
			alignment: alignments.ce,
			id: "b12d57c5-35b0-44f4-9ba1-03dd8c18ece1",
		},
		{
			name: "Naina",
			size: "Large", type: "Dragon", tags: [ "Shapechanger" ], 
			ac: 17, hp: 231, init: 3, cr: 11,
			alignment: alignments.le,
			id: "cf644cb4-c7fc-4bf4-8c89-524af9964b74",
		},
		{
			name: "Nichny",
			size: "Medium", type: "Fey",
			ac: 17, hp: 112, init: 4, cr: 6,
			alignment: alignments.ne,
			id: "b634ea34-d8e8-458b-af10-11054b1d45ee",
		},
		{
			name: "Nightgarm",
			size: "Large", type: "Monstrosity",
			ac: 15, hp: 114, init: 2, cr: 6,
			alignment: alignments.ce,
			id: "026f2ffe-e132-4d84-944b-5b49d0258e6b",
		},
		{
			section: "Nkosi", name: "Nkosi",
			size: "Medium", type: "Humanoid", tags: [ "Shapechanger", "Nkosi" ], 
			ac: 15, hp: 11, init: 3, cr: "1/2",
			alignment: alignments.ln,
			id: "051d50a2-3f42-45fa-863a-2bfbccf4830d",
		},
		{
			section: "Nkosi", name: "Nkosi Pridelord",
			size: "Medium", type: "Humanoid", tags: [ "Shapechanger", "Nkosi" ], 
			ac: 16, hp: 93, init: 4, cr: 4,
			alignment: alignments.ln,
			id: "9e26d2c0-9c1d-40ea-abc8-15d02f82ef23",
		},
		{
			name: "War Ostrich",
			size: "Large", type: "Beast",
			ac: 11, hp: 42, init: 1, cr: "1/2",
			alignment: alignments.unaligned,
			id: "c18ba461-0980-4422-8489-7f924139c02a",
		},
		{
			name: "Noctiny",
			size: "Medium", type: "Humanoid", tags: [ "Noctiny" ], 
			ac: 13, hp: 52, init: 1, cr: 2,
			alignment: alignments.ne,
			id: "280c4a39-f265-4b0d-8ac6-7d73087e439b",
		},
		{
			name: "Oculo Swarm",
			size: "Large", type: "Monstrosity", tags: [ "Swarm" ], 
			ac: 15, hp: 130, init: 5, cr: 4,
			alignment: alignments.ne,
			id: "e4d7c536-3bce-4eff-9e73-b6d31ad1bdc3",
		},
		{
			name: "Oozasis",
			size: "Gargantuan", type: "Ooze",
			ac: 7, hp: 217, init: -3, cr: 9,
			alignment: alignments.unaligned,
			id: "4b5f959b-f915-4f00-87c0-9dc9e0976189",
		},
		{
			name: "Corrupting Ooze",
			size: "Large", type: "Ooze",
			ac: 12, hp: 115, init: 0, cr: 5,
			alignment: alignments.ne,
			id: "a08589b8-7cdf-4c7b-9a9f-148ddad36d2e",
		},
		{
			name: "Ostinato",
			size: "Medium", type: "Aberration",
			ac: 15, hp: 39, init: 5, cr: 4,
			alignment: alignments.cn,
			id: "71569d53-5bd5-40b1-8d69-37d03260d9a5",
		},
		{
			name: "Pombero",
			size: "Medium", type: "Fey",
			ac: 15, hp: 90, init: 3, cr: 3,
			alignment: alignments.cn,
			id: "c9d1e16f-ce68-4df5-bc34-603a33ba81e9",
		},
		{
			name: "Possessed Pillar",
			size: "Large", type: "Construct",
			ac: 14, hp: 95, init: -1, cr: 7,
			alignment: alignments.unaligned,
			id: "2edb499b-9aae-465e-b3f0-4ccba8b54938",
		},
		{
			name: "Putrid Haunt",
			size: "Medium", type: "Undead",
			ac: 13, hp: 44, init: -1, cr: 2,
			alignment: alignments.ne,
			id: "8396d314-bd83-497d-a40e-b527dc3b3ff1",
		},
		{
			name: "Qwyllion",
			size: "Medium", type: "Aberration", tags: [ "Fey" ], 
			ac: 16, hp: 110, init: 5, cr: 8,
			alignment: alignments.ne,
			id: "16a43ae9-70b9-40ba-80e4-6da11826a160",
		},
		{
			name: "Ramag",
			size: "Medium", type: "Humanoid", tags: [ "Ramag" ], 
			ac: 13, hp: 27, init: 2, cr: "1/4",
			alignment: alignments.n,
			id: "33ab8a95-5381-49f4-973a-06540ab80d46",
		},
		{
			name: "Rat King",
			size: "Medium", type: "Monstrosity",
			ac: 14, hp: 76, init: 3, cr: 5,
			alignment: alignments.ce,
			id: "ae6afb0a-4199-4e0f-b46b-951951538b93",
		},
		{
			name: "Ratatosk",
			size: "Tiny", type: "Celestial",
			ac: 14, hp: 42, init: 4, cr: 4,
			alignment: alignments.cn,
			id: "6de079e0-aaa8-4940-9aa0-8f8c5d1e0e78",
		},
		{
			section: "Ratfolk", name: "Ratfolk",
			size: "Small", type: "Humanoid", tags: [ "Ratfolk" ], 
			ac: 14, hp: 7, init: 2, cr: "1/4",
			alignment: alignments.n,
			id: "2f6a702c-9382-4daa-88ed-014031c5d36e",
		},
		{
			section: "Ratfolk", name: "Ratfolk Rogue",
			size: "Small", type: "Humanoid", tags: [ "Ratfolk" ], 
			ac: 15, hp: 18, init: 3, cr: 1,
			alignment: alignments.n,
			id: "49a610c1-f691-4b3b-b0aa-7d90beaa2d72",
		},
		{
			name: "Ravenala",
			size: "Large", type: "Plant",
			ac: 15, hp: 126, init: 0, cr: 5,
			alignment: alignments.unaligned,
			id: "c8a9fb9f-eb7f-4d88-8fe8-c23fac4986d1",
		},
		{
			section: "Ravenfolk", name: "Ravenfolk Scout",
			size: "Medium", type: "Humanoid", tags: [ "Kenku" ], 
			ac: 14, hp: 21, init: 2, cr: "1/2",
			alignment: alignments.n,
			id: "83861d96-1f9e-49b1-a00d-831d8a8141fa",
		},
		{
			section: "Ravenfolk", name: "Ravenfolk Warrior",
			size: "Medium", type: "Humanoid", tags: [ "Kenku" ], 
			ac: 15, hp: 78, init: 3, cr: 3,
			alignment: alignments.n,
			id: "9ca540ef-6313-463f-98c7-e10ffae59b8a",
		},
		{
			section: "Ravenfolk", name: "Ravenfolk Doom Croaker",
			size: "Medium", type: "Humanoid", tags: [ "Kenku" ], 
			ac: 14, hp: 88, init: 2, cr: 5,
			alignment: alignments.n,
			id: "df853025-e1c2-4517-8ed6-efe3b8c84aa5",
		},
		{
			name: "Redcap",
			size: "Medium", type: "Fey",
			ac: 15, hp: 105, init: 0, cr: 6,
			alignment: alignments.ne,
			id: "0f23b109-7b2d-4843-8582-168af4412cf6",
		},
		{
			name: "Rift Swine",
			size: "Large", type: "Aberration",
			ac: 15, hp: 110, init: 0, cr: 5,
			alignment: alignments.cn,
			id: "3fffc7c5-f846-44e6-8eb2-04d1214a6fff",
		},
		{
			name: "Adult Rime Worm",
			size: "Large", type: "Elemental",
			ac: 15, hp: 105, init: 2, cr: 6,
			alignment: alignments.n,
			id: "3d8c76b6-2199-48bf-a552-e9121ba55236",
		},
		{
			name: "Rime Worm Grub",
			size: "Medium", type: "Elemental",
			ac: 13, hp: 45, init: 1, cr: 1,
			alignment: alignments.n,
			id: "fbd34b80-5496-4c69-93bb-e9535a60670d",
		},
		{
			name: "Risen Reaver",
			size: "Large", type: "Undead",
			ac: 15, hp: 168, init: 3, cr: 7,
			alignment: alignments.ce,
			id: "4e8047ac-0e28-41ef-af5b-c2869de687c1",
		},
		{
			section: "Roachling", name: "Roachling Skirmisher",
			size: "Small", type: "Humanoid", tags: [ "Roachling" ], 
			ac: 13, hp: 7, init: 2, cr: "1/4",
			alignment: alignments.cn,
			id: "b1c650f2-1346-4ffe-b438-9dabc29a639e",
		},
		{
			section: "Roachling", name: "Roachling Lord",
			size: "Small", type: "Humanoid", tags: [ "Roachling" ], 
			ac: 15, hp: 63, init: 3, cr: 2,
			alignment: alignments.cn,
			id: "6ee01ecc-1f6e-40ee-88f3-ce71bc9f1aae",
		},
		{
			name: "Rotting Wind",
			size: "Large", type: "Undead",
			ac: 15, hp: 82, init: 5, cr: 6,
			alignment: alignments.ne,
			id: "a2d1a971-e66d-4568-96b6-a58c4626ebfc",
		},
		{
			name: "Rusalka",
			size: "Medium", type: "Undead",
			ac: 14, hp: 88, init: 1, cr: 6,
			alignment: alignments.ce,
			id: "f053e7fc-ff6b-4813-9c31-4dcd682ea8c8",
		},
		{
			name: "Sand Silhouette",
			size: "Medium", type: "Undead",
			ac: 15, hp: 105, init: 2, cr: 6,
			alignment: alignments.ne,
			id: "0cb7aad6-0f83-4250-b1fe-e64d39004c30",
		},
		{
			name: "Sandman",
			size: "Medium", type: "Celestial",
			ac: 14, hp: 82, init: 4, cr: 5,
			alignment: alignments.cn,
			id: "71ecaa9d-ed41-4063-b69b-2adefcbd5694",
		},
		{
			name: "Sandwyrm",
			size: "Large", type: "Dragon",
			ac: 15, hp: 142, init: 1, cr: 6,
			alignment: alignments.unaligned,
			id: "27285f11-2529-4510-a4fc-5915d73616a1",
		},
		{
			name: "Sap Demon",
			size: "Small", type: "Ooze",
			ac: 13, hp: 67, init: -2, cr: 4,
			alignment: alignments.ce,
			id: "e854f6f7-6719-4a4c-a49a-eebd3653511c",
		},
		{
			name: "Sarcophagus Slime",
			size: "Medium", type: "Undead",
			ac: 11, hp: 105, init: 1, cr: 5,
			alignment: alignments.ne,
			id: "e0d4a038-cc22-4961-8d37-15bb39a3c5d2",
		},
		{
			name: "Sathaq Worm",
			size: "Huge", type: "Elemental",
			ac: 16, hp: 172, init: -2, cr: 10,
			alignment: alignments.ne,
			id: "535b734d-4e1c-49c8-98f3-4ed0f0e4a11b",
		},
		{
			name: "Savager",
			size: "Large", type: "Beast",
			ac: 17, hp: 115, init: 2, cr: 8,
			alignment: alignments.ne,
			id: "1d585aff-d195-4c06-ac1f-f7e42ce096dc",
		},
		{
			name: "Scheznyki",
			size: "Small", type: "Fey",
			ac: 16, hp: 153, init: 2, cr: 6,
			alignment: alignments.ce,
			id: "fe9e68cb-f4dd-4d11-ac79-fa7ff0f887eb",
		},
		{
			section: "Scorpions", name: "Night Scorpion",
			size: "Large", type: "Beast",
			ac: 14, hp: 90, init: 2, cr: 3,
			alignment: alignments.unaligned,
			id: "4061b92c-4ad3-4023-8d6c-3a188a68ff34",
		},
		{
			section: "Scorpions", name: "Stygian Fat-Tailed Scorpion",
			size: "Tiny", type: "Beast",
			ac: 14, hp: 10, init: 3, cr: 3,
			alignment: alignments.unaligned,
			id: "84193f38-0655-412c-9b48-bcb74fc7d8d6",
		},
		{
			name: "Selang",
			size: "Medium", type: "Fey",
			ac: 15, hp: 76, init: 2, cr: 4,
			alignment: alignments.ce,
			id: "f1435d44-d07e-4954-b83c-c381cc81dc43",
		},
		{
			name: "Serpopard",
			size: "Large", type: "Beast",
			ac: 15, hp: 85, init: 3, cr: 4,
			alignment: alignments.unaligned,
			id: "0efddf33-ea91-4c78-927a-6a2aa34767b8",
		},
		{
			name: "Shabti",
			size: "Medium", type: "Construct",
			ac: 17, hp: 102, init: 5, cr: 8,
			alignment: alignments.unaligned,
			id: "6e76cd35-77e6-4b90-ad60-9abdc094f3c4",
		},
		{
			name: "Shadhavar",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 97, init: 2, cr: 2,
			alignment: alignments.n,
			id: "a8489757-ccc5-45f3-b071-ab94cdb12e6c",
		},
		{
			name: "Shadow Beast",
			size: "Medium", type: "Fey",
			ac: 14, hp: 135, init: 4, cr: 7,
			alignment: alignments.ce,
			id: "96e404b7-55b2-4e69-91af-2ae68b0dad9a",
		},
		{
			name: "Shellycoat",
			size: "Medium", type: "Fey",
			ac: 14, hp: 75, init: 2, cr: 2,
			alignment: alignments.ne,
			id: "384b03a0-a3c5-4395-97ac-a5cdc24625cd",
		},
		{
			name: "Shoggoth",
			size: "Huge", type: "Aberration",
			ac: 18, hp: 387, init: 2, cr: 19,
			alignment: alignments.cn,
			id: "a5627f16-e828-4ce0-84a7-d7cd1ee1e4c3",
		},
		{
			name: "Shroud",
			size: "Medium", type: "Undead",
			ac: 13, hp: 9, init: 1, cr: "1/8",
			alignment: alignments.ne,
			id: "2e9eb1bc-0a71-4a79-b9e3-15f9f4353a5c",
		},
		{
			name: "Skein Witch",
			size: "Medium", type: "Celestial",
			ac: 20, hp: 162, init: 1, cr: 12,
			alignment: alignments.n,
			id: "60c2b3df-254d-49e8-9a73-46c99b66ca3c",
		},
		{
			name: "Sharkjaw Skeleton",
			size: "Large", type: "Undead",
			ac: 13, hp: 45, init: 0, cr: 1,
			alignment: alignments.le,
			id: "cf786939-8f97-46ec-9f39-2a483c29142b",
		},
		{
			name: "Vine Troll Skeleton",
			size: "Large", type: "Plant",
			ac: 16, hp: 119, init: 1, cr: 9,
			alignment: alignments.unaligned,
			id: "ebacd4fd-f8e1-45d3-9cff-2b7e473319af",
		},
		{
			name: "Skitterhaunt",
			size: "Large", type: "Ooze",
			ac: 14, hp: 95, init: 0, cr: 4,
			alignment: alignments.unaligned,
			id: "65c27747-9dfc-479a-9099-7b70aee390ba",
		},
		{
			name: "Slow Storm",
			size: "Huge", type: "Elemental",
			ac: 19, hp: 225, init: 4, cr: 15,
			alignment: alignments.cn,
			id: "1868ed95-6478-45ef-bae1-864cfb206897",
		},
		{
			section: "Snakes", name: "Swamp Adder",
			size: "Small", type: "Beast",
			ac: 13, hp: 18, init: 3, cr: "1/4",
			alignment: alignments.unaligned,
			id: "fcb77a91-5b06-405f-b52a-6eaa291627ed",
		},
		{
			section: "Snakes", name: "Zanskaran Viper",
			size: "Large", type: "Beast",
			ac: 14, hp: 38, init: 0, cr: 1,
			alignment: alignments.unaligned,
			id: "7a979569-87ea-46d9-8475-eba92c1e5f04",
		},
		{
			name: "Son of Fenris",
			size: "Huge", type: "Monstrosity",
			ac: 17, hp: 175, init: 3, cr: 12,
			alignment: alignments.ce,
			id: "1b5e77f5-5250-44ed-8051-e29559d816d4",
		},
		{
			name: "Soul Eater",
			size: "Medium", type: "Fiend",
			ac: 16, hp: 104, init: 6, cr: 7,
			alignment: alignments.ne,
			id: "7937ed71-f2ae-42db-b026-e0123aed20a3",
		},
		{
			name: "Spark",
			size: "Tiny", type: "Elemental",
			ac: 16, hp: 84, init: 5, cr: 7,
			alignment: alignments.cn,
			id: "56459c20-2355-4f52-a2ef-ecd1e8fdc579",
		},
		{
			name: "Spectral Guardian",
			size: "Medium", type: "Undead",
			ac: 14, hp: 110, init: 4, cr: 6,
			alignment: alignments.ne,
			id: "37ff88b3-06cb-4025-a18d-ff6fb4f40a35",
		},
		{
			name: "Arcane Guardian",
			size: "Medium", type: "Undead",
			ac: 14, hp: 110, init: 4, cr: 8,
			alignment: alignments.ne,
			id: "bf8bbb5c-8f14-465c-86c5-db96d697f4c2",
		},
		{
			name: "Gypsosphinx",
			size: "Large", type: "Monstrosity",
			ac: 17, hp: 171, init: 2, cr: 14,
			alignment: alignments.ne,
			legendary: true, 
			id: "a46c9a0b-a683-4f25-ae80-b47b20b38132",
		},
		{
			name: "Ghostwalk Spider",
			size: "Large", type: "Monstrosity",
			ac: 15, hp: 119, init: 5, cr: 9,
			alignment: alignments.ne,
			id: "98d1b693-9485-4ed1-9301-d67542840e5b",
		},
		{
			name: "J'ba Fofi Spider",
			size: "Large", type: "Beast",
			ac: 18, hp: 75, init: 3, cr: 3,
			alignment: alignments.unaligned,
			id: "030c90be-49b5-42ca-83f0-031d68a37d75",
		},
		{
			name: "Red-Banded Line Spider",
			size: "Tiny", type: "Beast",
			ac: 13, hp: 2, init: 3, cr: "1/4",
			alignment: alignments.unaligned,
			id: "1cf96cca-4c00-4549-bbe5-8ecd7b92a665",
		},
		{
			name: "Sand Spider",
			size: "Large", type: "Beast",
			ac: 15, hp: 105, init: 3, cr: 7,
			alignment: alignments.unaligned,
			id: "8bbc042e-4f22-4355-ad02-c23e5bc7dcb7",
		},
		{
			name: "Spider of Leng",
			size: "Large", type: "Aberration",
			ac: 15, hp: 144, init: 3, cr: 7,
			alignment: alignments.ce,
			id: "2b9b2996-df38-4842-bf5f-db1720553b23",
		},
		{
			name: "Spider Thief",
			size: "Small", type: "Construct",
			ac: 13, hp: 54, init: 1, cr: 2,
			alignment: alignments.unaligned,
			id: "e2a8431a-d9bb-446b-be45-fd1c0ba04b52",
		},
		{
			name: "Spire Walker",
			size: "Tiny", type: "Fey",
			ac: 16, hp: 38, init: 4, cr: 3,
			alignment: alignments.cn,
			id: "46006136-d533-4fa0-989d-1f62623c2874",
		},
		{
			name: "Star-Spawn of Cthulhu",
			size: "Large", type: "Fiend",
			ac: 17, hp: 187, init: 2, cr: 15,
			alignment: alignments.ce,
			id: "aba1983a-a5c7-4f9e-9807-0271a80b7b58",
		},
		{
			name: "Stryx",
			size: "Tiny", type: "Monstrosity",
			ac: 13, hp: 10, init: 3, cr: "1/8",
			alignment: alignments.n,
			id: "96c64c49-b1ae-4fd5-b17a-ec2c8cedb8eb",
		},
		{
			name: "Stuhac",
			size: "Medium", type: "Fiend",
			ac: 18, hp: 190, init: 4, cr: 13,
			alignment: alignments.ne,
			id: "c9384d24-8aed-41b8-bb0e-b3316d25a092",
		},
		{
			name: "Subek",
			size: "Large", type: "Humanoid", tags: [ "Subek" ], 
			ac: 17, hp: 76, init: 0, cr: 5,
			alignment: alignments.ln,
			id: "b1a671e2-210a-401f-b798-2f83847f4b6c",
		},
		{
			name: "Suturefly",
			size: "Tiny", type: "Beast",
			ac: 14, hp: 7, init: 4, cr: "1/4",
			alignment: alignments.unaligned,
			id: "79d3a364-83bc-41be-9f6e-eea838b7ed65",
		},
		{
			name: "Fire Dancer Swarm",
			size: "Medium", type: "Elemental", tags: [ "Swarm" ], 
			ac: 15, hp: 90, init: 5, cr: 7,
			alignment: alignments.ne,
			id: "52464dd2-1828-480e-b03c-a07a5dc04900",
		},
		{
			name: "Manabane Scarab Swarm",
			size: "Medium", type: "Beast", tags: [ "Swarm" ], 
			ac: 15, hp: 75, init: 3, cr: 4,
			alignment: alignments.unaligned,
			id: "70898ccc-879f-4459-aa1e-b106f1044bbe",
		},
		{
			name: "Prismatic Beetle Swarm", 
			size: "Medium", type: "Beast", tags: [ "Swarm" ], 
			ac: 13, hp: 38, init: 3, cr: 3,
			alignment: alignments.unaligned,
			id: "1a985064-6798-42c4-bc92-d70b4d4549cd",
		},
		{
			name: "Sluagh Swarm",
			size: "Medium", type: "Fey", tags: [ "Swarm" ], 
			ac: 13, hp: 54, init: 3, cr: 3,
			alignment: alignments.ce,
			id: "bd438b5e-6bc2-465c-a9e3-15008b4662bb",
		},
		{
			name: "Sluagh",
			size: "Tiny", type: "Fey", 
			ac: 13, hp: 2, init: 3, cr: "1/8",
			alignment: alignments.ce,
			id: "3dfa2f4f-d22b-4458-8bb0-e98b51103740",
		},
		{
			name: "Wolf Spirit Swarm",
			size: "Large", type: "Undead", tags: [ "Swarm" ], 
			ac: 16, hp: 97, init: 3, cr: 6,
			alignment: alignments.ne,
			id: "44fc2e30-8c14-485e-8dcd-7f049b463e60",
		},
		{
			name: "Temple Dog",
			size: "Medium", type: "Celestial",
			ac: 15, hp: 97, init: 2, cr: 5,
			alignment: alignments.any_good,
			id: "6ee1e568-4b2b-43db-ab59-48c4585b684b",
		},
		{
			name: "Theullai",
			size: "Huge", type: "Elemental",
			ac: 17, hp: 149, init: 7, cr: 10,
			alignment: alignments.cn,
			id: "2cd2dde4-6c0d-49f4-9309-5130f103365c",
		},
		{
			name: "Ancient Titan",
			size: "Gargantuan", type: "Celestial", tags: [ "Titan" ], 
			ac: 15, hp: 198, init: 1, cr: 12,
			alignment: alignments.ng,
			id: "3bc2512e-6c39-4888-9d23-c70434622b9c",
		},
		{
			name: "Degenerate Titan",
			size: "Huge", type: "Giant",
			ac: 12, hp: 161, init: -2, cr: 8,
			alignment: alignments.ce,
			id: "57a6a940-349f-4c1e-85af-cc68858a0a76",
		},
		{
			name: "Titanoboa",
			size: "Gargantuan", type: "Beast",
			ac: 14, hp: 232, init: 0, cr: 12,
			alignment: alignments.unaligned,
			id: "63cd3b02-a21f-4a2c-a143-8d30c60b4083",
		},
		{
			name: "Tophet",
			size: "Huge", type: "Construct",
			ac: 16, hp: 184, init: 0, cr: 8,
			alignment: alignments.ne,
			id: "c22e8a67-e2bc-40af-9114-181d0601189b",
		},
		{
			section: "Tosculi", name: "Tosculi Hive-Queen",
			size: "Large", type: "Monstrosity",
			ac: 17, hp: 157, init: 7, cr: 12,
			alignment: alignments.le,
			legendary: true, 
			lair: true, 
			id: "95f8e9f0-7930-4af8-8f7e-d6f2a77b80a2",
		},
		{
			section: "Tosculi", name: "Tosculi Warrior",
			size: "Small", type: "Monstrosity",
			ac: 15, hp: 58, init: 5, cr: 2,
			alignment: alignments.le,
			id: "fbb949d8-aa67-47c8-a04d-da746daa833d",
		},
		{
			section: "Tosculi", name: "Tosculi Drone",
			size: "Small", type: "Monstrosity",
			ac: 13, hp: 22, init: 3, cr: "1/2",
			alignment: alignments.le,
			id: "19c35b26-1b1a-44f7-a99f-c0019275996e",
		},
		{
			section: "Tosculi", name: "Tosculi Elite Bow Raider",
			size: "Medium", type: "Humanoid", tags: [ "Tosculi" ], 
			ac: 16, hp: 97, init: 4, cr: 5,
			alignment: alignments.ne,
			id: "ecb2456c-ae2d-4ebc-8353-9a75dc5ea814",
		},
		{
			name: "Treacle",
			size: "Tiny", type: "Ooze",
			ac: 13, hp: 22, init: -2, cr: "1/4",
			alignment: alignments.unaligned,
			id: "be860119-6f8e-4295-bc6b-059f93adfea6",
		},
		{
			name: "Weeping Treant",
			size: "Huge", type: "Plant",
			ac: 17, hp: 105, init: -1, cr: 6,
			alignment: alignments.n,
			id: "4e909dfa-279e-4414-a203-8a304dc419e9",
		},
		{
			name: "Lake Troll",
			size: "Large", type: "Giant",
			ac: 15, hp: 126, init: 1, cr: 7,
			alignment: alignments.ce,
			id: "36343cd1-aabe-4a13-90de-5314d54672d9",
		},
		{
			name: "Trollkin Reaver",
			size: "Medium", type: "Humanoid", tags: [ "Trollkin" ], 
			ac: 14, hp: 82, init: 1, cr: 4,
			alignment: alignments.n,
			id: "09c79891-9f2b-4acf-a301-78fdbcd76533",
		},
		{
			name: "Tusked Skyfish",
			size: "Large", type: "Aberration",
			ac: 14, hp: 102, init: 1, cr: 4,
			alignment: alignments.lg,
			id: "d8d002e8-0a7f-4010-90e7-8b8ffbbbfc1e",
		},
		{
			name: "Uraeus",
			size: "Tiny", type: "Celestial",
			ac: 14, hp: 40, init: 2, cr: 2,
			alignment: alignments.ln,
			id: "d93665ff-d379-45f9-a004-17abeb21a80d",
		},
		{
			name: "Urochar (Strangling Watcher)",
			size: "Huge", type: "Aberration",
			ac: 19, hp: 256, init: 2, cr: 17,
			alignment: alignments.ce,
			legendary: true, 
			id: "08958c03-f398-47e7-a399-83d49c881edf",
		},
		{
			name: "Ushabti",
			size: "Large", type: "Construct",
			ac: 18, hp: 105, init: 3, cr: 9,
			alignment: alignments.unaligned,
			id: "543176d3-515d-41b0-b5c0-aa4c4eb46f93",
		},
		{
			name: "Vaettir",
			size: "Medium", type: "Undead",
			ac: 15, hp: 120, init: 2, cr: 4,
			alignment: alignments.le,
			id: "29a0483a-fc63-4337-89c7-7df8b106287b",
		},
		{
			name: "Valkyrie",
			size: "Medium", type: "Celestial",
			ac: 16, hp: 112, init: 4, cr: 11,
			alignment: alignments.n,
			legendary: true, 
			id: "ee56ae45-caa2-47ee-be88-ef8ed21870b4",
		},
		{
			name: "Umbral Vampire",
			size: "Medium", type: "Fiend",
			ac: 14, hp: 84, init: 4, cr: 7,
			alignment: alignments.ce,
			id: "417edc33-5ce9-4a26-8731-e5ea3ab8ec96",
		},
		{
			name: "Vapor Lynx",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 127, init: 4, cr: 5,
			alignment: alignments.cn,
			id: "a4ab2454-1855-4109-a28a-4454fd5a624e",
		},
		{
			name: "Vesiculosa",
			size: "Gargantuan", type: "Plant",
			ac: 15, hp: 203, init: 0, cr: 11,
			alignment: alignments.unaligned,
			id: "23968e0d-e500-4f46-99e3-397633cd6486",
		},
		{
			name: "Vila",
			size: "Medium", type: "Fey",
			ac: 15, hp: 77, init: 5, cr: 5,
			alignment: alignments.ln,
			id: "11135d19-ccc5-499e-9a2c-b70c8534e4da",
		},
		{
			name: "Vile Barber (Siabhra)",
			size: "Small", type: "Fey",
			ac: 15, hp: 28, init: 4, cr: 2,
			alignment: alignments.ce,
			id: "d5aaefda-4a21-4d41-80bb-904452dd9420",
		},
		{
			name: "Vine Lord",
			size: "Medium", type: "Plant",
			ac: 16, hp: 105, init: 5, cr: 7,
			alignment: alignments.ln,
			id: "18cfcab3-b5f2-48c3-8515-5971d45a3972",
		},
		{
			name: "Tendril Puppet",
			size: "Medium", type: "Plant",
			ac: 13, hp: 34, init: 1, cr: 2,
			alignment: alignments.ln,
			id: "d129cbf3-a157-494d-87c6-e4d7f99d65f0",
		},
		{
			name: "Voidling",
			size: "Large", type: "Aberration",
			ac: 16, hp: 110, init: 6, cr: 11,
			alignment: alignments.ne,
			id: "dba4d591-0200-4ae7-9f45-e77876a16a7e",
		},
		{
			name: "Wampus Cat",
			size: "Medium", type: "Monstrosity",
			ac: 14, hp: 58, init: 4, cr: 1,
			alignment: alignments.cn,
			id: "88bda2f0-9e1a-4de6-acb5-5f78e5cbd720",
		},
		{
			name: "Water Leaper",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 96, init: 2, cr: 4,
			alignment: alignments.unaligned,
			id: "535c9c11-ac93-4d42-b69b-5ad053561caf",
		},
		{
			name: "Wharfling",
			size: "Tiny", type: "Beast",
			ac: 13, hp: 6, init: 3, cr: "1/8",
			alignment: alignments.unaligned,
			id: "3434dd3f-36ef-481c-9e32-6b5b765fecec",
		},
		{
			name: "Wharfling Swarm",
			size: "Large", type: "Beast", tags: [ "Swarm" ], 
			ac: 14, hp: 63, init: 3, cr: 4,
			alignment: alignments.unaligned,
			id: "c3f73d39-ded6-456e-bc1e-52b94b901786",
		},
		{
			name: "White Ape",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 114, init: 3, cr: 6,
			alignment: alignments.n,
			id: "bc9e0ff1-bedd-4b03-ae4b-c8aa3ea0697e",
		},
		{
			name: "Witchlight",
			size: "Tiny", type: "Construct",
			ac: 14, hp: 10, init: 4, cr: "1/4",
			alignment: alignments.n,
			id: "e13c41c6-6464-4202-a4e1-2880d9a3f267",
		},
		{
			name: "Wormhearted Suffragan",
			size: "Medium", type: "Undead",
			ac: 12, hp: 97, init: 2, cr: 5,
			alignment: alignments.ce,
			id: "27368d86-58a5-43c7-a1d3-595f19116db2",
		},
		{
			name: "Xanka",
			size: "Small", type: "Construct",
			ac: 15, hp: 18, init: 2, cr: "1/4",
			alignment: alignments.unaligned,
			id: "558dab89-5002-40c0-9235-4d74ed9ce9b3",
		},
		{
			name: "Xhkarsh",
			size: "Large", type: "Aberration",
			ac: 19, hp: 133, init: 5, cr: 8,
			alignment: alignments.ne,
			id: "76571f12-5e97-4402-b554-21af217c505a",
		},
		{
			name: "Ychen Bannog",
			size: "Gargantuan", type: "Beast",
			ac: 17, hp: 231, init: 0, cr: 11,
			alignment: alignments.unaligned,
			id: "19d46a6d-faba-43d1-8231-fbd73251fb90",
		},
		{
			name: "Zaratan",
			size: "Gargantuan", type: "Monstrosity",
			ac: 25, hp: 507, init: -4, cr: 26,
			alignment: alignments.unaligned,
			legendary: true, 
			id: "148558cc-fa9e-493d-b089-19c56e1d2b0b",
		},
		{
			name: "Zimwi",
			size: "Medium", type: "Giant",
			ac: 17, hp: 76, init: 4, cr: 4,
			alignment: alignments.ce,
			id: "48f0ec18-5e92-4881-932e-7744de2032bb",
		},
		{
			name: "Zmey",
			size: "Huge", type: "Dragon",
			ac: 18, hp: 189, init: 1, cr: 14,
			alignment: alignments.ce,
			legendary: true, 
			id: "5ece18ae-3cfb-404b-b318-e9ee3a2155de",
		},
		{
			name: "Zmey Headling",
			size: "Medium", type: "Dragon",
			ac: 16, hp: 105, init: 0, cr: 5,
			alignment: alignments.ce,
			id: "61e83cd8-4d2d-45a4-a9ac-3e01b1975139",
		},
		
		// Tome of Beasts Appendix A: Villain Codex
		
		{
			section: "Villain Codex", name: "Bandit Lord",
			size: "Medium", type: "Humanoid", tags: [ "any" ], 
			ac: 16, hp: 91, init: 2, cr: 4,
			alignment: alignments.non_lawful,
			id: "38f5ce44-3fb7-4a8d-9901-1f95cdb4fbde",
		},
		{
			section: "Villain Codex", name: "Black Knight Commander",
			size: "Medium", type: "Humanoid", tags: [ "any" ], 
			ac: 18, hp: 78, init: 0, cr: 5,
			alignment: alignments.le,
			id: "1c0e1fa1-2fa8-4885-a976-b46ad9bbb130",
		},
		{
			section: "Villain Codex", name: "City Watch Captain",
			size: "Medium", type: "Humanoid", tags: [ "any" ], 
			ac: 17, hp: 91, init: 3, cr: 4,
			alignment: alignments.ln,
			id: "9a2cd6b4-c9e9-45d8-9ace-7e6106ec823a",
		},
		{
			section: "Villain Codex", name: "Devilbound Gnomish Prince",
			size: "Small", type: "Humanoid", tags: [ "Gnome" ], 
			ac: 12, hp: 104, init: 2, cr: 9,
			alignment: alignments.any_evil,
			id: "7ebfa146-afba-48bb-8e52-a8f00c4c3d52",
		},
		{
			section: "Villain Codex", name: "Dwarven Ringmage",
			size: "Medium", type: "Humanoid", tags: [ "Dwarf" ], 
			ac: 16, hp: 82, init: 2, cr: 7,
			alignment: alignments.any,
			id: "40f414ff-2834-4522-8ea2-a28512b13404",
		},
		{
			section: "Villain Codex", name: "Emerald Order Cult Leader",
			size: "Medium", type: "Humanoid", tags: [ "any" ], 
			ac: 14, hp: 117, init: 0, cr: 8,
			alignment: alignments.ln_le,
			id: "8ecfa397-b6b0-45f6-aeb1-5ece4b72a554",
		},
		{
			section: "Villain Codex", name: "Elvish Veteran Archer",
			size: "Medium", type: "Humanoid", tags: [ "Elf" ], 
			ac: 15, hp: 77, init: 3, cr: 3,
			alignment: alignments.cg_cn,
			id: "8dd4f4f3-1bb4-4fe4-bafa-4396f022ba69",
		},
		{
			section: "Villain Codex", name: "Ghost Knight",
			size: "Medium", type: "Undead",
			ac: 17, hp: 97, init: 2, cr: 6,
			alignment: alignments.le,
			id: "8f117d37-d40f-493f-8f48-343014cac3a1",
		},
		{
			section: "Villain Codex", name: "Corrupted Ogre Chieftain",
			size: "Large", type: "Giant",
			ac: 17, hp: 127, init: -1, cr: 6,
			alignment: alignments.ce,
			id: "a2055eff-9709-4d7f-a85d-5f209651d06e",
		},
		{
			section: "Villain Codex", name: "Ratfolk Rogue",
			size: "Small", type: "Humanoid", tags: [ "Ratfolk" ], 
			ac: 15, hp: 18, init: 3, cr: 1,
			alignment: alignments.n,
			id: "27f5e286-1a17-46e3-bea4-5453c9724b76",
		},
		{
			section: "Villain Codex", name: "Scropion Cultist",
			size: "Medium", type: "Humanoid", tags: [ "any" ], 
			ac: 13, hp: 19, init: 2, cr: "1/2",
			alignment: alignments.n,
			id: "60c990fb-4ea3-464f-9f17-1c2e74a4e813",
		},
		{
			section: "Villain Codex", name: "Vampire Warlock",
			size: "Medium", type: "Undead", tags: [ "Shapechanger" ],
			ac: 16, hp: 144, init: 4, cr: 13,
			alignment: alignments.le,
			legendary: true,
			lair: true,
			id: "07575c79-9ccc-46a4-ab57-d96b9048fd84",
		},
		{
			section: "Villain Codex", name: "Wolf Reaver Dwarf",
			size: "Medium", type: "Humanoid", tags: [ "Dwarf" ], 
			ac: 16, hp: 76, init: 1, cr: 3,
			alignment: alignments.any_chaotic,
			id: "61945580-5ceb-45a5-9764-7e3f7ae06237",
		},

		// Storm King's Thunder
		{
			name: "Crag Cat",
			size: "Large", type: "Beast",
			ac: 13, hp: 34, init: 3, cr: 1,
			alignment: alignments.unaligned,
			id: "28c8c457-5a31-4c0d-9ffe-e42c8bb47d8b",
		},
		{
			name: "Hulking Crab",
			size: "Huge", type: "Beast",
			ac: 17, hp: 76, init: -1, cr: 5,
			alignment: alignments.unaligned,
			id: "0a8b2f8f-16f5-4d79-8c56-fb28fdcb7b71",
		},
		{
			name: "Iymrith the Dragon",
			size: "Gargantuan", type: "Dragon", unique: true,
			ac: 22, hp: 481, init: 0, cr: "23",
			alignment: alignments.le,
			legendary: true,
			lair: true,
			id: "c5aab99f-f1f2-45d0-872b-645a9d5d41d6",
		},
		{
			name: "Maegera the Dawn Titan",
			size: "Gargantuan", type: "Elemental", unique: true, 
			ac: 16, hp: 341, init: 6, cr: 23,
			alignment: alignments.cn,
			legendary: true, 
			id: "7815b4c9-71e0-49a9-be1b-cb8caf448695",
		},
		{
			name: "Purple Wormling",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 42, init: -2, cr: 2,
			alignment: alignments.unaligned,
			id: "10580eaf-7424-46d8-a827-fb681e914fcb",
		},
		{
			name: "Tressym",
			size: "Tiny", type: "Beast",
			ac: 12, hp: 5, init: 2, cr: 0,
			alignment: alignments.cn,
			id: "71b533e5-d65f-4fc9-b447-98aef9833200",
		},
		{
			name: "Uthgardt Shaman",
			size: "Medium", type: "Humanoid", tags: [ "Human" ], 
			ac: 13, hp: 38, init: 1, cr: 2,
			alignment: alignments.ne,
			id: "3e739adc-919f-4908-976d-292e6a77c39e",
		},
		{
			name: "Yakfolk Warrior",
			size: "Large", type: "Monstrosity",
			ac: 11, hp: 60, init: 0, cr: 3,
			alignment: alignments.ne,
			id: "8c4a7dd1-3e38-4ef5-ad17-d9d81590e202",
		},
		{
			name: "Yakfolk Priest",
			size: "Large", type: "Monstrosity",
			ac: 12, hp: 52, init: 0, cr: 4,
			alignment: alignments.ne,
			id: "0ac2d7e7-8936-4e86-8d41-5fb7b9fa82be",
		},
		
		// Volo's Guide to Monsters: Bestiary
		{
			name: "Banderhobb",
			size: "Large", type: "Monstrosity", 
			ac: 15, hp: 84, init: 1, cr: 5,
			alignment: alignments.ne,
			environments: [ "urban" ],
			id: "c80a939f-3eb8-411d-b706-fd854706ce1b",
		},
		{
			name: "Barghest",
			size: "Large", type: "Fiend", tags: [ "Shapechanger" ], 
			ac: 17, hp: 90, init: 2, cr: 4,
			alignment: alignments.ne,
			environments: [ "forest", "grassland", "hill", "mountain", "underdark" ],
			id: "efca8fda-9530-4c93-980b-7f3373403b94",
		},
		{
			section: "Beholders", name: "Death Kiss",
			size: "Large", type: "Aberration", 
			ac: 16, hp: 161, init: 2, cr: 10,
			alignment: alignments.ne,
			environments: [ "underdark" ],
			id: "55a7bf90-28ae-45e0-87a6-bdf486a94825",
		},
		{
			section: "Beholders", name: "Gauth",
			size: "Medium", type: "Aberration", 
			ac: 15, hp: 67, init: 2, cr: 6,
			alignment: alignments.le,
			environments: [ "underdark" ],
			id: "d72537f3-e20c-4c8c-8186-7d6c7efc249f",
		},
		{
			section: "Beholders", name: "Gazer",
			size: "Tiny", type: "Aberration", 
			ac: 13, hp: 13, init: 3, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "underdark" ],
			id: "1c337d34-8887-44dc-8b20-4c250ca6c2c5",
		},
		{
			name: "Bodak",
			size: "Medium", type: "Undead", 
			ac: 15, hp: 58, init: 3, cr: 6,
			alignment: alignments.ce,
			environments: [ "swamp", "underdark", "urban" ],
			id: "a33ac49f-60a3-4195-8c99-70e7277acbf9",
		},
		{
			name: "Boggle",
			size: "Small", type: "Fey",
			ac: 14, hp: 18, init: 4, cr: "1/8",
			alignment: alignments.cn,
			environments: [ "forest", "hill", "underdark", "urban" ],
			id: "8cdd733f-c78e-4a92-a451-4ab459682aaa",
		},
		{
			name: "Catoblepas",
			size: "Large", type: "Monstrosity", 
			ac: 14, hp: 84, init: 1, cr: 5,
			alignment: alignments.unaligned,
			environments: [ "swamp" ],
			id: "6d5a9c50-fedc-414e-95aa-522a2a5bef5d",
		},
		{
			name: "Cave Fisher",
			size: "Medium", type: "Monstrosity", 
			ac: 16, hp: 58, init: 1, cr: 3,
			alignment: alignments.unaligned,
			environments: [ "underdark" ],
			id: "4cc42a2f-f24c-43f5-904e-653cd82945a2",
		},
		{
			section: "Chitines", name: "Chitine",
			size: "Small", type: "Monstrosity",
			ac: 14, hp: 18, init: 2, cr: "1/2",
			alignment: alignments.ce,
			environments: [ "underdark" ],
			id: "f35b9f35-6bd4-47f1-aaaf-305a8877c28c",
		},
		{
			section: "Chitines", name: "Choldrith",
			size: "Medium", type: "Monstrosity",
			ac: 15, hp: 66, init: 3, cr: 3,
			alignment: alignments.ce,
			environments: [ "underdark" ],
			id: "18f0b7ed-db92-4567-ab9f-91506439296b",
		},
		{
			section: "Cranium Rats", name: "Cranium Rat",
			size: "Tiny", type: "Beast",
			ac: 12, hp: 2, init: 2, cr: 0,
			alignment: alignments.le,
			environments: [ "underdark", "urban" ],
			id: "b469005c-564e-457b-9776-40a65501a171",
		},
		{
			section: "Cranium Rats", name: "Swarm of Cranium Rats",
			size: "Medium", type: "Beast", tags: [ "Swarm" ],
			ac: 12, hp: 36, init: 2, cr: 5,
			alignment: alignments.le,
			environments: [ "underdark", "urban" ],
			id: "036a9bdf-1a1e-4213-88c7-9080d95dfa3d",
		},
		{
			section: "Darklings", name: "Darkling",
			size: "Small", type: "Fey",
			ac: 14, hp: 13, init: 3, cr: "1/2",
			alignment: alignments.cn,
			environments: [ "forest", "swamp", "underdark", "urban" ],
			id: "1687a030-f448-44cd-acb8-464494bfb54f",
		},
		{
			section: "Darklings", name: "Darkling Elder",
			size: "Medium", type: "Fey", 
			ac: 15, hp: 27, init: 3, cr: 2,
			alignment: alignments.cn,
			environments: [ "forest", "swamp", "underdark", "urban" ],
			id: "67b78e36-a770-4fe1-9056-c049c27f9549",
		},
		{
			name: "Deep Scion",
			size: "Medium", type: "Humanoid", tags: [ "Shapechanger" ], 
			ac: 11, hp: 67, init: 1, cr: 3,
			alignment: alignments.ne,
			environments: [ "coast", "underwater" ],
			id: "bb09f8e7-27dc-4026-9017-7ac0502aad5b",
		},
		{
			section: "Demons", name: "Babau",
			size: "Medium", type: "Fiend", tags: [ "Demon" ], 
			ac: 16, hp: 82, init: 3, cr: 4,
			alignment: alignments.ce,
			environments: [ "underdark", "urban" ],
			id: "30a9ed8c-5fd9-46f1-ab97-6a3d6645eb9a",
		},
		{
			section: "Demons", name: "Maw Demon",
			size: "Medium", type: "Fiend", tags: [ "Demon" ], 
			ac: 13, hp: 33, init: -1, cr: 1,
			alignment: alignments.ce,
			environments: [ "underdark" ],
			id: "3414fdd4-a1ca-4501-87fb-e6c571d134a6",
		},
		{
			section: "Demons", name: "Shoosuva",
			size: "Large", type: "Fiend", tags: [ "Demon" ], 
			ac: 14, hp: 110, init: 1, cr: 8,
			alignment: alignments.ce,
			environments: [ "arctic", "forest", "grassland", "hill" ],
			id: "282b94f2-c50e-4e06-b8ce-31d89d0803d1",
		},
		{
			name: "Devourer",
			size: "Large", type: "Fiend", 
			ac: 16, hp: 178, init: 1, cr: 13,
			alignment: alignments.ce,
			environments: [ "underdark" ],
			id: "0c8931e1-2bcf-4507-9c41-c040221d0f6c",
		},
		{
			section: "Dinosaurs", name: "Brontosaurus",
			size: "Gargantuan", type: "Beast",
			ac: 15, hp: 121, init: -1, cr: 5,
			alignment: alignments.unaligned,
			environments: [ "forest", "grassland" ],
			id: "d7bda54e-5efc-4196-a709-80caa0e441e1",
		},
		{
			section: "Dinosaurs", name: "Deinonychus",
			size: "Medium", type: "Beast",
			ac: 13, hp: 26, init: 2, cr: 1,
			alignment: alignments.unaligned,
			environments: [ "forest", "grassland", "hill" ],
			id: "bd9c09e0-1360-464c-bd14-bad41cfc60c0",
		},
		{
			section: "Dinosaurs", name: "Dimetrodon",
			size: "Medium", type: "Beast",
			ac: 12, hp: 19, init: 0, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "swamp" ],
			id: "9dd0c06e-e952-4915-b224-aae56984ec83",
		},
		{
			section: "Dinosaurs", name: "Hadrosaurus",
			size: "Large", type: "Beast",
			ac: 11, hp: 19, init: 0, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "grassland", "swamp" ],
			id: "2c47a6bb-caac-434c-a71e-6bdb82d03cf7",
		},
		{
			section: "Dinosaurs", name: "Quetzalcoatlus",
			size: "Huge", type: "Beast",
			ac: 13, hp: 30, init: 1, cr: 2,
			alignment: alignments.unaligned,
			environments: [ "coast", "hill", "mountain" ],
			id: "e3c8935d-7149-49a2-be6e-ba6e9018c3c9",
		},
		{
			section: "Dinosaurs", name: "Stegosaurus",
			size: "Huge", type: "Beast",
			ac: 13, hp: 76, init: -1, cr: 4,
			alignment: alignments.unaligned,
			environments: [ "forest", "grassland" ],
			id: "afe3a501-2d72-44e9-8761-1f3f5d773255",
		},
		{
			section: "Dinosaurs", name: "Velociraptor",
			size: "Tiny", type: "Beast",
			ac: 13, hp: 10, init: 2, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "forest", "grassland" ],
			id: "65747477-fa7c-49b1-98c3-ba5235b7f085",
		},
		{
			name: "Draegloth",
			size: "Large", type: "Fiend", tags: [ "Demon" ], 
			ac: 15, hp: 123, init: 2, cr: 7,
			alignment: alignments.ce,
			environments: [ "underdark" ],
			id: "f423a0b9-5500-4283-9553-541a2f5893bc",
		},
		{
			section: "Firenewts", name: "Firenewt Warrior",
			size: "Medium", type: "Humanoid", tags: [ "Firenewt" ], 
			ac: 16, hp: 22, init: 1, cr: "1/2",
			alignment: alignments.ne,
			environments: [ "hill", "mountain", "underdark" ],
			id: "e2175890-b6c6-49c1-bf53-1d821bb4d21a",
		},
		{
			section: "Firenewts", name: "Giant Strider",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 22, init: 1, cr: 1,
			alignment: alignments.ne,
			environments: [ "hill", "mountain", "underdark" ],
			id: "9f92a394-a7a3-43b4-affa-473c73c01112",
		},
		{
			section: "Firenewts", name: "Firenewt Warlock of Imix",
			size: "Medium", type: "Humanoid", tags: [ "Firenewt" ], 
			ac: 10, hp: 33, init: 0, cr: 1,
			alignment: alignments.ne,
			environments: [ "hill", "mountain", "underdark" ],
			id: "79827bf3-c000-4b9c-86a8-f1a58b43f313",
		},
		{
			name: "Flail Snail",
			size: "Large", type: "Elemental",
			ac: 16, hp: 52, init: -3, cr: 3,
			alignment: alignments.unaligned,
			environments: [ "forest", "swamp", "underdark" ],
			id: "501a8481-979a-4349-870c-c7d527be03db",
		},
		{
			name: "Froghemoth",
			size: "Huge", type: "Monstrosity", 
			ac: 14, hp: 184, init: 1, cr: 10,
			alignment: alignments.unaligned,
			environments: [ "swamp", "underdark" ],
			id: "c88651d6-10c0-4b08-a6a0-ad226f86652d",
		},
		{
			section: "Giants", name: "Cloud Giant Smiling One",
			size: "Huge", type: "Giant", tags: [ "Cloud Giant" ], 
			ac: 15, hp: 262, init: 1, cr: 11,
			alignment: alignments.cn,
			environments: [ "mountain" ],
			id: "66b29d8c-d2b2-4d46-8a83-109828daffa5",
		},
		{
			section: "Giants", name: "Fire Giant Dreadnought",
			size: "Huge", type: "Giant", tags: [ "Fire Giant" ], 
			ac: 21, hp: 187, init: -1, cr: 14,
			alignment: alignments.le,
			environments: [ "mountain", "underdark" ],
			id: "020c9ef9-6365-4c3c-a200-4dd01865befc",
		},
		{
			section: "Giants", name: "Frost Giant Everlasting One",
			size: "Huge", type: "Giant", tags: [ "Frost Giant" ], 
			ac: 15, hp: 189, init: -1, cr: 12,
			alignment: alignments.ce,
			environments: [ "arctic", "coast" ],
			id: "77374683-ee85-4dd3-b6ae-fda0c2e490c5",
		},
		{
			section: "Giants", name: "Mouth of Grolantor",
			size: "Huge", type: "Giant", tags: [ "Hill Giant" ], 
			ac: 14, hp: 105, init: 0, cr: 6,
			alignment: alignments.ce,
			environments: [ "grassland", "hill" ],
			id: "eefda17b-25ca-4266-b8ca-752b4893fc76",
		},
		{
			section: "Giants", name: "Stone Giant Dreamwalker",
			size: "Huge", type: "Giant", tags: [ "Stone Giant" ], 
			ac: 18, hp: 161, init: 2, cr: 10,
			alignment: alignments.cn,
			environments: [ "coast", "hill", "mountain" ],
			id: "fcdea77a-b7ab-4b3d-aaf7-78706009286c",
		},
		{
			section: "Giants", name: "Storm Giant Quintessent",
			size: "Huge", type: "Giant", tags: [ "Storm Giant" ], 
			ac: 12, hp: 230, init: 2, cr: 16,
			alignment: alignments.cg,
			environments: ["arctic", "coast", "desert", "mountain", "underwater" ],
			id: "2e0ba72f-74ff-4828-bf1c-3479944bea4a",
		},
		{
			name: "Girallon",
			size: "Large", type: "Monstrosity", 
			ac: 13, hp: 59, init: 3, cr: 4,
			alignment: alignments.unaligned,
			environments: [ "forest" ],
			id: "8fe276ab-13c5-4a24-b998-23f9490bc049",
		},
		{
			section: "Gnolls", name: "Flind",
			size: "Medium", type: "Humanoid", tags: [ "Gnoll" ], 
			ac: 16, hp: 127, init: 0, cr: 9,
			alignment: alignments.ce,
			environments: [ "arctic", "forest", "grassland", "hill" ],
			id: "7b70915e-78d5-4bfe-b8a3-5c2aaa680da8",
		},
		{
			section: "Gnolls", name: "Gnoll Flesh Gnawer",
			size: "Medium", type: "Humanoid", tags: [ "Gnoll" ], 
			ac: 14, hp: 22, init: 2, cr: 1,
			alignment: alignments.ce,
			environments: [ "arctic", "forest", "grassland", "hill" ],
			id: "1377d091-b506-4969-83a5-2e15ebbc5ceb",
		},
		{
			section: "Gnolls", name: "Gnoll Hunter",
			size: "Medium", type: "Humanoid", tags: [ "Gnoll" ], 
			ac: 13, hp: 22, init: 2, cr: "1/2",
			alignment: alignments.ce,
			environments: [ "arctic", "forest", "grassland", "hill" ],
			id: "5484ec7e-b482-4a2c-8d13-46cd775436c6",
		},
		{
			section: "Gnolls", name: "Gnoll Witherling",
			size: "Medium", type: "Undead", 
			ac: 12, hp: 11, init: -1, cr: "1/4",
			alignment: alignments.ce,
			environments: [ "arctic", "forest", "grassland", "hill" ],
			id: "a947f2aa-a0f0-4c5b-83e6-190de7616b41",
		},
		{
			section: "Grungs", name: "Grung",
			size: "Small", type: "Humanoid", tags: [ "Grung" ], 
			ac: 12, hp: 11, init: 2, cr: "1/4",
			alignment: alignments.le,
			environments: [ "forest" ],
			id: "da56cbc6-b72a-4472-9910-07661977337b",
		},
		{
			section: "Grungs", name: "Grung Elite Warrior",
			size: "Small", type: "Humanoid", tags: [ "Grung" ], 
			ac: 13, hp: 49, init: 3, cr: 2,
			alignment: alignments.le,
			environments: [ "forest" ],
			id: "5c0f26e8-790f-4c79-a3df-cfaa21537d6f",
		},
		{
			section: "Grungs", name: "Grung Wildling",
			size: "Small", type: "Humanoid", tags: [ "Grung" ], 
			ac: 13, hp: 27, init: 3, cr: 1,
			alignment: alignments.le,
			environments: [ "forest" ],
			id: "4f42ad2b-d9b0-47d7-8fc3-0f446b7ad848",
		},
		{
			name: "Guard Drake",
			size: "Medium", type: "Dragon",
			ac: 14, hp: 52, init: 0, cr: 2,
			alignment: alignments.unaligned,
			environments: [ "arctic", "desert", "forest", "mountain", "swamp", "underdark", "urban" ],
			id: "a181ad6a-3e2f-4c45-aefc-2b63ea99b382",
		},
		{
			section: "Hags", name: "Annis Hag",
			size: "Large", type: "Fey",
			ac: 17, hp: 75, init: 1, cr: 6,
			alignment: alignments.ce,
			environments: [ "hill", "mountain" ],
			id: "f70647ec-88aa-4d87-a389-4d0045bb14a4",
		},
		{
			section: "Hags", name: "Bheur Hag",
			size: "Medium", type: "Fey",
			ac: 17, hp: 91, init: 3, cr: 7,
			alignment: alignments.ce,
			environments: [ "arctic" ],
			id: "36445a43-c0d2-4a75-80a7-e87e05603ae6",
		},
		{
			section: "Hobgoblins", name: "Hobgoblin Devastator",
			size: "Medium", type: "Humanoid", tags: [ "Goblinoid" ], 
			ac: 13, hp: 45, init: 1, cr: 4,
			alignment: alignments.le,
			environments: [ "forest", "grassland", "hill" ],
			id: "8b90ae47-ee46-4b14-afb7-4a12a6c500e2",
		},
		{
			section: "Hobgoblins", name: "Hobgoblin Iron Shadow",
			size: "Medium", type: "Humanoid", tags: [ "Goblinoid" ], 
			ac: 15, hp: 32, init: 3, cr: 2,
			alignment: alignments.le,
			environments: [ "forest", "grassland", "hill" ],
			id: "cc0e5ae5-8819-4694-a26a-126d66a1fdab",
		},
		{
			name: "Ki-rin",
			size: "Huge", type: "Celestial",
			ac: 20, hp: 152, init: 3, cr: 12,
			alignment: alignments.lg,
			environments: [ "coast", "desert", "grassland", "mountain" ],
			id: "79401bb2-32be-48b5-a7c8-ef212ec99cfe",
		},
		{
			section: "Kobolds", name: "Kobold Dragonshield",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ], 
			ac: 15, hp: 44, init: 2, cr: 1,
			alignment: alignments.le,
			environments: [ "forest", "hill", "mountain", "underdark", "urban" ],
			id: "d1b0378d-9bdc-4c31-a23d-70a8a9368b9d",
		},
		{
			section: "Kobolds", name: "Kobold Inventor",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ], 
			ac: 12, hp: 13, init: 2, cr: "1/4",
			alignment: alignments.le,
			environments: [ "forest", "hill", "mountain", "underdark", "urban" ],
			id: "ca07f8dc-fd62-4ce6-95d5-37f59b7b8377",
		},
		{
			section: "Kobolds", name: "Kobold Scale Sorcerer",
			size: "Small", type: "Humanoid", tags: [ "Kobold" ], 
			ac: 15, hp: 27, init: 2, cr: 1,
			alignment: alignments.le,
			environments: [ "forest", "hill", "mountain", "underdark", "urban" ],
			id: "a67eedd6-934c-4622-9de3-0e869c1e1e44",
		},
		{
			name: "Korred",
			size: "Small", type: "Fey", 
			ac: 17, hp: 102, init: 2, cr: 7,
			alignment: alignments.cn,
			environments: [ "forest" ],
			id: "a0982a32-cc7f-40c8-b839-fe33a9242462",
		},
		{
			name: "Leucrotta",
			size: "Large", type: "Monstrosity",
			ac: 14, hp: 67, init: 2, cr: 3,
			alignment: alignments.ce,
			environments: [ "desert", "grassland" ],
			id: "e5c7fbd0-16f6-47ab-a2b1-297a9baa140f",
		},
		{
			name: "Meenlock",
			size: "Small", type: "Fey",
			ac: 15, hp: 31, init: 2, cr: 2,
			alignment: alignments.ne,
			environments: [ "forest", "swamp", "urban" ],
			id: "21fd5290-e0e5-4ca7-85e6-729b083335ef",
		},
		{
			section: "Mind Flayers", name: "Alhoon",
			size: "Medium", type: "Undead",
			ac: 15, hp: 120, init: 1, cr: 10,
			alignment: alignments.any_evil,
			environments: [ "underdark" ],
			id: "2453a9e3-8aaa-4863-a50a-e2f0f2b91544",
		},
		{
			section: "Mind Flayers", name: "Mind Flayer Lich (Illithilich)",
			size: "Medium", type: "Undead", 
			ac: 17, hp: 135, init: 3, cr: 22,
			alignment: alignments.any_evil,
		 environments: [ "underdark" ],
			id: "41c4c37c-2cc1-4bd9-8332-2494f89d37fc",
		},
		{
			section: "Mind Flayers", name: "Elder Brain",
			size: "Large", type: "Aberration",
			ac: 10, hp: 210, init: 0, cr: 14,
			alignment: alignments.le,
			environments: [ "underdark" ],
			id: "c4a5e124-2aa6-40a5-800c-43148b0fbc99",
		},
		{
			section: "Mind Flayers", name: "Ulitharid",
			size: "Large", type: "Aberration", 
			ac: 15, hp: 127, init: 1, cr: 9,
			alignment: alignments.le,
			environments: [ "underdark" ],
			id: "839c78e4-80b5-4bb8-8520-a34dbe2bf267",
		},
		{
			section: "Mind Flayers", name: "Mindwitness",
			size: "Large", type: "Aberration",
			ac: 15, hp: 75, init: 2, cr: 5,
			alignment: alignments.le,
			environments: [ "underdark" ],
			id: "156b6bb2-0a7f-4cc6-b2bd-f5b169334c9e",
		},
		{
			name: "Morkoth",
			size: "Medium", type: "Aberration",
			ac: 17, hp: 130, init: 2, cr: 11,
			alignment: alignments.ce,
			environments: [ "coast", "underwater" ],
			id: "02054aad-6910-4e17-b22c-3d07b460240e",
		},
		{
			section: "Neogi", name: "Neogi Hatchling",
			size: "Tiny", type: "Aberration",
			ac: 11, hp: 7, init: 1, cr: "1/8",
			alignment: alignments.le,
			environments: [ "hill", "underdark" ],
			id: "6d22face-0a8c-425b-90f1-defd1b65405f",
		},
		{
			section: "Neogi", name: "Neogi",
			size: "Small", type: "Aberration", 
			ac: 15, hp: 33, init: 3, cr: 3,
			alignment: alignments.le,
			environments: [ "hill", "underdark" ],
			id: "5b0404ef-4495-498f-ab87-067e4c9d1e65",
		},
		{
			section: "Neogi", name: "Neogi Master",
			size: "Medium", type: "Aberration", 
			ac: 15, hp: 71, init: 3, cr: 4,
			alignment: alignments.le,
			environments: [ "hill", "underdark" ],
			id: "637e8b38-d786-4ca3-bb10-595c6b47cb6f",
		},
		{
			name: "Neothelid",
			size: "Gargantuan", type: "Aberration",
			ac: 16, hp: 325, init: -2, cr: 13,
			alignment: alignments.ce,
			environments: [ "underdark" ],
			id: "f69dd8f8-3e32-4353-89b1-76772d043145",
		},
		{
			name: "Nilbog",
			size: "Small", type: "Humanoid", tags: [ "Goblinoid" ], 
			ac: 13, hp: 7, init: 2, cr: 1,
			alignment: alignments.ce,
			environments: [ "hill", "underdark" ],
			id: "2daab424-8390-4a2e-a1f6-c9d64c46f417",
		},
		{
			section: "Orcs", name: "Orc Blade of Ilneval",
			size: "Medium", type: "Humanoid", tags: [ "Orc" ], 
			ac: 18, hp: 60, init: 0, cr: 4,
			alignment: alignments.ce,
			environments: [ "forest", "grassland", "hill", "mountain", "underdark" ],
			id: "809eb1b7-e519-4541-8627-04045700ec5a",
		},
		{
			section: "Orcs", name: "Orc Claw of Luthic",
			size: "Medium", type: "Humanoid", tags: [ "Orc" ], 
			ac: 14, hp: 45, init: 2, cr: 2,
			alignment: alignments.ce,
			environments: [ "mountain", "underdark" ],
			id: "e4315ee2-bbef-4aac-9fe3-98e581b72bb3",
		},
		{
			section: "Orcs", name: "Orc Hand of Yurtrus",
			size: "Medium", type: "Humanoid", tags: [ "Orc" ], 
			ac: 12, hp: 30, init: 0, cr: 2,
			alignment: alignments.ce,
			environments: [ "forest", "grassland", "hill", "mountain", "underdark" ],
			id: "ace61424-ca9f-4ad8-abb9-2c69f8d051db",
		},
		{
			section: "Orcs", name: "Orc Nurtured One of Yurtrus",
			size: "Medium", type: "Humanoid", tags: [ "Orc" ], 
			ac: 9, hp: 30, init: -1, cr: "1/2",
			alignment: alignments.ce,
			environments: [ "forest", "grassland", "hill", "mountain", "underdark" ],
			id: "fb666504-a649-459d-a774-ca6505e12fef",
		},
		{
			section: "Orcs", name: "Orc Red Fang of Shargaas",
			size: "Medium", type: "Humanoid", tags: [ "Orc" ], 
			ac: 15, hp: 52, init: 3, cr: 3,
			alignment: alignments.ce,
			environments: [ "forest", "hill", "mountain", "underdark", "urban" ],
			id: "c59837a7-5864-417c-a778-2cf43e912857",
		},
		{
			section: "Orcs", name: "Tanarukk",
			size: "Medium", type: "Fiend", tags: [ "Demon", "Orc" ], 
			ac: 14, hp: 95, init: 1, cr: 5,
			alignment: alignments.ce,
			environments: [ "hill", "mountain", "underdark" ],
			id: "e976e397-075c-4771-93b7-70982088dcdd",
		},
		{
			name: "Quickling",
			size: "Tiny", type: "Fey",
			ac: 16, hp: 10, init: 6, cr: 1,
			alignment: alignments.ce,
			environments: [ "forest" ],
			id: "7c9f42e8-b973-40e0-8870-5c947af01d9f",
		},
		{
			name: "Redcap",
			size: "Small", type: "Fey",
			ac: 13, hp: 45, init: 1, cr: 3,
			alignment: alignments.ce,
			environments: [ "forest", "hill", "swamp" ],
			id: "59d3c891-5410-4111-9763-ad8aa4aed76d",
		},
		{
			name: "Sea Spawn",
			size: "Medium", type: "Humanoid",
			ac: 11, hp: 32, init: -1, cr: 1,
			alignment: alignments.ne,
			environments: [ "coast", "underwater" ],
			id: "c133c8f1-0c56-4559-9d65-e5670f03ee51",
		},
		{
			name: "Shadow Mastiff",
			size: "Medium", type: "Monstrosity",
			ac: 12, hp: 33, init: 2, cr: 2,
			alignment: alignments.ne,
			environments: [ "forest", "hill", "swamp" ],
			id: "24d66847-cd56-4edf-a8c9-2973df80b051",
		},
		{
			name: "Shadow Mastiff Alpha",
			size: "Medium", type: "Monstrosity",
			ac: 12, hp: 48, init: 2, cr: 2,
			alignment: alignments.ne,
			environments: [ "forest", "hill", "swamp" ],
			id: "3538794e-d8ff-426f-9019-04bbcd08397b",
		},
		{
			name: "Slithering Tracker",
			size: "Medium", type: "Ooze",
			ac: 14, hp: 32, init: 4, cr: 3,
			alignment: alignments.ce,
			environments: [ "underdark", "urban" ],
			id: "3020ee17-2fc0-473d-a8e3-f730c05bc935",
		},
		{
			name: "Spawn of Kyuss",
			size: "Medium", type: "Undead",
			ac: 10, hp: 76, init: 0, cr: 5,
			alignment: alignments.ce,
			environments: [ "desert", "underdark" ],
			id: "4d268c1d-293b-4351-b849-6fbb79aeae8a",
		},
		{
			name: "Tlingcalli",
			size: "Large", type: "Monstrosity",
			ac: 15, hp: 85, init: 1, cr: 5,
			alignment: alignments.ne,
			environments: [ "desert" ],
			id: "33f3dc3e-b613-42c0-b39c-679ef86fd3d8",
		},
		{
			name: "Trapper",
			size: "Large", type: "Monstrosity",
			ac: 13, hp: 85, init: 0, cr: 3,
			alignment: alignments.unaligned,
			environments: [ "underdark" ],
			id: "49058685-76c7-40bd-9d54-cf1f129b4232",
		},
		{
			name: "Vargouille",
			size: "Tiny", type: "Fiend",
			ac: 12, hp: 13, init: 2, cr: 1,
			alignment: alignments.ce,
			environments: [ "desert", "swamp", "underdark" ],
			id: "50d25ff2-2415-4ecd-a613-888faa8e2297",
		},
		{
			section: "Vegepygmies", name: "Vegepygmy",
			size: "Small", type: "Plant",
			ac: 13, hp: 9, init: 2, cr: "1/4",
			alignment: alignments.n,
			environments: [ "forest", "swamp" ],
			id: "88fc8e6f-80d2-4a2c-8de8-8fe8c20dd7e1",
		},
		{
			section: "Vegepygmies", name: "Vegepygmy Chief",
			size: "Small", type: "Plant",
			ac: 14, hp: 33, init: 2, cr: 2,
			alignment: alignments.n,
			environments: [ "forest", "swamp" ],
			id: "483f3c15-a707-4ef1-8e37-6d1168d7b404",
		},
		{
			name: "Thorny",
			size: "Medium", type: "Plant",
			ac: 14, hp: 27, init: 1, cr: 1,
			alignment: alignments.n,
			environments: [ "forest", "swamp" ],
			id: "a8c83916-acbc-4a73-9c9b-cf75d187611a",
		},
		{
			name: "Wood Woad",
			size: "Medium", type: "Plant",
			ac: 18, hp: 75, init: 1, cr: 5,
			alignment: alignments.ln,
			environments: [ "forest" ],
			id: "7d758025-5f81-4ac7-a59e-6fca8774d61d",
		},
		{
			section: "Xvarts", name: "Xvart",
			size: "Small", type: "Humanoid", tags: [ "Xvart" ], 
			ac: 13, hp: 7, init: 2, cr: "1/8",
			alignment: alignments.ce,
			environments: [ "hill", "underdark" ],
			id: "c6323018-2f32-49bd-8b94-2889024f4dbc",
		},
		{
			section: "Xvarts", name: "Xvart Speaker",
			size: "Small", type: "Humanoid", tags: [ "Xvart" ], 
			ac: 13, hp: 7, init: 2, cr: "1/8",
			alignment: alignments.ce,
			environments: [ "hill", "underdark" ],
			id: "6746c13c-6bb1-4e96-8dd1-b0027e8683c8",
		},
		{
			section: "Xvarts", name: "Xvart Warlock of Raxivort",
			size: "Small", type: "Humanoid", tags: [ "Xvart" ], 
			ac: 12, hp: 22, init: 2, cr: 1,
			alignment: alignments.ce,
			environments: [ "hill", "underdark" ],
			id: "9af47702-ffc4-4555-a977-7d1339b59933",
		},
		{
			name: "Yeth Hound",
			size: "Large", type: "Fey",
			ac: 14, hp: 51, init: 3, cr: 4,
			alignment: alignments.ne,
			environments: [ "forest", "grassland", "hill" ],
			id: "65451d58-1f95-4b9b-9fd0-d6c5205edf42",
		},
		{
			section: "Yuan-ti", name: "Yuan-ti Anathema",
			size: "Huge", type: "Monstrosity", tags: [ "Shapechanger", "Yuan-ti" ], 
			ac: 16, hp: 189, init: 1, cr: 12,
			alignment: alignments.ne,
			environments: [ "desert", "forest", "underdark" ],
			id: "104b98f3-efa1-4403-bda1-e26350fcd23c",
		},
		{
			section: "Yuan-ti", name: "Yuan-ti Broodguard",
			size: "Medium", type: "Humanoid", tags: [ "Yuan-ti" ], 
			ac: 14, hp: 45, init: 2, cr: 2,
			alignment: alignments.ne,
			environments: [ "desert", "forest", "underdark" ],
			id: "1f60a7d3-7592-41cc-92d3-a696addde426",
		},
		{
			section: "Yuan-ti", name: "Yuan-ti Mind Whisperer",
			size: "Medium", type: "Monstrosity", tags: [ "Shapechanger", "Yuan-ti" ], 
			ac: 14, hp: 71, init: 2, cr: 4,
			alignment: alignments.ne,
			environments: [ "desert", "forest", "underdark" ],
			id: "6c82d15c-907b-48e0-8866-dcb7f3e4cd0c",
		},
		{
			section: "Yuan-ti", name: "Yuan-ti Nightmare Speaker",
			size: "Medium", type: "Monstrosity", tags: [ "Shapechanger", "Yuan-ti" ], 
			ac: 14, hp: 71, init: 2, cr: 4,
			alignment: alignments.ne,
			environments: [ "desert", "forest", "underdark" ],
			id: "16795632-bba4-48e3-86cd-08d66cbdd4b5",
		},
		{
			section: "Yuan-ti", name: "Yuan-ti Pit Master",
			size: "Medium", type: "Monstrosity", tags: [ "Shapechanger", "Yuan-ti" ], 
			ac: 14, hp: 88, init: 2, cr: 5,
			alignment: alignments.ne,
			environments: [ "desert", "forest", "underdark" ],
			id: "cc9084c4-a3ed-4ffd-9273-e68a03b5b40f",
		},

		// Volo's Guide to Monsters: Appendix A: Assorted Beasts

		{
			name: "Aurochs",
			size: "Large", type: "Beast",
			ac: 11, hp: 38, init: 0, cr: 2,
			alignment: alignments.unaligned,
			environments: [ "grassland", "hill", "mountain" ],
			id: "fadbf43c-75c4-49e1-95f7-99675ee7f93c",
		},
		{
			name: "Cow",
			size: "Large", type: "Beast",
			ac: 10, hp: 15, init: 0, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "urban" ],
			id: "f7def5c8-1b2c-4a36-8bb6-c87c74053dbd",
		},
		{
			name: "Cow (Ox)",
			size: "Large", type: "Beast",
			ac: 10, hp: 15, init: 0, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "urban" ],
			id: "8c8e238a-0c86-43d0-aa45-7860b9da17aa",
		},
		{
			name: "Rothe",
			size: "Medium", type: "Beast",
			ac: 10, hp: 13, init: 0, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "grassland", "underdark" ],
			id: "e8defb89-88b4-49e7-b636-6aa98ce0974a",
		},
		{
			name: "Stench Kow",
			size: "Large", type: "Beast",
			ac: 10, hp: 15, init: 0, cr: "1/4",
			alignment: alignments.unaligned,
			environments: [ "grassland" ],
			id: "9140ec74-c6cb-453d-b9fa-624a177aa84a",
		},
		{
			name: "Dolphin",
			size: "Medium", type: "Beast",
			ac: 12, hp: 11, init: 1, cr: "1/8",
			alignment: alignments.unaligned,
			environments: [ "coast", "underwater" ],
			id: "6797c463-8d3a-4bda-8073-db40a364a058",
		},
		{
			name: "Swarm of Rot Grubs",
			size: "Medium", type: "Beast", tags: [ "Swarm" ], 
			ac: 8, hp: 22, init: -2, cr: "1/2",
			alignment: alignments.unaligned,
			environments: [ "swamp", "underdark" ],
			id: "073f64fe-97e3-4d24-b203-fa511db582cc",
		},

		// Volo's Guide to Monsters: Appendix B: Nonplayer Characters

		{
			name: "Abjurer",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 12, hp: 84, init: 2, cr: 9,
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "c59317ff-3950-4548-8a5c-29f6977f0d62",
		},
		{
			name: "Apprentice Wizard",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 10, hp: 9, init: 0, cr: "1/4",
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "b2e98789-523a-44fb-83c1-0e73e53c4c82",
		},
		{
			name: "Archdruid",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 16, hp: 132, init: 2, cr: 12,
			alignment: alignments.any,
			environments: [ "forest", "mountain", "swamp", "underwater" ],
			id: "a00e226f-91a2-4332-ba45-8b0ae5e5ebfc",
		},
		{
			name: "Archer",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 16, hp: 75, init: 4, cr: 3,
			alignment: alignments.any,
			environments: [ "forest", "urban" ],
			id: "9a3c941c-98a8-4bb8-9710-0b3edf4edf1d",
		},
		{
			name: "Bard",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 15, hp: 44, init: 2, cr: 2,
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "54fb5ff9-91ef-4060-abf5-86d4c0913c32",
		},
		{
			name: "Blackguard",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 18, hp: 153, init: 0, cr: 8,
			alignment: alignments.non_good,
			environments: [ "underdark", "urban" ],
			id: "732330e6-817c-4de6-8e8e-b702f260761f",
		},
		{
			name: "Champion",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 18, hp: 143, init: 2, cr: 9,
			alignment: alignments.any,
			environments: [ "desert", "urban" ],
			id: "fbe8bd0e-da21-4096-a08f-49d414fbeaa9",
		},
		{
			name: "Conjurer",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 12, hp: 40, init: 2, cr: 6,
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "e207f392-8307-4b67-968b-f49fe8ba7cf2",
		},
		{
			name: "Diviner",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 12, hp: 67, init: 2, cr: 8,
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "1af0dad1-0468-4fe7-a53c-2d75420bf202",
		},
		{
			name: "Enchanter",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 12, hp: 40, init: 2, cr: 5,
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "ccf03973-5098-478b-9573-6cd0d039b226",
		},
		{
			name: "Evoker",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 12, hp: 66, init: 2, cr: 9,
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "a39711ac-adde-4465-8b28-f2a0247def78",
		},
		{
			name: "Illusionist",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 12, hp: 38, init: 2, cr: 3,
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "fd3b4e47-8210-4d3a-9571-431c164c2747",
		},
		{
			name: "Kraken Priest",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 10, hp: 75, init: 0, cr: 5,
			alignment: alignments.any,
			environments: [ "coast", "underwater" ],
			id: "c128a8c7-997b-44a5-805c-f718cf90953f",
		},
		{
			name: "Martial Arts Adept",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 16, hp: 60, init: 3, cr: 3,
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "69b0d522-7ad1-4909-86f5-a8f716afd9d0",
		},
		{
			name: "Master Thief",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 16, hp: 84, init: 4, cr: 5,
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "6272a878-47ee-43b8-99be-0fbc5af1a8e2",
		},
		{
			name: "Necromancer",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 12, hp: 66, init: 2, cr: 9,
			alignment: alignments.any,
			environments: [ "desert", "urban" ],
			id: "c3ccfd43-a212-4181-b175-c65ff82a6fcc",
		},
		{
			name: "Swashbuckler",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 17, hp: 66, init: 4, cr: 3,
			alignment: alignments.non_lawful,
			environments: [ "coast", "urban", ],
			id: "51d8819f-c57b-4fa3-8efc-f98c665e0683",
		},
		{
			name: "Transmuter",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 12, hp: 40, init: 2, cr: 5,
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "583e060b-a8a2-48e4-8474-cdcdf09da2fa",
		},
		{
			name: "War Priest",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 18, hp: 117, init: 0, cr: 9,
			alignment: alignments.any,
			environments: [ "desert", "urban" ],
			id: "246cfb3f-20e8-40f9-ba67-3a6909231608",
		},
		{
			name: "Warlock of the Archfey",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 11, hp: 49, init: 1, cr: 4,
			alignment: alignments.any,
			environments: [ "arctic",  "forest", "mountain", "swamp", "urban" ],
			id: "55ebdcc0-9888-43c8-a018-452f9f6f8bed",
		},
		{
			name: "Warlock of the Fiend",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 12, hp: 78, init: 2, cr: 7,
			alignment: alignments.any,
			environments: [ "arctic", "desert", "underdark", "urban" ],
			id: "8c42b1a6-9628-4846-a720-d10860de5c57",
		},
		{
			name: "Warlock of the Great Old One",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 12, hp: 91, init: 2, cr: 6,
			alignment: alignments.any,
			environments: [ "arctic", "hill", "mountain", "underdark", "urban" ],
			id: "e17a93a4-e1b1-4919-b10c-d033db5918d2",
		},
		{
			name: "Warlord",
			section: "NPCs",
			size: "Medium", type: "Humanoid", tags: [ "Any Race" ], 
			ac: 18, hp: 229, init: 3, cr: 12,
			alignment: alignments.any,
			environments: [ "urban" ],
			id: "934ebd78-8ec6-46f4-86d7-e079209102b8",
		},
		];
	};
})();
(function () {
	"use strict";

	angular.module('app')
		.factory('outoftheabyssSource', Source);

	function Source() {
		return {
			name: "Out of the Abyss",
			shortName: "Abyss",
			initialState: true,
			contents: [
				[ "dd01bced-063c-41cb-ba10-1c933b9d9d88", 224], // Derro
				[ "df38742a-fad9-4039-a501-cf5149f2254e", 225], // Ixitxachitl
				[ "8ccf2d1c-a9d9-48af-a91b-cceb1cd258cc", 226], // Vampiric Ixitxachitl
				[ "001aaabc-e829-4e64-8877-7b8db8d205d6", 227], // Duergar Soulblade
				[ "2efccc81-8f74-45ff-8ccc-241552884efd", 227], // Duergar Stone Guard
				[ "0541ae2c-244b-4a26-92c6-d32df0a581ab", 228], // Duergar Xarrorn
				[ "eafb811a-c73d-4799-84cf-dd86bd50b79f", 228], // Chuul Spore Servant
				[ "62d870d7-71d3-45b8-a129-db41d42b2dd7", 229], // Drow Spore Servant
				[ "14123d05-16e0-4045-ba6b-b022bd5845e4", 229], // Duergar Spore Servant
				[ "39171a85-e224-425b-ac84-19d6996efe0e", 229], // Hook Horror Spore Servant
				[ "00a707e5-c44c-43ad-9568-e576abe476a1", 229], // Troglodyte Champion of Laogzed
				[ "4685b839-bb7b-47d2-8f3e-a31552bd37fc", 230], // Bridesmaid of Zuggtmoy
				[ "dc3ee8c2-b9e6-43e7-b1c2-866dd293223a", 230], // Chamberlain of Zuggtmoy
				[ "24206108-08c1-42cd-9a3d-d0223545d586", 231], // Female Steeder
				[ "d9af029b-c451-4d74-bbf8-8fb25fdd609b", 231], // Male Steeder
				[ "dadd100d-b2ae-4683-8010-0cab2bbc5377", 231], // Droki
				[ "fbd25f01-f510-4790-b778-5e5313ad6a2b", 232], // Grisha
				[ "516ba46d-27c1-4f5b-afc3-a4b216c88d52", 232], // Narrak
				[ "5772d898-4440-4583-b157-73714db987db", 233], // The Pudding King
				[ "e49a7f28-3cf5-4778-b316-0b9fed11cca6", 233], // Yestabrod
				[ "d4ceb2aa-9505-443c-b76f-290f6a926df3", 235], // Baphomet
				[ "7346e68c-5d9c-47d2-9e14-d6b6f809adba", 236], // Demogorgon
				[ "deabbe0c-ec60-4eee-87ed-2e02a5961892", 238], // Fraz-Urb'luu
				[ "02e1b0f5-912e-447c-8118-4946a0c57ef4", 241], // Graz'zt
				[ "67fe91fb-6a04-41ba-9efe-7ebd5bec55b4", 243], // Juiblex
				[ "d6b88949-50e7-4b5f-b15a-7541485cfa62", 245], // Orcus
				[ "d6d31cb2-1b0a-4953-8301-4c16cb51434e", 247], // Yeenoghu
				[ "14a4af4f-0916-4015-9006-5c71985b07c5", 249], // Zuggtmoy

			],  
		}
	}
})();
(function() {
	"use strict";

	angular.module('app')
		.factory('playershandbookSource', Source);

	function Source() {
		return {
			name: "Player's Handbook",
			shortName: "PHB",
			initialState: true,
			contents: [
				[ "afee8041-1219-4d31-931d-3c3a08b0b449", 304 ], // Bat
				[ "a233bc77-4107-456a-89d2-9d91b4ada1a2", 304 ], // Black Bear
				[ "14ef11ed-2340-46de-a4eb-e9932f839f5d", 304 ], // Boar
				[ "197d96a0-a8c4-48be-af3d-6174ac281afb", 304 ], // Brown Bear
				[ "8db064e4-cca6-4757-b558-a7f122ddf06f", 305 ], // Cat
				[ "5ed4761c-b22d-4873-9ad3-31344c34819b", 305 ], // Constrictor Snake
				[ "604dfa7a-4b77-4633-a3ce-83e2c073e0d4", 305 ], // Crocodile
				[ "9a507770-7644-4486-b73e-ca04b78d2e43", 305 ], // Dire Wolf
				[ "303172de-265f-4046-bf47-2aff0f444f6e", 305 ], // Frog
				[ "a02c80fc-b950-4e71-be07-2a3b28a126a4", 306 ], // Giant Eagle
				[ "ceff6967-7d2c-4b84-9e2a-df1d36a9a98c", 306 ], // Giant Spider
				[ "d2ebaf9c-3be0-4c0c-ac98-c65e6d80b741", 306 ], // Hawk
				[ "c211c5fc-f71a-4e11-8c8b-71a6ae470eaa", 306 ], // Imp
				[ "2feb4531-2954-456c-bdf2-b320b1b8d1a3", 307 ], // Lion
				[ "216f1424-504a-4c7f-8a0a-478bbf97f1ef", 307 ], // Mastiff
				[ "40e39910-dd75-41ac-a5b2-217d3d4e81de", 307 ], // Mule
				[ "5b060b59-1142-4d65-9958-212dbce27820", 308 ], // Owl
				[ "777fa0ec-7cd3-497e-9a64-d5bf89ac6216", 308 ], // Panther
				[ "e23e499c-9022-482c-ae28-21790a692aab", 308 ], // Poisonous Snake
				[ "ada98bc9-cb5c-4f02-8230-a349f85df99c", 308 ], // Pseudodragon
				[ "05541b29-3f73-45f4-974c-6aabd25b4708", 309 ], // Quasit
				[ "b01dae8d-020f-4ee2-a80a-de7cb133de53", 309 ], // Rat
				[ "cda02d73-dca4-45bb-92cb-ad2092a27ea5", 309 ], // Raven
				[ "75d4dfd5-8942-4661-b8a8-3fbcaec7d1ab", 309 ], // Reef Shark
				[ "e02034e2-fe58-4c02-bdb6-9a54baf6e86b", 310 ], // Riding Horse
				[ "3e946348-1cc2-405f-9975-5a4c09445750", 310 ], // Skeleton
				[ "e91d49d6-b139-4457-bd9c-45fd656ec408", 310 ], // Sprite
				[ "d0a5fb54-32bb-4704-ac1a-862a175d333b", 311 ], // Tiger
				[ "8d0e875b-95f1-47a5-9d98-72ac4738c860", 311 ], // Warhorse
				[ "9e4c024d-0b8b-40c7-9e4a-2b447450ab4e", 311 ], // Wolf
				[ "ac42a801-316b-4f28-b552-592d7e751649", 311 ], // Zombie
			],
		}
	}
})();

(function() {
	"use strict";

	angular.module('app')
		.factory('primevalthuleSource', Source);

	function Source() {
		return {
			name: "Primeval Thule Campaign Setting",
			shortName: "ThuleCS",
			initialState: true,
			contents: [
				[ "2f347c0d-1e2a-40a7-8c1d-9f6d69c67341", 220 ], // Abominable Sloth
				[ "5b20ac3f-0200-4594-ad60-322a04fb5c6b", 220 ], // Crested Eagle
				[ "c65eb920-ad38-416b-949f-2e9639f764f7", 221 ], // Giant Viper
				[ "5b2de87c-1522-4dd3-a583-37bbb816c105", 221 ], // Mosasaur
				[ "3bd49b24-5cc9-46d3-9236-5a5f5de5f91e", 222 ], // Saber-Tooth Cat 
				[ "a9d19ad9-1422-4352-9be4-6f854ac116fb", 222 ], // Short-Faced Bear
				[ "25194f7f-ec20-4eb9-bd83-b2fa498c42fa", 223 ], // Thulean Elk
				[ "b4b35e33-1234-47b7-8ce8-c9262eec8b0d", 223 ], // Thulean Musk Ox
				[ "51dcb902-e803-4ad1-b9b9-2a8ef2d6d511", 224 ], // Beastman Warrior
				[ "00bc926e-7062-4f89-8b46-01b1ef39cf24", 224 ], // Beastman Hunter
				[ "d37c5ee8-99dc-4d06-9473-9614ad66427a", 225 ], // Beastman Cursemaker
				[ "ef71b8e7-87f1-4fc7-b7b4-842821178169", 225 ], // Beastman Warchief
				[ "81a79f9a-83be-48ee-bfd7-1a6d99db5f36", 226 ], // Black Circle Agent
				[ "a1bffaa9-aaf4-4a1c-ba3f-2c30857df62b", 227 ], // Black Circle Wizard
				[ "fdeb4efb-ee1e-41ae-96e5-1a769b5bf24f", 228 ], // Thulean Cyclops
				[ "baec7ee0-da28-4970-96a0-fff6691b97ca", 229 ], // Thulean Dragon
				[ "42e76b99-6891-4a05-9050-c855ca2b8ec1", 230 ], // Frost Corpse
				[ "4ca2cd2d-b92f-43a6-855a-6f8ace88ee53", 231 ], // Polar Eidolon
				[ "123ae354-398e-424f-9d34-83aea2bde199", 232 ], // Phoori Beastmaster
				[ "9086a812-5ea0-499b-a788-53ae04f74e05", 232 ], // Phoori Death Adder
				[ "2ecb6237-f292-4da1-9bf3-764d95163237", 233 ], // Phoori Dark Shaman
				[ "68b14ddd-d03b-4bdf-9ce3-d01f0d447dc2", 234 ], // Rakshasa Honor Guard
				[ "0fa5f768-2bb0-4610-96e9-86c9a34dc1be", 234 ], // Rakshasa Infiltrator
				[ "6d34402b-7585-4e42-88e9-5b4d264b4464", 235 ], // Rakshasa Raja
				[ "a44a009c-9cbc-49ad-b71a-8097deb66900", 235 ], // Rakshasa Swordspirit
				[ "37637f87-094e-4630-bf2d-877c5d42f350", 236 ], // Fang Guard
				[ "742e6ccb-1cd1-4be5-b1fe-7ec41ccf28a9", 236 ], // Nessk Champion
				[ "677dc348-edfd-4a53-80e4-e01df1621c08", 237 ], // Nessk Charmer
				[ "68da7346-cfeb-44c1-bc48-032d3d3169ed", 238 ], // Chosen Cultist
				[ "ea56770e-b167-4eec-9ac5-e1cb24b7a13d", 239 ], // Cult Priest
			
				[ "f7a7e0ac-02b1-444a-bf6e-5e22e3996906", 239 ], // Deep One Halfbreed
				[ "7f514635-f1a3-48e9-9113-8123bb65a330", 240 ], // Seven Knives Thug
				[ "290e225c-8c6f-47eb-bbfa-a0714602c307", 240 ], // Seven Knives Enforcer
				[ "26a646b8-778e-4fda-97ec-4d89918bfbb6", 241 ], // Seven Knives Darkblade
				[ "0b996fb5-45ff-4987-9d42-f335afd254a9", 241 ], // The Fourth Knife
				[ "baddf11a-ca9a-4fb7-9a79-72b16173b5eb", 242 ], // Winged Ape
				[ "109195a8-ae98-4586-8938-1d6126a9fb6e", 243 ], // Dark Servant of Carcosa
				[ "bc609213-a5b9-4d58-bbd6-8b8aec4323c8", 244 ], // Gnoph-Keh of Serex
				[ "65b39c43-194e-4ecc-ab80-19ef9bc0dc18", 244 ], // Mi-Go, Starcrown
				[ "00ba1c71-e904-4503-b1cb-56ce666a13e0", 245 ], // Moon-Beast
				[ "a0e3b279-b1a2-440b-85fb-7e7e7b57b491", 246 ], // Nightgaunt, Khoori
				[ "220a3d06-2097-4406-982b-b1335510694a", 246 ], // Shoggoth
				[ "96d32e9c-bd4c-41fd-854e-4a0621a72c30", 247 ], // Star-Thing of Nheb
				[ "1192d10f-9d8c-4c6c-8b3f-df8b9773107b", 248 ], // Dhuoth, Giver of Eyes
				[ "544831b9-2060-458d-aa18-c087437d8e73", 249 ], // Plague Nomad
				[ "e5a27b73-6905-4367-a2a3-109c1d480732", 250 ], // Lorthnu'un of the Golden Chalice
				[ "1e6f0d8b-a6f7-4fe5-b3ad-b642df2838a2", 251 ], // Slave of the Chalice
				[ "b2d31698-c47d-4330-a1b4-b36e58c061bc", 252 ], // Kelauklyth
				[ "575568dd-1e67-4784-99f6-907680c10ba3", 252 ], // The Kelauble
				[ "90a561bd-512e-486d-a146-3dad6ae2ef59", 253 ], // Mador Kheb, Priest of Set
				[ "b2b24fcc-f0f4-4797-a868-4ee55e73aa8e", 253 ], // Temple Guard of Set
				[ "84ae5fcf-674c-4bf8-b943-5e33b972a396", 254 ], // Nephys
				[ "5c731d9a-6e8a-4109-b5db-5695fce83754", 255 ], // Ruuk Nath
			],
		}
	}
})();
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
(function() {
	"use strict";

	angular.module('app')
		.factory('princesSource', Source);

	function Source() {
		return {
			name: "Princes of the Apocalypse",
			shortName: "Apoc",
			initialState: true,
			contents: [
				[ "feadfec7-96a7-4ff2-8b22-6f6ab232d6d5", 189], // Feathergale knight
				[ "0ba96911-ae8f-4a67-ab56-e206b404a16c", 190], // Howling Hatred Initiate
				[ "d54be24f-498d-41b6-9947-fe0d3eab8bda", 190], // Howling Hatred Priest
				[ "64954fd2-b46e-4c35-95b4-4c6ff153fb41", 191], // Hurricane
				[ "a04fcf2a-bcce-4bce-b0d1-d8421034ef57", 191], // Skyweaver
				[ "b556c163-d83e-480e-b43c-20719bc337aa", 192], // Thurl Merosska
				[ "58a87589-0a1c-4d4c-9874-e61d7bbff92b", 192], // Windharrow
				[ "42e798b0-d4ce-48d8-9e2e-eb12b44ec2f9", 192], // Aerisi Kalinoth
				[ "110da8de-4ec0-4b5e-b531-c8a34d355a4b", 192], // Aerisi Kalinoth (in lair)
				[ "e677e29f-eba3-44ae-ae6e-47c5141291e1", 195], // Black Earth Guard
				[ "3a6fb726-4468-49fe-b079-1ca3daf8794d", 195], // Black Earth Priest
				[ "6511413e-afd9-425d-a2d8-13c245bfff9a", 196], // BurrowShark
				[ "7bfeb1e6-6ad4-4e1d-9565-993782b70f68", 196], // Sacred Stone Monk
				[ "8468bebf-a893-41c9-9a52-63097a71535b", 197], // Stonemelder
				[ "808b9d5b-9de0-4692-88b3-c3c589cd04c2", 198], // Hellrae
				[ "474f3c52-7a41-4ffa-a882-42fa94b83fda", 198], // Miraj Vizann
				[ "d4f4981c-f46b-4a18-a9c0-62bda3aee9b0", 199], // Marlos Urnrayle
				[ "21d312b3-de51-492a-966c-235c76960ff2", 199], // Marlos Urnrayle (in lair)
				[ "11506c53-58eb-4732-a877-570ed1fb4408", 200], // Eternal Flame Guardian
				[ "81ff5c00-72f3-4225-96a4-0453a57aff9c", 200], // Eternal Flame Priest
				[ "530d4e60-7c5f-4d84-aff8-608a033ec85f", 201], // Flamewrath
				[ "f71b3427-cb38-4e49-afab-1e23f67c64a2", 201], // Razerblast
				[ "952018b8-9f08-4f18-827e-2dcd7e5e367a", 201], // Bastian Thermandar
				[ "19bb278f-988d-4c48-9fde-10e4ff357c19", 202], // Elizar Dryflagon
				[ "b2def732-06fb-483d-b0bd-41977e9726a4", 203], // Vanifer
				[ "8e7bb425-8d3b-4051-8dc8-40fd31a79f12", 203], // Vanifer (in lair)
				[ "10a656be-585c-4e2d-89fc-a44d742c0650", 205], // Crushing Wave Priest
				[ "0d17db23-30dd-4e07-9b8f-1ea31879a5f4", 205], // Crushing Wave Reaver
				[ "f276978d-37ac-4acd-9559-52d3281365c6", 205], // Dark Tide Knight
				[ "151a7399-6612-4424-8a67-da8419f2af1d", 207], // Fathomer
				[ "eb3c332a-e5c8-4a50-a212-bc6041ceec4d", 207], // One-Eyed Shiver
				[ "9653c256-e429-491a-82a4-14a7d35ccc7d", 208], // Shoalar Quanderil
				[ "77336909-5839-48c4-954d-3eaf416dc729", 208], // Gar Shatterkeel
				[ "9b6c6412-5a3d-4ff1-8151-376eac201182", 208], // Gar Shatterkeel (in lair)
				[ "c0ac9048-9d40-418a-b3b1-cdc58843e1cb", 210], // Drannin Splithelm
				[ "788ad772-47f1-442f-a7f8-74988b191b11", 210], // Ghald
				[ "e1c70697-6681-42a7-9289-dcc8d441d422", 212], // Oreioth
				[ "489ae12c-5439-4bc0-8f7c-ab354a7bf3f3", 212], // Wiggan Nettlebee
				[ "e3d1956e-2243-4e4f-9794-ed71f0160122", 212], // Air Elemental Myrmidon
				[ "f8ae5941-9f22-4089-a9ea-43c0163771c1", 212], // Earth Elemental Myrmidon
				[ "a52b610e-729b-42bd-b124-62835ed4932b", 213], // Fire Elemental Myrmidon
				[ "c7d911b4-2ae2-4314-949e-df469804c176", 213], // Water Elemental Myrmidon
				[ "83b24acd-ca3b-416c-b66e-aa750c33581f", 514], // Imix
				[ "b7d4b220-33f9-4326-beaa-a0935acc4f64", 216], // Ogrémoch
				[ "6cea5f48-7326-4c1e-bbeb-b117997c4d95", 218], // Olhydra
				[ "1dd55750-d131-4b9b-998b-d1ce9833e82b", 221], // Yan-C-Bin
			],
		}
	}
})();
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

(function() {
	"use strict";

	angular.module('app')
		.factory('rotSource', Source);

	function Source() {
		return {
			name: "Rise of Tiamat",
			shortName: "Tiamat",
			initialState: true,
			contents: [
				[ "14062b7c-449d-4dd8-b936-e6c3054bc4dd", 89 ], // Dragonfang
				[ "e69f331d-95ce-4ce4-a45e-ffea0ffc0892", 89 ], // Dragonsoul
				[ "1280e58c-b863-4b7a-9753-359b3c76ef86", 90 ], // Dragonwing
				[ "b47a1d38-ae42-4c8a-bd89-4cf83cdfc99e", 90 ], // Ice Toad
				[ "7e036002-2280-456a-82de-821060bebc86", 90 ], // Naergoth Bladelord
				[ "652fe147-4367-4aa9-bf37-63ff054d034f", 91 ], // Neronvain
				[ "decbfdf7-40a4-400c-9dad-92ca6869153d", 92 ], // Severin
				[ "ed941a4e-0d5f-449e-973c-50f1e737501a", 92 ], // Tiamat

				// also in: Hoard of the Dragon Queen
				[ "ddb767bf-4484-4d5e-b54d-b03a6f9c6795", 89 ], // Dragonclaw
				[ "8f11d800-1103-492b-ae24-320ef1013644", 90 ], // Guard Drake
				[ "8db8b7f3-375c-4e14-abd5-f26e6622f330", 91 ], // Rath Modar
			],
		}
	}
})();
(function() {
	"use strict";

	angular.module('app')
		.factory('stormkingsthunderSource', Source);

	function Source() {
		return {
			name: "Storm King's Thunder",
			shortName: "StrmKing",
			initialState: true,
			contents: [
				[ "28c8c457-5a31-4c0d-9ffe-e42c8bb47d8b", 240 ], // Crag Cat 
				[ "0a8b2f8f-16f5-4d79-8c56-fb28fdcb7b71", 240 ], // Hulking Crab
				[ "c5aab99f-f1f2-45d0-872b-645a9d5d41d6", 241 ], // Iymrith the Dragon
				[ "7815b4c9-71e0-49a9-be1b-cb8caf448695", 241 ], // Maegera the Dawn Titan
				[ "10580eaf-7424-46d8-a827-fb681e914fcb", 242 ], // Purple Wormling
				[ "71b533e5-d65f-4fc9-b447-98aef9833200", 242 ], // Tressym
				[ "3e739adc-919f-4908-976d-292e6a77c39e", 243 ], // Uthgardt Shaman
				[ "8c4a7dd1-3e38-4ef5-ad17-d9d81590e202", 244 ], // Yakfolk Warrior
				[ "0ac2d7e7-8936-4e86-8d41-5fb7b9fa82be", 245 ], // Yakfolk Priest
			],
		}
	}
})();
(function() {
	"use strict";

	angular.module('app')
		.factory('tomeofbeastsSource', Source);

	function Source() {
		return {
			name: "Tome of Beasts",
			shortName: "ToB",
			initialState: true,
			contents: [
				[ "fcd7e583-025c-412e-a35f-7ba1c5843206", 8 ], // Aboleth, Nihileth
				[ "49945869-1d13-4bdf-9f15-dffdc93aeeb4", 9 ], // Nihilethic Zombie
				[ "1a633d85-3731-4a4d-8c9e-a536d9adfad6", 11 ], // Abominable Beauty
				[ "3c3d5ba0-b614-4566-aaaa-95fc0c8d961f", 12 ], // Accursed Defiler
				[ "3ce5021d-916a-443d-a310-c41dfd8a3580", 13 ], // Ala
				[ "1e860d7b-4e49-4f53-81e0-7dba9c83555b", 14 ], // Algorith
				[ "c642e6fe-042c-4286-b0f9-b150b31bc284", 15 ], // Alseid
				[ "ced91f29-a25f-4964-838e-a870b9997862", 15 ], // Alseid Grovekeeper
				[ "90ff1f35-d729-4844-abed-fd54471d6e8c", 16 ], // Amphiptere
				[ "b2434c8b-600d-47ed-b3cd-4cc60718aa3f", 17 ], // Andrenjinyi
				[ "d50661d0-ae1e-424e-a25e-6431db6bc3cf", 19 ], // Angatra
				[ "5ae8fdbc-34b8-4a42-b737-72b0ac88111e", 20 ], // Chained Angel
				[ "e4b1e894-6d70-43bb-afe7-8f51cd8a69a8", 21 ], // Fidele 
				[ "7c81fe4e-ee03-46a9-92f4-51beef2e627f", 22 ], // Angler Worm
				[ "ded2487d-834b-40c2-b5d1-a4a3fca49ed5", 23 ], // Giant Ant
				[ "e7f62072-f6da-4e2f-98ab-d319a99f70e9", 23 ], // Giant Ant Queen
				[ "e9e27407-0f34-477c-bf29-5b467dd8688d", 24 ], // Anubian
				[ "0d31b96c-68c9-467c-b193-24ab298f9301", 25 ], // Arboreal Grappler
				[ "5ebbc6d7-8854-4aa6-8aee-7ee021327a25", 26 ], // Aridni
				[ "98620d9d-449e-4459-ab8b-328aeec551a7", 27 ], // Asanbosam
				[ "b1a5f8d4-b1c1-4f4b-8079-3124445f3d56", 28 ], // Azza Gremlin

				[ "267e5321-57ba-4bef-880e-95b1fadcaf2f", 29 ], // Baba Yagas Horsemen
				[ "9024f9d0-bab8-4d68-8414-62550e8f2171", 31 ], // Bagiennik
				[ "b28a0279-4cc4-4cec-a11a-4dc9afb93e55", 32 ], // Bastet Temple Cat
				[ "13ccff69-326d-4414-984b-a7e5407eb71b", 33 ], // Bearfolk
				[ "d4d6352d-b990-4c99-9f9d-ab5c5ba159a4", 34 ], // Behtu
				[ "e301d09b-5c14-45cc-bc8c-c3a2489095b8", 35 ], // Beli
				[ "9c8588ee-09b7-44fa-b772-2ea263f28e6c", 36 ], // Bereginyas
				[ "af3a3b15-91d9-464d-85d7-abf95204a27a", 37 ], // Blemmyes
				[ "f36499ae-b897-427c-87b5-c60d63c9f68b", 38 ], // Boloti
				[ "5b6e8646-2883-4816-b406-6ffb609d3a48", 39 ], // Bone Collective
				[ "f28d1e74-980d-4ef1-912a-68e23b3bbe95", 40 ], // Bone Crab 
				[ "cdf3875f-178a-4a99-bcb5-15fabc681244", 41 ], // Bone Swarm
				[ "12a75eb1-cddd-4af7-9afd-94d639bc40e1", 42 ], // Boreas
				[ "83d71bdd-22d2-4206-8e5d-c6009f6d31ff", 44 ], // Bouda
				[ "d32bb8f5-ec73-4b91-a5f6-266466720410", 45 ], // Broodiken
				[ "9f5ab0a9-5c7c-4e6c-a26f-dc00b32c4523", 46 ], // Bucca
				[ "4184047d-c775-4d83-8577-cac0bffa6a1c", 47 ], // Bukavac
				[ "54c396e9-6b6d-4463-bf45-2e83a01e4ef5", 48 ], // Buraq
				[ "89f9f934-37cb-40f2-b3c1-188df4a4a08e", 49 ], // Burrowling
				
				[ "674fd6b5-592f-4717-9b03-177c1cf4f5bf", 50 ], // Cactid
				[ "e6f3dd42-c20b-495d-a760-a6f4d8505e99", 51 ], // Cambium
				[ "b1c14b61-f2db-475c-b900-4d2ccc2a8fc1", 52 ], // Carrion Beetle
				[ "0a40557f-8f49-47c7-823b-139cd49a4d2f", 53 ], // Cavelight Moss
				[ "5cb25d80-ed86-4817-af6a-4d934b9a633b", 54 ], // Chelicerae
				[ "8a8dfede-f0b5-4173-9aac-dd3bd9d08077", 55 ], // Chernomoi
				[ "0f659c11-520c-4ce5-a957-d2409ccac868", 56 ], // Child of the Briar
				[ "991dd272-dc07-47e6-8b5f-707d1099ceee", 57 ], // Chronalmental
				[ "4faaaab2-447c-4fe1-a1b5-fc5487e4311f", 58 ], // Cikavak
				[ "4af41011-a054-40e9-aae0-827aa8a7a198", 59 ], // Clockwork Abomination
				[ "7ba732bf-d9ba-44e3-9ac7-db55bb55c17b", 60 ], // Clockwork Beetle
				[ "c96276b1-d369-46d8-bf47-a18e630e4623", 61 ], // Clockwork Beetle Swarm
				[ "69b8876f-11e3-4ff6-8c14-c7a238a1b3a5", 62 ], // Clockwork Hound
				[ "8aa5470b-b117-4f0f-bda0-a1049f445268", 63 ], // Clockwork Huntsman
				[ "bb046b76-72f1-4277-940e-2dbb87d73073", 64 ], // Clockwork Myrmidon
				[ "1cd6c9c3-ddb4-4f51-ada9-479ed2751c23", 65 ], // Clockwork Watchman
				[ "d80c84ff-8bce-40e8-b7a1-035b2cded742", 66 ], // Clockwork Weaving Spider
				[ "c8ba631f-38db-4bf3-9188-d35cedc3fee5", 67 ], // Clurichaun
				[ "da9a6770-9136-427d-afe6-6edcefe41b17", 68 ], // Cobbleswarm
				[ "5df42798-f133-4df3-aea6-e249eed5f49d", 69 ], // Corpse Mound

				[ "a8b87110-5394-4035-b4fb-27671b127a7d", 70 ], // Dau
				[ "5d7b51f8-f1dc-4e42-a469-c44e38be0996", 71 ], // Death Butterfly Swarm
				[ "217f088a-529d-42fd-a815-4880c393cbd5", 71 ], // Greater Death Butterfly Swarm
				[ "9bfde490-5c91-4097-a6b0-b63427b1ab0a", 72 ], // Deathwisp
				[ "c2c6bb2e-0372-42a9-a91d-a97b604f4ba2", 73 ], // Deep One
				[ "8ca21423-f105-4240-9f58-8073e2579cdc", 73 ], // Deep One Hybrid Priest
				[ "7b3d0676-429c-4e98-b1e4-2a30dc4c8a35", 74 ], // Deep One Archimandrite
				[ "8d774866-4341-42c4-8679-b24b59fc6f5b", 75 ], // Apau Perape
				[ "b1d88741-cd79-4752-bb6f-1ef696b7a9a4", 76 ], // Berstuc, Demon
				[ "dc7c2dcc-7512-4743-ad9c-4700f63625a6", 77 ], // Kishi, Demon
				[ "d321e41e-ddb9-449b-a03a-066d24566c14", 78 ], // Malakbel, Demon
				[ "5394d8bb-772d-4a44-aac1-db6300bf4b9e", 79 ], // Psoglav, Demon
				[ "bc46fd53-e06a-499a-b781-8ca3824b8b4e", 80 ], // Rubezahl, Demon
				[ "85acd254-e004-4c15-91b3-990d1880575d", 82 ], // Akyishigal, Demon Lord of Cockroaches
				[ "49b94afc-5003-4b15-8aac-09f4decdc506", 83 ], // Spawn of Akyishigal
				[ "6618d8f9-4006-4a59-8519-db3fbd103d3a", 84 ], // Alquam, Demon Lord of Night
				[ "4b6e0da3-3261-4d4e-a3c7-8873d4479070", 85 ], // Camazotz, Demon Lord of Bats and Fire
				[ "d3568a44-6269-47cd-b213-35782c1f25b2", 87 ], // Skin Bat
				[ "6ff39a6c-254a-44b9-9054-1b454266a7d5", 88 ], // Mechuiti, Demon Lord of Apes
				[ "f53799a6-554d-4893-a48e-f66ab4577894", 90 ], // Qorgeth, Demon Lord of the Devouring Worm
				[ "b9a861e7-02b9-4281-9703-876ee53b345d", 92 ], // Derro Fetal Savant
				[ "e61dd711-d229-48d3-abe7-444efdb3f415", 93 ], // Derro Shadow Antipaladin
				[ "d09d224e-f273-43b6-8d15-d7d302d859f0", 95 ], // Arbeyach
				[ "c28ba1f4-62a3-4193-a571-9cd0fc9029d9", 97 ], // Spawn of Arbeyach
				[ "afe75252-bdbf-490e-990e-0496b14fe729", 98 ], // Ia'Affrat
				[ "3a75d531-eef3-4bec-a386-5c984ff90369", 99 ], // Mammon
				[ "56cebeca-6791-4465-a8b0-04b96bc02d53", 101 ], // Totivillus, Scribe of Hell
				[ "4f7e3706-2145-47d5-8367-6ba0381fd997", 102 ], // Automata Devil
				[ "40d36b04-a33c-4b9a-84ed-a4506de964ad", 104 ], // Cohort Devil
				[ "b46b05ee-656f-4588-b0a0-68322c3f8116", 105 ], // Crystalline Devil
				[ "7b581c15-0da9-4718-a7da-ec08a140dc73", 106 ], // Gilded Devil
				[ "7d7c18e6-c80b-483d-8302-ecb14033cc33", 107 ], // Ink Devil
				[ "39d0b4b1-0025-4634-86c0-3bf717c91725", 108 ], // Koralk (Harvester Devil)
				[ "66c123d3-a888-459c-bb7f-84d84ab90406", 110 ], // Lunar Devil
				[ "c3a683d3-be46-4d12-95d4-a7bc4b0ce6df", 111 ], // Orobas Devil 
				[ "30495e72-f1fd-4ee3-8ed3-c4c1492b50ff", 113 ], // Salt Devil
				[ "4cc7e076-cde9-465a-865a-826fbfb772e8", 114 ], // Mbielu
				[ "c2955321-3e1e-44b3-9d9c-fff7bbe0c1c8", 115 ], // Ngobou
				[ "2fcdadab-7ad8-4a4a-9119-f3fd7c2222d7", 116 ], // Spinosaurus
				[ "a2dbba10-4493-47d2-b83c-f3d84194d6a8", 117 ], // Young Spinosaurus
				[ "029b2de7-9340-480f-b6af-ff0977938314", 118 ], // Dipsa
				[ "136623a6-3663-4fe4-b735-a76dc2555bac", 119 ], // Dissimortuum
				[ "743a4dd7-3466-473a-b63a-e2a20202a911", 120 ], // Dogmole
				[ "1f9e3430-2364-4963-951c-293834918685", 121 ], // Dogmole Juggernaut
				[ "1a197bad-659e-46b1-a068-c8431a34b6f1", 122 ], // Domovoi
				[ "4ccf6f2d-e76f-4ee6-aff2-95fbcea22886", 123 ], // Doppelrat
				[ "9b159862-bb1d-4d99-9088-67b06781af2b", 124 ], // Dorreq
				[ "40aded6f-4cd4-4a24-969e-7d68648e9ac2", 125 ], // Adult Cave Dragon
				[ "c7d443c2-ed3c-4015-9e9e-7b11e15e0e9d", 127 ], // Young Cave Dragon
				[ "307aaf51-a949-4afd-909d-d6c31680802b", 127 ], // Cave Dragon Wyrmling
				[ "9bf4904d-c617-4523-9628-464d8c5179d1", 128 ], // Ancient Flame Dragon
				[ "8e7c88ec-81bf-4a79-be26-7012eb81390a", 129 ], // Adult Flame Dragon
				[ "12314cf6-d600-4846-b720-6b9c8c0c7126", 130 ], // Young Flame Dragon
				[ "47d3a59e-3344-4904-a708-b16f19ef4ff1", 131 ], // Flame Dragon Wyrmling
				[ "b661391a-b533-48f0-9147-bf0c9f648244", 132 ], // Ancient Mithral Dragon
				[ "77fb4076-f427-492c-8d0a-526481be91f2", 133 ], // Adult Mithral Dragon
				[ "1b0d62f6-3c35-47e2-9390-32cd6319a146", 134 ], // Young Mithral Dragon
				[ "baa33773-4a28-4fb3-b676-28e91ff82180", 135 ], // Ancient Sea Dragon
				[ "44f93eee-8261-4407-b407-0abd856def1c", 135 ], // Adult Sea Dragon
				[ "fa12b6ea-08af-4c29-a08f-d1cf4645eecc", 136 ], // Young Sea Dragon 
				[ "7c077d65-f465-4c33-8ce3-f0a864822a8f", 136 ], // Sea Dragon Wyrmling
				[ "1d027163-d5ff-41a6-be7c-c1459ceb1832", 138 ], // Ancient Void Dragon
				[ "6b0abf48-3dc7-4b64-8639-40e43d15fb88", 139 ], // Adult Void Dragon
				[ "b474ce40-7d47-468c-b901-9107d20bb9ac", 140 ], // Young Void Dragon
				[ "bdf8d1f6-bb8f-4015-a671-e4e013d79fe8", 140 ], // Void Dragon Wyrmling
				[ "4fe57631-65e5-4584-b195-534c717098f8", 142 ], // Ancient Wind Dragon
				[ "654e6a8e-ffdf-4f4c-9eaa-5ced89556dc3", 143 ], // Adult Wind Dragon
				[ "d70e8de5-8d09-4a58-a3b6-b41f64cddb5b", 144 ], // Young Wind Dragon
				[ "3810e7f1-c595-4e0b-910e-4bc644a42c47", 145 ], // Wind Dragon Wyrmling
				[ "75ef5141-52cd-4613-a607-8a9959900940", 146 ], // Dragon Eel
				[ "1c6b62a3-1101-4dd6-999b-3343d54f264f", 147 ], // Dragonleaf Tree
				[ "9dcf1a47-aeca-4fa1-b998-ef708761952d", 148 ], // Alehouse Drake
				[ "cc506bd5-3b36-49d7-8b21-37d663cfad08", 149 ], // Ash Drake
				[ "401ae8c3-edcb-4906-a9df-acbc204106fa", 150 ], // Coral Drake
				[ "2a77207b-389f-4b54-a22d-821e367a25c7", 151 ], // Crimson Drake
				[ "9594c378-0403-4772-9b5b-f3d070bc7640", 152 ], // Deep Drake
				[ "19ffeed1-fdb3-4f41-921a-b5210336fc13", 153 ], // Elder Shadow Drake
				[ "d4869e67-414e-48ac-af84-e0749fbc0620", 154 ], // Paper Drake
				[ "8b7fad59-5da7-48bc-b59e-488ac96ad53e", 155 ], // Rust Drake
				[ "b79c129f-19b4-48f4-ac7c-9fa2419244f9", 156 ], // Star Drake
				[ "b8a31b8a-d11d-4e27-a34d-b576b27f640c", 157 ], // Drakon
				[ "c23f0728-6994-4cc7-971e-4b5602a486c1", 158 ], // Dream Eater
				[ "ed9f2396-2262-41ef-ae8c-3345b2cc33ee", 159 ], // Drowned Maiden
				[ "066cca78-8b42-4915-8a64-b7e267038291", 160 ], // Duskthorn Dryad
				[ "9ef3a0d8-e22b-4762-b00c-e9ebe0058d65", 161 ], // Dullahan
				[ "55e6009c-cff8-4d2c-8501-d7cd3baf3134", 162 ], // Dune Mimic
				
				[ "7ab3b1d5-191a-4ace-8260-1a9f21d09731", 163 ], // Eala
				[ "f10694f0-7524-4c57-8c58-460311054173", 164 ], // Eater of Dust (Yakat-Shi)
				[ "92fac7ff-874d-44fb-88d8-40fc9da7aeaa", 165 ], // Edimmu
				[ "803be8be-eeba-4268-b744-3241121b18bf", 166 ], // Eel Hound
				[ "0dc2c9fd-f27f-498d-8a62-170affe57912", 167 ], // Einherjar
				[ "b1da3df9-d072-4065-9b72-7618b1fdd63e", 168 ], // Eleinomae
				[ "fa9f893b-ee78-4c5c-86f6-b81b8b6da480", 169 ], // Elemental Locus
				[ "92373a97-adcc-4f8b-bf0a-85a27b579622", 171 ], // Shadow Fey
				[ "63c3f89d-8e30-4fc2-8379-3710aa667ef2", 171 ], // Duelist
				[ "09284d2c-0858-4068-9c14-8f0dbf1b9e64", 172 ], // Enchantress
				[ "a306eb36-72ce-42c8-9fcf-37e08f7c5449", 173 ], // Forest Hunter
				[ "c8e4e372-cc37-4f27-a022-4bec53e42f86", 174 ], // Guardian
				[ "14030ab3-bd1e-4c69-8818-5364f467512b", 175 ], // Emerald Eye
				[ "38b543df-57e6-4ace-b87a-3ec5e7c91c5f", 176 ], // Empty Cloak
				[ "416dfb18-57cd-4ac0-b998-d41e07fb8be5", 177 ], // Eonic Drifter
				[ "e339ccf0-fe7e-4d51-b475-887daee0cfc2", 178 ], // Erina Scrounger
				[ "633a9e5a-2793-466f-88dd-db7cc8d6ef8e", 178 ], // Erina Defender
				
				[ "6a4bee2e-adab-4628-891c-31bc997057e8", 179 ], // Far Darrig
				[ "25dd1d23-f7bb-429d-af3a-7b495cf629b6", 180 ], // Fate Eater
				[ "dc2b965d-9806-4d19-8d6c-7f93e97d52f7", 181 ], // Fear Smith (Fiarsídhe)
				[ "f85b099e-aa81-4c1d-a348-fadb42c0cf1f", 182 ], // Fellforged
				[ "48d45583-8e9f-44cd-9111-d42d8ba9db77", 183 ], // Fext
				[ "f5c3f40a-d646-4ea4-b3f0-b0e7330ac189", 186 ], // Bear King
				[ "003f9549-a03a-4a79-9c1c-67ff59f3a10d", 188 ], // Lord of the Hunt
				[ "225d53b7-e40b-4342-9b71-912181571ad3", 190 ], // Moonlit King
				[ "d21f72c3-71d4-4837-98d7-8318c1c19d39", 192 ], // Queen of Night and Magic
				[ "a79f7bc9-1738-41d7-8ef6-445fe0d611b1", 194 ], // Nicnevin, Queen of Witches
				[ "a7844f48-dad1-4b9e-9b32-3fb71531b4a0", 196 ], // River King
				[ "cf64275d-3f5c-4645-a30e-46b6084bc2f9", 198 ], // Snow Queen
				[ "ca404e71-3c35-4ab8-b178-1caaede06b96", 200 ], // Feyward Tree
				[ "efbc9c05-e8ec-4bee-8ead-84b9e733ac7e", 201 ], // Firebird
				[ "e2de0148-1043-4af9-91dc-856deed95fb3", 202 ], // Firegeist
				[ "d856a88f-7b06-4ff0-b825-b130c108052e", 203 ], // Flutterflesh
				[ "88408152-a902-4d52-bfc0-14c28ffdb451", 204 ], // Folk of Leng
				[ "9135b2db-4372-41c2-9048-d6052aae9967", 205 ], // Forest Marauder
				[ "b79ee777-7b7f-4cf1-9d03-a495ebcaf8d5", 206 ], // Fraughashar
				[ "5148765a-00fd-4c12-8b54-2223384dda5e", 207 ], // Frostveil

				[ "7690e783-f332-4322-95fd-11883a6a5c9e", 208 ], // Garroter Crab
				[ "1386b5e8-2319-425a-b56e-5f06708d56a2", 209 ], // Gbahali
				[ "21d6deb9-1187-4314-a6b0-bd44431b3571", 210 ], // Gearforged Templar
				[ "435835c6-f0b4-4d77-a235-c14f51f5b34b", 211 ], // Al-Aeshma
				[ "9cb17598-90df-4509-adbf-850d667d8a20", 212 ], // Gerridae
				[ "64722438-83d8-4323-ab65-a72eb2c28b8f", 213 ], // Beggar Ghoul
				[ "996fbcb6-dabd-4971-a5f9-6486169578a8", 214 ], // Bonepowder Ghoul
				[ "df165796-ec47-44f5-82ef-f7826ea7558f", 216 ], // Darakhul
				[ "51d1bec6-f450-47ac-b272-490908ac946c", 218 ], // Emperor of the Ghouls
				[ "98e4f5bf-1ce6-4ef1-ae2f-5453ec4d226e", 220 ], // Imperial Ghoul
				[ "754c4f9f-0e40-44b1-a224-2c139eb4c87b", 221 ], // Iron Ghoul
				[ "619e4252-154d-4145-9114-1bb6bec06cb1", 222 ], // Desert Giant
				[ "749c0d19-9a3d-4630-abfb-67b38ebdeb95", 223 ], // Flab Giant
				[ "fd1aeb7c-b900-4902-9877-eab76d043ad1", 224 ], // Hraesvelgr the Corpse Swallower
				[ "3f00395a-2553-4637-9173-2f0f88328dc7", 226 ], // Jotun Giant
				[ "3fd0b2fa-1278-4a49-a747-42070b79f484", 227 ], // Thursir Giant
				[ "6a8a0e0e-b21d-41fe-b22b-21c3d684e54c", 228 ], // Glass Gator
				[ "95b73cb9-41af-4f89-adac-e439519edf95", 229 ], // Gnarljak
				[ "298c17d7-4cbb-44ce-a568-7baffd4c4fd9", 230 ], // Gnoll Havoc Runner
				[ "4b33b198-5433-4bbe-98bf-0dafd08849e9", 231 ], // Goat-Man
				[ "b1f85c31-e2a1-4f3e-bb85-3aab8d35c838", 232 ], // Dust Goblin
				[ "fa41ee99-97f3-4a5c-b7d0-1344c1a239db", 233 ], // Eye Golem
				[ "813f82e7-2f01-499b-83a1-f1a3b098c111", 234 ], // Hoard Golem
				[ "d2472029-19f6-41cb-9c64-fd390e502113", 235 ], // Salt Golem
				[ "a49d09bc-994b-4dac-b74b-7af6d15d1474", 236 ], // Smaragdine Golem
				[ "0a801471-c25f-475e-859c-88469cb65c7d", 237 ], // Steam Golem
				[ "0f8f4f7b-163b-41cd-84c4-de8795eecda1", 238 ], // Gray Thirster
				[ "be0ec63c-9581-4b68-9fa1-be740b08f25c", 239 ], // Rum Gremlin
				[ "300e4c5c-cb8a-421e-9a10-08fa915a91c9", 240 ], // Grim Jester
				[ "d41959b5-0ffa-4f62-a5f3-6b79771b7c83", 241 ], // Gug

				[ "4e484541-a397-48ef-a75d-42b63cdebf39", 242 ], // Blood Hag
				[ "3e3e00ea-f3df-4983-85e6-6bc98f9e7718", 243 ], // Mirror Hag
				[ "e9a2b266-b2ef-44a4-b743-30d9a590738d", 244 ], // Red Hag
				[ "e39d2eb8-0484-4ca5-8edd-9567d74ecdf2", 245 ], // Sand Hag
				[ "a59e74b9-67f1-4253-baee-dce393e1ad08", 246 ], // Owl Harpy
				[ "6d0f8e4d-41a7-42c4-87b8-d04c6f7c0f07", 247 ], // Haugbui
				[ "f0f0f99f-1932-46fc-8f27-21b27c89ba8c", 248 ], // Herald of Blood
				[ "c12988ad-2cfa-4ba8-bc89-04601b2c697c", 249 ], // Herald of Darkness
				[ "24b25746-878f-460c-b818-75dc293e3014", 250 ], // Horakh
				[ "e1114e9f-be10-4e5b-9532-592b0fe06912", 251 ], // Hound of the Night
				[ "b6bfda21-3254-4c0d-95f9-0ada9553914b", 252 ], // Hulking Whelp
				[ "1e62b94c-bbf7-4c76-bc01-c251728e90dc", 253 ], // Hundun
				
				[ "0318f819-bc9e-446e-9832-23f1af88a506", 254 ], // Ice Maiden
				[ "0005d604-f4c1-4818-8baf-0d773669da9d", 255 ], // Idolic Deity
				[ "e5539c30-b567-4a2a-81b6-6b732c5950b0", 256 ], // Imy-ut Ushabti
				[ "db9b059c-c217-4db2-9d79-727e22521346", 257 ], // Isonade
				
				[ "fc0960cb-0825-45b6-9d50-7a4b848166db", 258 ], // Jaculus 

				[ "830b7368-6df3-440c-a012-658e652f3c5d", 259 ], // Kalke
				[ "ab55775c-a713-44b4-a339-1862db2399f7", 260 ], // Kikimora
				[ "f954aa0d-b8a1-4df4-966e-07708d9c62bb", 261 ], // Kobold Alchemist
				[ "221ee346-3107-4c96-a805-6fb37afcf7c2", 263 ], // Kobold Chieftain
				[ "9bcf7aaa-46b2-4c38-b8fe-6b5a6fd1be5d", 264 ], // Kobold Trapsmith
				[ "ead59ca0-f8a4-48b5-9c05-f5f2d0bbbf72", 265 ], // Kongamato
				[ "68df8dde-ed1e-4eb5-8342-85581b863860", 266 ], // Koschei
				[ "70464573-6341-466e-a1a2-0d1e16ee3cac", 268 ], // Kot Bayun
				[ "1137b654-dc13-41b4-a965-0c84d47e2129", 269 ], // Krake Spawn

				[ "864c7316-05b4-47c8-bbd6-2fdf7a73f7ba", 270 ], // Lantern Dragonette
				[ "ce982410-eda8-4b2a-a592-9d5258ed84b6", 271 ], // Lemurfolk
				[ "c71df1a8-4823-4c63-84cf-c003519c22b5", 271 ], // Lemurfolk Greyfur
				[ "dccfe297-282f-400d-94b3-2e2cd3d30ea1", 272 ], // Leshy
				[ "4db5e660-2911-4985-9b82-4110b28fcd3e", 273 ], // Library Automaton
				[ "07a48219-8dfe-46f0-8e1f-38bcdee8d8e2", 274 ], // Lich Hound
				[ "ec12f4b4-f1c8-4f2c-ba67-fcea3f854fab", 275 ], // Likho
				[ "082e911f-3b02-4d58-bd46-9edbc57ac6f1", 276 ], // Lindwurm
				[ "4611c643-2e59-47aa-95fc-bbbea10e9857", 277 ], // Liosalfar
				[ "e5c0ec0a-dda9-4bb4-a610-f3f042101520", 278 ], // Living Wick
				[ "4e9797ff-3f6f-44fa-b457-62bca4e86793", 279 ], // Lorelei
				[ "8af19666-35bd-453c-8eb3-adc8c9d79cd4", 280 ], // Loxoda

				[ "188416a0-926d-4431-bae2-cd910ca69f8a", 281 ], // Mahoru
				[ "14c1e073-609c-49a6-8e83-2a699a28a1cf", 282 ], // Mallqui
				[ "761f8822-cac0-4cbf-b2e5-9c17e94bfed2", 283 ], // Malphas
				[ "225e09ef-58e7-4dc8-a970-6a392f015332", 284 ], // Mamura
				[ "d8d600f1-018c-47cc-b892-f3bbf1c59f0c", 285 ], // Mask Wight
				[ "31defc11-6717-4609-89aa-1ff48e31aa07", 286 ], // Mavka
				[ "894f78a1-c43d-44ac-9720-a2fc661d170e", 287 ], // Mi-Go
				[ "f74a8a6c-71c0-42b3-9595-432e9e437d1a", 288 ], // Millitaur
				[ "e07a7d74-0cf0-4daa-827b-5c9b93d7982e", 289 ], // Map Mimic
				[ "2a615acd-cae3-4c10-9cfc-e1b4fc20b872", 290 ], // Mindrot Thrall
				[ "747b7cd2-7b7b-4151-8c7c-f99bf2ffbce7", 291 ], // Mirager
				[ "414e421e-9e97-45cd-a4f2-4b758194a89e", 292 ], // Miremal
				[ "e047b224-e15c-49d3-960c-d17cac10d792", 293 ], // Mngwa
				[ "90f94b43-4214-4cb2-973a-eef90bd08efa", 294 ], // Monolith Champion
				[ "251dc434-0130-4739-8f3c-d70a286cf60e", 295 ], // Monolith Footman
				[ "2170e25b-bdd5-4455-9c0a-29754201f6ff", 296 ], // Mordant Snare
				[ "14e6a85f-252c-463b-9dff-64f2f3af56e8", 297 ], // Morphoi
				[ "47b9ae76-4f66-4eb2-8e3d-3e28706e3edb", 298 ], // Moss Lurker
				[ "e1118b50-8ff5-4fdf-9750-ce728151b720", 299 ], // Venomous Mummy
				[ "59ebdf97-4b28-478d-a8ee-fd1de8082513", 300 ], // Deathcap Myconid
				[ "b12d57c5-35b0-44f4-9ba1-03dd8c18ece1", 301 ], // Myling

				[ "cf644cb4-c7fc-4bf4-8c89-524af9964b74", 302 ], // Naina
				[ "b634ea34-d8e8-458b-af10-11054b1d45ee", 303 ], // Nichny
				[ "026f2ffe-e132-4d84-944b-5b49d0258e6b", 305 ], // Nightgarm
				[ "051d50a2-3f42-45fa-863a-2bfbccf4830d", 306 ], // Nkosi
				[ "9e26d2c0-9c1d-40ea-abc8-15d02f82ef23", 306 ], // Nkosi Pridelord
				[ "c18ba461-0980-4422-8489-7f924139c02a", 307 ], // War Ostrich
				[ "280c4a39-f265-4b0d-8ac6-7d73087e439b", 308 ], // Noctiny

				[ "e4d7c536-3bce-4eff-9e73-b6d31ad1bdc3", 309 ], // Oculo Swarm
				[ "4b5f959b-f915-4f00-87c0-9dc9e0976189", 310 ], // Oozasis
				[ "a08589b8-7cdf-4c7b-9a9f-148ddad36d2e", 311 ], // Corrupting Ooze
				[ "71569d53-5bd5-40b1-8d69-37d03260d9a5", 312 ], // Ostinato
				
				[ "c9d1e16f-ce68-4df5-bc34-603a33ba81e9", 313 ], // Pombero
				[ "2edb499b-9aae-465e-b3f0-4ccba8b54938", 314 ], // Possessed Pillar
				[ "8396d314-bd83-497d-a40e-b527dc3b3ff1", 315 ], // Putrid Haunt
				
				[ "16a43ae9-70b9-40ba-80e4-6da11826a160", 316 ], // Qwyllion

				[ "33ab8a95-5381-49f4-973a-06540ab80d46", 317 ], // Ramag
				[ "ae6afb0a-4199-4e0f-b46b-951951538b93", 318 ], // Rat King
				[ "6de079e0-aaa8-4940-9aa0-8f8c5d1e0e78", 319 ], // Ratatosk
				[ "2f6a702c-9382-4daa-88ed-014031c5d36e", 320 ], // Ratfolk
				[ "49a610c1-f691-4b3b-b0aa-7d90beaa2d72", 320 ], // Ratfolk Rogue
				[ "c8a9fb9f-eb7f-4d88-8fe8-c23fac4986d1", 321 ], // Ravenala
				[ "83861d96-1f9e-49b1-a00d-831d8a8141fa", 322 ], // Ravenfolk Scout
				[ "9ca540ef-6313-463f-98c7-e10ffae59b8a", 323 ], // Ravenfolk Warrior
				[ "df853025-e1c2-4517-8ed6-efe3b8c84aa5", 324 ], // Ravenfolk Doom Croaker
				[ "0f23b109-7b2d-4843-8582-168af4412cf6", 325 ], // Redcap
				[ "3fffc7c5-f846-44e6-8eb2-04d1214a6fff", 326 ], // Rift Swine
				[ "3d8c76b6-2199-48bf-a552-e9121ba55236", 327 ], // Adult Rime Worm
				[ "fbd34b80-5496-4c69-93bb-e9535a60670d", 327 ], // Rime Worm Grub
				[ "4e8047ac-0e28-41ef-af5b-c2869de687c1", 328 ], // Risen Reaver
				[ "b1c650f2-1346-4ffe-b438-9dabc29a639e", 329 ], // Roachling Skirmisher
				[ "6ee01ecc-1f6e-40ee-88f3-ce71bc9f1aae", 329 ], // Roachling Lord
				[ "a2d1a971-e66d-4568-96b6-a58c4626ebfc", 330 ], // Rotting Wind
				[ "f053e7fc-ff6b-4813-9c31-4dcd682ea8c8", 331 ], // Rusalka

				[ "0cb7aad6-0f83-4250-b1fe-e64d39004c30", 332 ], // Sand Silhouette
				[ "71ecaa9d-ed41-4063-b69b-2adefcbd5694", 333 ], // Sandman
				[ "27285f11-2529-4510-a4fc-5915d73616a1", 334 ], // Sandwyrm
				[ "e854f6f7-6719-4a4c-a49a-eebd3653511c", 335 ], // Sap Demon
				[ "e0d4a038-cc22-4961-8d37-15bb39a3c5d2", 336 ], // Sarcophagus Slime
				[ "535b734d-4e1c-49c8-98f3-4ed0f0e4a11b", 337 ], // Sathaq Worm
				[ "1d585aff-d195-4c06-ac1f-f7e42ce096dc", 338 ], // Savager
				[ "fe9e68cb-f4dd-4d11-ac79-fa7ff0f887eb", 339 ], // Scheznyki
				[ "4061b92c-4ad3-4023-8d6c-3a188a68ff34", 340 ], // Night Scorpion
				[ "84193f38-0655-412c-9b48-bcb74fc7d8d6", 340 ], // Stygian Fat-Tailed Scorpion
				[ "f1435d44-d07e-4954-b83c-c381cc81dc43", 341 ], // Selang
				[ "0efddf33-ea91-4c78-927a-6a2aa34767b8", 342 ], // Serpopard
				[ "6e76cd35-77e6-4b90-ad60-9abdc094f3c4", 343 ], // Shabti
				[ "a8489757-ccc5-45f3-b071-ab94cdb12e6c", 344 ], // Shadhavar
				[ "96e404b7-55b2-4e69-91af-2ae68b0dad9a", 345 ], // Shadow Beast
				[ "384b03a0-a3c5-4395-97ac-a5cdc24625cd", 346 ], // Shellycoat
				[ "a5627f16-e828-4ce0-84a7-d7cd1ee1e4c3", 347 ], // Shoggoth
				[ "2e9eb1bc-0a71-4a79-b9e3-15f9f4353a5c", 348 ], // Shroud
				[ "60c2b3df-254d-49e8-9a73-46c99b66ca3c", 349 ], // Skein Witch
				[ "cf786939-8f97-46ec-9f39-2a483c29142b", 350 ], // Sharkjaw Skeleton
				[ "ebacd4fd-f8e1-45d3-9cff-2b7e473319af", 351 ], // Vine Troll Skeleton
				[ "65c27747-9dfc-479a-9099-7b70aee390ba", 352 ], // Skitterhaunt
				[ "1868ed95-6478-45ef-bae1-864cfb206897", 353 ], // Slow Storm
				[ "fcb77a91-5b06-405f-b52a-6eaa291627ed", 354 ], // Swamp Adder
				[ "7a979569-87ea-46d9-8475-eba92c1e5f04", 354 ], // Zanskaran Viper
				[ "1b5e77f5-5250-44ed-8051-e29559d816d4", 355 ], // Son of Fenris
				[ "7937ed71-f2ae-42db-b026-e0123aed20a3", 356 ], // Soul Eater
				[ "56459c20-2355-4f52-a2ef-ecd1e8fdc579", 357 ], // Spark
				[ "37ff88b3-06cb-4025-a18d-ff6fb4f40a35", 358 ], // Spectral Guardian
				[ "bf8bbb5c-8f14-465c-86c5-db96d697f4c2", 358 ], // Arcane Guardian
				[ "a46c9a0b-a683-4f25-ae80-b47b20b38132", 359 ], // Gypsosphinx
				[ "98d1b693-9485-4ed1-9301-d67542840e5b", 361 ], // Ghostwalk Spider
				[ "030c90be-49b5-42ca-83f0-031d68a37d75", 362 ], // J'ba Fofi Spider
				[ "1cf96cca-4c00-4549-bbe5-8ecd7b92a665", 363 ], // Red-Banded Line Spider
				[ "8bbc042e-4f22-4355-ad02-c23e5bc7dcb7", 364 ], // Sand Spider
				[ "2b9b2996-df38-4842-bf5f-db1720553b23", 365 ], // Spider of Leng
				[ "e2a8431a-d9bb-446b-be45-fd1c0ba04b52", 366 ], // Spider Thief
				[ "46006136-d533-4fa0-989d-1f62623c2874", 367 ], // Spire Walker
				[ "aba1983a-a5c7-4f9e-9807-0271a80b7b58", 368 ], // Star-Spawn of Cthulhu
				[ "96c64c49-b1ae-4fd5-b17a-ec2c8cedb8eb", 369 ], // Stryx
				[ "c9384d24-8aed-41b8-bb0e-b3316d25a092", 370 ], // Stuhac
				[ "b1a671e2-210a-401f-b798-2f83847f4b6c", 371 ], // Subek
				[ "79d3a364-83bc-41be-9f6e-eea838b7ed65", 372 ], // Suturefly
				[ "52464dd2-1828-480e-b03c-a07a5dc04900", 373 ], // Fire Dancer Swarm
				[ "70898ccc-879f-4459-aa1e-b106f1044bbe", 374 ], // Manabane Scarab Swarm
				[ "1a985064-6798-42c4-bc92-d70b4d4549cd", 375 ], // Prismatic Beetle Swarm
				[ "bd438b5e-6bc2-465c-a9e3-15008b4662bb", 376 ], // Sluagh Swarm
				[ "3dfa2f4f-d22b-4458-8bb0-e98b51103740", 376 ], // Sluagh
				[ "44fc2e30-8c14-485e-8dcd-7f049b463e60", 377 ], // Wolf Spirit Swarm
				
				[ "6ee1e568-4b2b-43db-ab59-48c4585b684b", 378 ], // Temple Dog
				[ "2cd2dde4-6c0d-49f4-9309-5130f103365c", 379 ], // Theullai
				[ "3bc2512e-6c39-4888-9d23-c70434622b9c", 380 ], // Ancient Titan
				[ "57a6a940-349f-4c1e-85af-cc68858a0a76", 381 ], // Degenerate Titan
				[ "63cd3b02-a21f-4a2c-a143-8d30c60b4083", 382 ], // Titanoboa
				[ "c22e8a67-e2bc-40af-9114-181d0601189b", 383 ], // Tophet
				[ "95f8e9f0-7930-4af8-8f7e-d6f2a77b80a2", 385 ], // Tosculi Hive-Queen
				[ "fbb949d8-aa67-47c8-a04d-da746daa833d", 386 ], // Tosculi Warrior
				[ "19c35b26-1b1a-44f7-a99f-c0019275996e", 386 ], // Tosculi Drone
				[ "ecb2456c-ae2d-4ebc-8353-9a75dc5ea814", 386 ], // Tosculi Elite Bow Raider
				[ "be860119-6f8e-4295-bc6b-059f93adfea6", 387 ], // Treacle
				[ "4e909dfa-279e-4414-a203-8a304dc419e9", 388 ], // Weeping Treant
				[ "36343cd1-aabe-4a13-90de-5314d54672d9", 389 ], // Lake Troll
				[ "09c79891-9f2b-4acf-a301-78fdbcd76533", 390 ], // Trollkin Reaver
				[ "d8d002e8-0a7f-4010-90e7-8b8ffbbbfc1e", 391 ], // Tusked Skyfish

				[ "d93665ff-d379-45f9-a004-17abeb21a80d", 392 ], // Uraeus
				[ "08958c03-f398-47e7-a399-83d49c881edf", 393 ], // Urochar (Strangling Watcher)
				[ "543176d3-515d-41b0-b5c0-aa4c4eb46f93", 394 ], // Ushabti

				[ "29a0483a-fc63-4337-89c7-7df8b106287b", 395 ], // Vættir
				[ "ee56ae45-caa2-47ee-be88-ef8ed21870b4", 396 ], // Valkyrie
				[ "417edc33-5ce9-4a26-8731-e5ea3ab8ec96", 397 ], // Umbral Vampire
				[ "a4ab2454-1855-4109-a28a-4454fd5a624e", 398 ], // Vapor Lynx
				[ "23968e0d-e500-4f46-99e3-397633cd6486", 399 ], // Vesiculosa
				[ "11135d19-ccc5-499e-9a2c-b70c8534e4da", 400 ], // Vila
				[ "d5aaefda-4a21-4d41-80bb-904452dd9420", 401 ], // Vile Barber (Siabhra)
				[ "18cfcab3-b5f2-48c3-8515-5971d45a3972", 402 ], // Vine Lord
				[ "d129cbf3-a157-494d-87c6-e4d7f99d65f0", 403 ], // Tendril Puppet
				[ "dba4d591-0200-4ae7-9f45-e77876a16a7e", 404 ], // Voidling

				[ "88bda2f0-9e1a-4de6-acb5-5f78e5cbd720", 405 ], // Wampus Cat
				[ "535c9c11-ac93-4d42-b69b-5ad053561caf", 406 ], // Water Leaper
				[ "3434dd3f-36ef-481c-9e32-6b5b765fecec", 407 ], // Wharfling
				[ "c3f73d39-ded6-456e-bc1e-52b94b901786", 407 ], // Wharfling Swarm
				[ "bc9e0ff1-bedd-4b03-ae4b-c8aa3ea0697e", 408 ], // White Ape
				[ "e13c41c6-6464-4202-a4e1-2880d9a3f267", 409 ], // Witchlight
				[ "27368d86-58a5-43c7-a1d3-595f19116db2", 410 ], // Wormhearted Suffragan
				
				[ "558dab89-5002-40c0-9235-4d74ed9ce9b3", 411 ], // Xanka
				[ "76571f12-5e97-4402-b554-21af217c505a", 412 ], // Xhkarsh
				
				[ "19d46a6d-faba-43d1-8231-fbd73251fb90", 413 ], // Ychen Bannog
				
				[ "148558cc-fa9e-493d-b089-19c56e1d2b0b", 414 ], // Zaratan
				[ "48f0ec18-5e92-4881-932e-7744de2032bb", 415 ], // Zimwi
				[ "5ece18ae-3cfb-404b-b318-e9ee3a2155de", 416 ], // Zmey
				[ "61e83cd8-4d2d-45a4-a9ac-3e01b1975139", 417 ], // Zmey Headling
				
				[ "38f5ce44-3fb7-4a8d-9901-1f95cdb4fbde", 418 ], // Bandit Lord
				[ "1c0e1fa1-2fa8-4885-a976-b46ad9bbb130", 418 ], // Black Knight Commander
				[ "9a2cd6b4-c9e9-45d8-9ace-7e6106ec823a", 419 ], // City Watch Captain
				[ "7ebfa146-afba-48bb-8e52-a8f00c4c3d52", 420 ], // Devilbound Gnomish Prince
				[ "40f414ff-2834-4522-8ea2-a28512b13404", 420 ], // Dwarven Ringmage
				[ "8ecfa397-b6b0-45f6-aeb1-5ece4b72a554", 421 ], // Emerald Order Cult Leader
				[ "8dd4f4f3-1bb4-4fe4-bafa-4396f022ba69", 422 ], // Elvish Veteran Archer
				[ "8f117d37-d40f-493f-8f48-343014cac3a1", 423 ], // Ghost Knight
				[ "a2055eff-9709-4d7f-a85d-5f209651d06e", 423 ], // Corrupted Ogre Chieftain
				[ "27f5e286-1a17-46e3-bea4-5453c9724b76", 424 ], // Ratfolk Rogue
				[ "60c990fb-4ea3-464f-9f17-1c2e74a4e813", 425 ], // Scropion Cultist
				[ "07575c79-9ccc-46a4-ab57-d96b9048fd84", 425 ], // Vampire Warlock
				[ "61945580-5ceb-45a5-9764-7e3f7ae06237", 426 ], // Wolf Reaver Dwarf
				
			],
		}
	}
})();
(function() {
	"use strict";

	angular.module('app')
		.factory("volosguidetomonstersSource", Source);

	function Source() {
		return {
			name: "Volo's Guide to Monsters",
			shortName: "Volo",
			initialState: true,
			contents: [ 
				// Bestiary
				[ "c80a939f-3eb8-411d-b706-fd854706ce1b", 122 ], // Banderhobb
				[ "efca8fda-9530-4c93-980b-7f3373403b94", 123 ], // Barghest 
				// Beholders
				[ "55a7bf90-28ae-45e0-87a6-bdf486a94825", 124 ], // Death Kiss
				[ "d72537f3-e20c-4c8c-8186-7d6c7efc249f", 125 ], // Gauth
				[ "1c337d34-8887-44dc-8b20-4c250ca6c2c5", 126 ], // Gazer
				[ "a33ac49f-60a3-4195-8c99-70e7277acbf9", 127 ], // Bodak
				[ "8cdd733f-c78e-4a92-a451-4ab459682aaa", 128 ], // Boggle

				[ "6d5a9c50-fedc-414e-95aa-522a2a5bef5d", 129 ], // Catoblepas
				[ "4cc42a2f-f24c-43f5-904e-653cd82945a2", 130 ], // Cave Fisher
				// Chitines
				[ "f35b9f35-6bd4-47f1-aaaf-305a8877c28c", 131 ], // Chitine
				[ "18f0b7ed-db92-4567-ab9f-91506439296b", 132 ], // Choldrith
				// Cranium Rats
				[ "b469005c-564e-457b-9776-40a65501a171", 133 ], // Cranium Rat
				[ "036a9bdf-1a1e-4213-88c7-9080d95dfa3d", 133 ], // Swarm of Cranium Rats

				// Darklings
				[ "1687a030-f448-44cd-acb8-464494bfb54f", 134 ], // Darkling
				[ "67b78e36-a770-4fe1-9056-c049c27f9549", 134 ], // Darkling Elder
				[ "bb09f8e7-27dc-4026-9017-7ac0502aad5b", 135 ], // Deep Scion
				// Demons
				[ "30a9ed8c-5fd9-46f1-ab97-6a3d6645eb9a", 136 ], // Babau
				[ "3414fdd4-a1ca-4501-87fb-e6c571d134a6", 137 ], // Maw Demon
				[ "282b94f2-c50e-4e06-b8ce-31d89d0803d1", 137 ], // Shoosuva
				[ "0c8931e1-2bcf-4507-9c41-c040221d0f6c", 138 ], // Devourer
				// Dinosaurs
				[ "d7bda54e-5efc-4196-a709-80caa0e441e1", 139 ], // Brontosaurus
				[ "bd9c09e0-1360-464c-bd14-bad41cfc60c0", 139 ], // Deinonychus
				[ "9dd0c06e-e952-4915-b224-aae56984ec83", 139 ], // Dimetrodon
				[ "2c47a6bb-caac-434c-a71e-6bdb82d03cf7", 140 ], // Hadrosaurus
				[ "e3c8935d-7149-49a2-be6e-ba6e9018c3c9", 140 ], // Quetzalcoatlus
				[ "afe3a501-2d72-44e9-8761-1f3f5d773255", 140 ], // Stegosaurus
				[ "65747477-fa7c-49b1-98c3-ba5235b7f085", 140 ], // Velociraptor
				[ "f423a0b9-5500-4283-9553-541a2f5893bc", 141 ], // Draegloth
				
				// Firenewts
				[ "e2175890-b6c6-49c1-bf53-1d821bb4d21a", 142 ], // Firenewt Warrior
				[ "9f92a394-a7a3-43b4-affa-473c73c01112", 143 ], // Giant Strider
				[ "79827bf3-c000-4b9c-86a8-f1a58b43f313", 143 ], // Firenewt Warlock of Imix
				[ "501a8481-979a-4349-870c-c7d527be03db", 144 ], // Flail Snail
				[ "c88651d6-10c0-4b08-a6a0-ad226f86652d", 145 ], // Froghemoth
				
				// Giants
				[ "66b29d8c-d2b2-4d46-8a83-109828daffa5", 146 ], // Cloud Giant Smiling One
				[ "020c9ef9-6365-4c3c-a200-4dd01865befc", 147 ], // Fire Giant Dreadnought
				[ "77374683-ee85-4dd3-b6ae-fda0c2e490c5", 148 ], // Frost Giant Everlasting One 
				[ "eefda17b-25ca-4266-b8ca-752b4893fc76", 149 ], // Mouth of Grolantor
				[ "fcdea77a-b7ab-4b3d-aaf7-78706009286c", 150 ], // Stone Giant Dreamwalker
				[ "2e0ba72f-74ff-4828-bf1c-3479944bea4a", 151 ], // Storm Giant Quintessent
				[ "8fe276ab-13c5-4a24-b998-23f9490bc049", 152 ], // Girallon
				// Gnolls
				[ "7b70915e-78d5-4bfe-b8a3-5c2aaa680da8", 153 ], // Flind
				[ "1377d091-b506-4969-83a5-2e15ebbc5ceb", 154 ], // Gnoll Flesh Gnawer
				[ "5484ec7e-b482-4a2c-8d13-46cd775436c6", 154 ], // Gnoll Hunter
				[ "a947f2aa-a0f0-4c5b-83e6-190de7616b41", 155 ], // Gnoll Witherling
				// Grungs
				[ "da56cbc6-b72a-4472-9910-07661977337b", 156 ], // Grung
				[ "5c0f26e8-790f-4c79-a3df-cfaa21537d6f", 157 ], // Grung Elite Warrior
				[ "4f42ad2b-d9b0-47d7-8fc3-0f446b7ad848", 157 ], // Grung Wildling
				[ "a181ad6a-3e2f-4c45-aefc-2b63ea99b382", 158 ], // Guard Drake

				// Hags
				[ "f70647ec-88aa-4d87-a389-4d0045bb14a4", 159 ], // Annis Hag
				[ "36445a43-c0d2-4a75-80a7-e87e05603ae6", 160 ], // Bheur Hag
				// Hobgoblins
				[ "8b90ae47-ee46-4b14-afb7-4a12a6c500e2", 161 ], // Hobgoblin Devastator
				[ "cc0e5ae5-8819-4694-a26a-126d66a1fdab", 162 ], // Hobgoblin Iron Shadow

				[ "79401bb2-32be-48b5-a7c8-ef212ec99cfe", 163 ], // Ki-rin
				// Kobolds
				[ "d1b0378d-9bdc-4c31-a23d-70a8a9368b9d", 165 ], // Kobold Dragonshield
				[ "ca07f8dc-fd62-4ce6-95d5-37f59b7b8377", 166 ], // Kobold Inventor
				[ "a67eedd6-934c-4622-9de3-0e869c1e1e44", 167 ], // Kobold Scale Sorcerer
				[ "a0982a32-cc7f-40c8-b839-fe33a9242462", 168 ], // Korred

				[ "e5c7fbd0-16f6-47ab-a2b1-297a9baa140f", 169 ], // Leucrotta

				[ "21fd5290-e0e5-4ca7-85e6-729b083335ef", 170 ], // Meenlock
				// Mind Flayers
				[ "2453a9e3-8aaa-4863-a50a-e2f0f2b91544", 172 ], // Alhoon
				[ "41c4c37c-2cc1-4bd9-8332-2494f89d37fc", 172 ], // Mind Flayer Lich (Illithilich)
				[ "c4a5e124-2aa6-40a5-800c-43148b0fbc99", 173 ], // Elder Brain
				[ "839c78e4-80b5-4bb8-8520-a34dbe2bf267", 175 ], // Ulitharid
				[ "156b6bb2-0a7f-4cc6-b2bd-f5b169334c9e", 176 ], // Mindwitness
				[ "02054aad-6910-4e17-b22c-3d07b460240e", 177 ], // Morkoth

				// Neogi
				[ "6d22face-0a8c-425b-90f1-defd1b65405f", 179 ], // Neogi Hatchling
				[ "5b0404ef-4495-498f-ab87-067e4c9d1e65", 180 ], // Neogi
				[ "637e8b38-d786-4ca3-bb10-595c6b47cb6f", 180 ], // Neogi Master
				[ "f69dd8f8-3e32-4353-89b1-76772d043145", 181 ], // Neothelid
				[ "2daab424-8390-4a2e-a1f6-c9d64c46f417", 182 ], // Nilbog

				// Orcs
				[ "809eb1b7-e519-4541-8627-04045700ec5a", 183 ], // Orc Blade of Ilneval
				[ "e4315ee2-bbef-4aac-9fe3-98e581b72bb3", 183 ], // Orc Claw of Luthic
				[ "ace61424-ca9f-4ad8-abb9-2c69f8d051db", 184 ], // Orc Hand of Yurtrus
				[ "fb666504-a649-459d-a774-ca6505e12fef", 184 ], // Orc Nurtured One of Yurtrus
				[ "c59837a7-5864-417c-a778-2cf43e912857", 185 ], // Orc Red Fang of Shargaas		
				[ "e976e397-075c-4771-93b7-70982088dcdd", 186 ], // Tanarukk

				[ "7c9f42e8-b973-40e0-8870-5c947af01d9f", 187 ], // Quickling

				[ "59d3c891-5410-4111-9763-ad8aa4aed76d", 188 ], // Redcap

				[ "c133c8f1-0c56-4559-9d65-e5670f03ee51", 189 ], // Sea Spawn
				[ "24d66847-cd56-4edf-a8c9-2973df80b051", 190 ], // Shadow Mastiff
				[ "3538794e-d8ff-426f-9019-04bbcd08397b", 190 ], // Shadow Mastiff Alpha
				[ "3020ee17-2fc0-473d-a8e3-f730c05bc935", 191 ], // Slithering Tracker
				[ "4d268c1d-293b-4351-b849-6fbb79aeae8a", 192 ], // Spawn of Kyuss

				[ "33f3dc3e-b613-42c0-b39c-679ef86fd3d8", 193 ], // Tlingcalli
				[ "49058685-76c7-40bd-9d54-cf1f129b4232", 194 ], // Trapper

				[ "50d25ff2-2415-4ecd-a613-888faa8e2297", 195 ], // Vargouille
				// Vegepygmies
				[ "88fc8e6f-80d2-4a2c-8de8-8fe8c20dd7e1", 196 ], // Vegepygmy
				[ "483f3c15-a707-4ef1-8e37-6d1168d7b404", 197 ], // Vegepygmy Chief
				[ "a8c83916-acbc-4a73-9c9b-cf75d187611a", 197 ], // Thorny

				[ "7d758025-5f81-4ac7-a59e-6fca8774d61d", 198 ], // Wood Woad

				// Xvarts
				[ "c6323018-2f32-49bd-8b94-2889024f4dbc", 200 ], // Xvart
				[ "6746c13c-6bb1-4e96-8dd1-b0027e8683c8", 200 ], // Xvart Speaker
				[ "9af47702-ffc4-4555-a977-7d1339b59933", 200 ], // Xvart Warlock of Raxivort

				[ "65451d58-1f95-4b9b-9fd0-d6c5205edf42", 201 ], // Yeth Hound
				// Yuan-ti
				[ "104b98f3-efa1-4403-bda1-e26350fcd23c", 202 ], // Yuan-ti Anathema
				[ "1f60a7d3-7592-41cc-92d3-a696addde426", 203 ], // Yuan-ti Broodguard
				[ "6c82d15c-907b-48e0-8866-dcb7f3e4cd0c", 204 ], // Yuan-ti Mind Whisperer
				[ "16795632-bba4-48e3-86cd-08d66cbdd4b5", 205 ], // Yuan-ti Nightmare Speaker
				[ "cc9084c4-a3ed-4ffd-9273-e68a03b5b40f", 206 ], // Yuan-ti Pit Master

				// Appendix A: Assorted Beasts
				[ "fadbf43c-75c4-49e1-95f7-99675ee7f93c", 207 ], // Aurochs
				[ "f7def5c8-1b2c-4a36-8bb6-c87c74053dbd", 207 ], // Cow
				[ "8c8e238a-0c86-43d0-aa45-7860b9da17aa", 208 ], // Cow (Ox)
				[ "e8defb89-88b4-49e7-b636-6aa98ce0974a", 208 ], // Rothe
				[ "9140ec74-c6cb-453d-b9fa-624a177aa84a", 208 ], // Stench Cow
				[ "6797c463-8d3a-4bda-8073-db40a364a058", 208 ], // Dolphin
				[ "073f64fe-97e3-4d24-b203-fa511db582cc", 208 ], // Swarm of Rot Grubs

				// Appendix B: Nonplayer Characters
				[ "c59317ff-3950-4548-8a5c-29f6977f0d62", 209 ], // Abjurer
				[ "b2e98789-523a-44fb-83c1-0e73e53c4c82", 209 ], // Apprentice Wizard
				[ "a00e226f-91a2-4332-ba45-8b0ae5e5ebfc", 210 ], // Archdruid
				[ "9a3c941c-98a8-4bb8-9710-0b3edf4edf1d", 210 ], // Archer
				[ "54fb5ff9-91ef-4060-abf5-86d4c0913c32", 211 ], // Bard
				[ "732330e6-817c-4de6-8e8e-b702f260761f", 211 ], // Blackguard
				[ "fbe8bd0e-da21-4096-a08f-49d414fbeaa9", 212 ], // Champion
				[ "e207f392-8307-4b67-968b-f49fe8ba7cf2", 212 ], // Conjurer
				[ "1af0dad1-0468-4fe7-a53c-2d75420bf202", 213 ], // Diviner
				[ "ccf03973-5098-478b-9573-6cd0d039b226", 213 ], // Enchanter
				[ "a39711ac-adde-4465-8b28-f2a0247def78", 214 ], // Evoker
				[ "fd3b4e47-8210-4d3a-9571-431c164c2747", 214 ], // Illusionist
				[ "c128a8c7-997b-44a5-805c-f718cf90953f", 215 ], // Kraken Priest
				[ "69b0d522-7ad1-4909-86f5-a8f716afd9d0", 216 ], // Martial Arts Adept
				[ "6272a878-47ee-43b8-99be-0fbc5af1a8e2", 216 ], // Master Thief
				[ "c3ccfd43-a212-4181-b175-c65ff82a6fcc", 217 ], // Necromancer
				[ "51d8819f-c57b-4fa3-8efc-f98c665e0683", 217 ], // Swashbuckler
				[ "583e060b-a8a2-48e4-8474-cdcdf09da2fa", 218 ], // Transmuter
				[ "246cfb3f-20e8-40f9-ba67-3a6909231608", 218 ], // War Priest
				[ "55ebdcc0-9888-43c8-a018-452f9f6f8bed", 219 ], // Warlock of the Archfey
				[ "8c42b1a6-9628-4846-a720-d10860de5c57", 219 ], // Warlock of the Fiend
				[ "e17a93a4-e1b1-4919-b10c-d033db5918d2", 220 ], // Warlock of the Great Old One
				[ "934ebd78-8ec6-46f4-86d7-e079209102b8", 220 ], // Warlord
				
			],
		}
	}
})();
(function() {
    'use strict';

    angular
        .module('app')
        .component('currentEncounter', {
            bindings: {
                filters: '<'
            },
            controller: 'CurrentEncounterController',
            controllerAs: 'vm',
            templateUrl: 'app/encounter-builder/current-encounter.html'
        });
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('CurrentEncounterController', CurrentEncounterController);

    CurrentEncounterController.$inject = ['encounter'];
    function CurrentEncounterController(encounter) {
        var vm = this;
        
        vm.encounter = encounter;
        vm.generateRandom = generateRandom;
        vm.randomButtonText = randomButtonText;

        var lastDifficulty = "medium";
        
        function generateRandom(difficulty) {
            difficulty = difficulty || lastDifficulty;
            encounter.generateRandom(vm.filters, difficulty);
            lastDifficulty = difficulty;
        }

        function randomButtonText() {
            return "Random " + _.capitalize(lastDifficulty);
        }
    }
})();
(function () {
	"use strict";

	angular.module("app")
		.controller("EncounterBuilderController", EncounterBuilderController);

	EncounterBuilderController.$inject = ['$scope', '$log', 'store', 'actionQueue', 'encounter', 'monsters', 'sources'];

	function EncounterBuilderController($scope, $log, store, actionQueue, encounter, monsters, sources) {
		var vm = this;

		vm.encounter = encounter;
		vm.getMonsterQtyString = getMonsterQtyString;

		activate();

		function activate() {
			// There's no way to tell when they're done building an encounter, so clear the queue if they ever make it here.
			actionQueue.clear();

			vm.filters = {
				source: sources.filters,
				pageSize: 10,
			};

			$scope.$watch(function (scope) { return vm.encounter.groups; }, function (newValue, oldValue) {
				var subtotal = 0;

				_.forEach(newValue, function(item, idx) {
					var groupQty = item.qty;
					var groupMonster = monsters.byId[idx];

					subtotal += groupMonster.cr.exp * groupQty;
				});

				vm.encounter.exp = subtotal;
			}, true);

			store.get("5em-filters").then(function (frozen) {
				if (frozen) {
					$log.log('Thaw filters');
					vm.filters = frozen;
				}
			})
			.finally(function() {
				$scope.$watch("vm.filters", function () {
					$log.log('Freeze filters');
					store.set("5em-filters", vm.filters);
				}, true);
			});
		}

		function getMonsterQtyString() {
			var qty = Object.keys(vm.encounter.groups).reduce(function (sum, key) {
				return sum + vm.encounter.groups[key].qty;
			}, 0);

			if ( qty === 1 ) {
				return "1 enemy";
			}

			return qty + " enemies";
		};
	}
})();

(function() {
    'use strict';

    angular
        .module('app')
        .component('groupInfo', {
            controller: 'GroupInfoController',
            controllerAs: 'vm',
            templateUrl: 'app/encounter-builder/group-info.html'
        });
})();
(function() {
'use strict';

  angular
    .module('app')
    .controller('GroupInfoController', GroupInfoController);

  GroupInfoController.$inject = ['encounter', 'playerLevels'];
  function GroupInfoController(encounter, playerLevels) {
    var vm = this;

    vm.encounter = encounter;
    vm.levels = playerLevels;
    vm.updateAndSave = updateAndSave;
    
    activate();

    ////////////////

    function activate() { }

    function updateAndSave() {      
      encounter.recalculateThreatLevels();
      encounter.freeze();
    }
  }
})();
(function() {
'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('app')
        .component('monsterTable', {
            templateUrl: 'app/encounter-builder/monster-table.html',
            controller: 'monsterTableController',
            controllerAs: 'vm',
            bindings: {
                filters: '<'
            },
        });
})();
(function() {
'use strict';

    angular.module('app')
        .controller('monsterTableController', MonsterTableController);
    
    MonsterTableController.$inject = ['encounter', 'monsters', 'sources'];
    function MonsterTableController(encounter, monsters, sources) {
        var vm = this;
        
        vm.encounter = encounter;
        vm.monsters = monsters.all;
        vm.sources = sources;
        vm.dangerZone = dangerZone;
        
        ////////////////

        vm.$onInit = function() { };
        vm.$onChanges = function(changesObj) { };
        vm.$onDestory = function() { };

        function dangerZone(monster) {
            if ( !monster ) {
                return null;
            }

            var threat = encounter.threat,
                monsterExp = monster.cr.exp;
                
            if ( monsterExp > threat.deadly ) {
                return "deadly";
            } else if ( monsterExp > threat.hard ) {
                return "hard";
            } else if ( monsterExp > threat.medium ) {
                return "medium";
            } else if ( monsterExp > threat.easy ) {
                return "easy";
            } else if ( monsterExp > threat.pair ) {
                return "pair";
            } else if ( monsterExp > threat.group ) {
                return "group";
            } else {
                return "trivial";
            }
        };
    }
})();

(function() {
'use strict';

    angular
        .module('app')
        .component('searchControls', {
            templateUrl: 'app/encounter-builder/search.html',
            controller: 'SearchController',
            controllerAs: 'vm',
            bindings: {
                filters: '<'
            },
        });
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', 'sources', 'metaInfo', 'store'];
    function SearchController($scope, sources, metaInfo, store) {
        var vm = this;

        vm.alignments = metaInfo.alignments;
        vm.crList = metaInfo.crList;
        vm.environments = metaInfo.environments;
        vm.sizes = metaInfo.sizes;
        vm.sourceNames = sources.all;
        vm.types = metaInfo.types;

        vm.resetFilters = resetFilters;
        vm.updateSourceFilters = updateSourceFilters;

        activate();

        ////////////////

        function activate() {
        }

        function resetFilters() {
            vm.filters.size = null;
            vm.filters.type = null;
            vm.filters.alignment = null;
            vm.filters.minCr = null;
            vm.filters.maxCr = null;
            vm.filters.environment = null;
        };

        function updateSourceFilters(newValue) {
            if (newValue) {
                vm.filters.sources = newValue;
            }
            // The default is core, but for implementation reasons it's represented by the empty string
            var sourceTypes = vm.filters.sources || "core",
                select = [ ],
                i;

            if ( sourceTypes === "custom" ) {
                return;
            }

            if ( sourceTypes.match(/all|core|books/) ) {
                select.push("Player's Handbook");
                select.push("Monster Manual");
                select.push("Volo's Guide to Monsters");
            }

            if ( sourceTypes.match(/all|books/) ) {
                select.push("Hoard of the Dragon Queen");
                select.push("Rise of Tiamat");
                select.push("Princes of the Apocalypse");
                select.push("Out of the Abyss");
                select.push("Curse of Strahd");
                select.push("Storm King's Thunder"); 
            }

            if ( sourceTypes.match(/all|basic/) ) {
                select.push("Basic Rules v1");
                select.push("HotDQ supplement");
                select.push("Princes of the Apocalypse Online Supplement v1.0");
            }
            
            if ( sourceTypes.match(/all|thirdparty/) ) {
                select.push("Monster-A-Day");
                select.push("Fifth Edition Foes");
                select.push("Primeval Thule Campaign Setting");
                select.push("Primeval Thule Gamemaster's Companion");
                select.push("Tome of Beasts");
            }

            for ( i = 0; i < sources.all.length; i++ ) {
                vm.filters.source[sources.all[i]] = false;
            }

            while (select.length) {
                vm.filters.source[select.pop()] = true;
            }
        };
    }
})();
(function() {
	'use strict';

	angular
		.module('app')
		.controller('EncounterManagerController', EncounterManagerController);

	EncounterManagerController.$inject = ['$scope', '$state', 'actionQueue', 'encounter', 'library', 'monsters'];

	function EncounterManagerController($scope, $state, actionQueue, encounter, library, monsters) {
		var vm = this;

		vm.encounter = encounter;
		vm.library = library;
		vm.monsters = monsters;

		vm.save = save;

		activate();

		///////////////////
		
		function activate() {
			var placeholder = [];

			Object.keys(encounter.groups).forEach(function (id) {
				placeholder.push([
					(encounter.groups[id].qty > 1) ? encounter.groups[id].qty + "x" : "",
					encounter.groups[id].monster.name,
				].join(" "));
			});

			vm.newEncounter = {
				placeholder: placeholder.join(", "),
				name: "",
			};
		}

		function save() {
			var newLibraryEntry = {
					name: vm.newEncounter.name || vm.newEncounter.placeholder,
					groups: {},
			};

			Object.keys(encounter.groups).forEach(function (id) {
				newLibraryEntry.groups[id] = encounter.groups[id].qty;
			});
			
			encounter.reference = library.store(newLibraryEntry);
		}

		vm.calculateExp = function (storedEncounter) {
			var exp = 0;

			Object.keys( storedEncounter.groups ).forEach(function (id) {
				exp += monsters.byId[id].cr.exp * storedEncounter.groups[id];
			});

			return exp;
		};

		vm.load = function (storedEncounter) {
			encounter.reset(storedEncounter);

			if ( !actionQueue.next($state) ) {
				$state.go("encounter-builder");
			}
		};

		vm.remove = function ( storedEncounter ) {
			library.remove(storedEncounter);

			if ( angular.equals(encounter.reference, storedEncounter) ) {
				encounter.reference = null;
			}
		};
	}
})();
(function() {
'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('app')
        .component('managerRow', {
            templateUrl:'app/encounter-manager/manager-row.html',
            controller: 'managerRowController',
            controllerAs: 'vm',
            bindings: {
                storedEncounter: '<'
            }
        });
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('managerRowController', ManagerRowController);

    ManagerRowController.$inject = ['$state', 'encounter', 'monsters', 'actionQueue', 'library'];
    function ManagerRowController($state, encounter, monsters, actionQueue, library) {
        var vm = this;

        vm.calculateExp = calculateExp;
        vm.load = load;
        vm.remove = remove;
        vm.encounter = encounter;
        vm.monsters = monsters;

        activate();

        ////////////////

        function activate() { }

        function calculateExp(storedEncounter) {
			var exp = 0;

			_.forEach(storedEncounter.groups, function (value, id) {
				exp += monsters.byId[id].cr.exp * storedEncounter.groups[id];
			});

			return exp;
		};

		function load(storedEncounter) {
			encounter.reset(storedEncounter);

			if ( !actionQueue.next($state) ) {
				$state.go("encounter-builder");
			}
		};

        function remove( storedEncounter ) {
			library.remove(storedEncounter);

			if ( angular.equals(encounter.reference, storedEncounter) ) {
				encounter.reference = null;
			}
		};
    }
})();
(function() {
	"use strict";

	angular.module("app")
		.filter("monstersFilter", SortAndFilterMonsters);

	SortAndFilterMonsters.$inject = ["monsterFactory"];

	function SortAndFilterMonsters(monsterLib) {
		return function ( input, filters ) {
			if (!input) return [];
			var output = [], i;

			for ( i = 0; i < input.length; i++ ) {
				if ( monsterLib.checkMonster(input[i], filters) ) {
					output.push(input[i]);
				}
			}

			// Monsters are already sorted by name
			if ( filters.sort === "size" ) {
				output.sort(function (a, b) {
					return a.sizeSort - b.sizeSort;
				});
			} else if ( filters.sort === "type" ) {
				output.sort(function (a, b) {
					return (a.type > b.type) ? 1 : -1;
				});
			} else if ( filters.sort === "alignment" ) {
				output.sort(function (a, b) {
					return ((a.alignment||{text:"zzzzzzz"}).text > (b.alignment||{text:"zzzzzzz"}).text) ? 1 : -1;
				});
			} else if ( filters.sort === "cr" ) {
				output.sort(function (a, b) {
					return a.cr.numeric - b.cr.numeric;
				});
			}

			return output;
		};
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.filter("positive", function PositiveFilter() {
				return function ( input ) {
					input = input || '';
					var output = [],
						i;

					for ( i = 0; i < input.length; i++ ) {
						if ( input[i] > 0 ) {
							output.push(input[i]);
						}
					}

					return output;
				};
			})
		.filter("negative", function NegativeFilter() {
				return function ( input ) {
					input = input || '';
					var output = [],
						i;

					for ( i = 0; i < input.length; i++ ) {
						if ( input[i] < 0 ) {
							output.push(input[i]);
						}
					}

					return output;
				};
			});
})();

(function() {
	'use strict';

	angular.module('app')
		.filter('sortEncounter', SortEncounter);

	function SortEncounter() {
		return function (items) {
			var sorted = [];

			Object.keys(items).forEach(function (key) {
				sorted.push(items[key]);
			});

			sorted.sort(function (a, b) {
				return (a.monster.name > b.monster.name) ? 1 : -1;
			});

			return sorted;
		};
	}
})();
(function() {
	"use strict";

	angular.module("app")
		.service("alignments", AlignmentsService);

	function AlignmentsService() {
		var i = 0,
			lg = Math.pow(2, i++),
			ng = Math.pow(2, i++),
			cg = Math.pow(2, i++),
			ln = Math.pow(2, i++),
			n  = Math.pow(2, i++),
			cn = Math.pow(2, i++),
			le = Math.pow(2, i++),
			ne = Math.pow(2, i++),
			ce = Math.pow(2, i++),
			unaligned = Math.pow(2, i++);
		return {
			any: {
				text: "any",
				flags: lg | ng | cg | ln | n | cn | le | ne | ce
			},
			any_chaotic: {
				text: "any chaotic",
				flags: cg | cn | ce
			},
			any_evil: {
				text: "any evil",
				flags: le | ne | ce
			},
			any_good: {
				text: "any good",
				flags: lg | ng | cg
			},
			any_lawful: {
				text: "any lawful",
				flags: lg | ln | le
			},
			any_neutral: {
				text: "any neutral",
				flags: ng | ln | n | cn | ne
			},
			non_chaotic: {
				text: "non-chaotic",
				flags: lg | ng | ln | n | le | ne | unaligned
			},
			non_evil: {
				text: "non-evil",
				flags: lg | ng | cg | ln | n | cn | unaligned
			},
			non_good: {
				text: "non-good",
				flags: ln | n | cn | le | ne | ce | unaligned
			},
			non_lawful: {
				text: "non-lawful",
				flags: ng | cg | n | cn | ne | ce | unaligned
			},
			unaligned: {
				text: "unaligned",
				flags: unaligned 
			},
			ln_le: {
				text: "lawful neutral or lawful evil",
				flags: ln | le
			}, 
			ne_le: {
				text: "neutral evil or lawful evil",
				flags: ne | le
			}, 
			cg_cn: {
				text: "chaotic good or chaotic neutral",
				flags: cg | cn
			}, 
			lg: { flags: lg, text: "lawful good" },
			ng: { flags: ng, text: "neutral good" },
			cg: { flags: cg, text: "chaotic good" },
			ln: { flags: ln, text: "lawful nuetral" },
			n:  { flags: n,  text: "neutral" },
			cn: { flags: cn, text: "chaotic nuetral" },
			le: { flags: le, text: "lawful evil" },
			ne: { flags: ne, text: "neutral evil" },
			ce: { flags: ce, text: "chaotic evil" },
		};
	};
})();

(function () {
	"use strict";

	angular.module("app")
		.service("crInfo", CrInfoService);

	function CrInfoService() {
		return {
			"0":	{ string: "0",		numeric: 0,		exp: 10		},
			"1/8":	{ string: "1/8",	numeric: 0.125,	exp: 25		},
			"1/4":	{ string: "1/4",	numeric: 0.25,	exp: 50		},
			"1/2":	{ string: "1/2",	numeric: 0.5,	exp: 100	},
			"1":	{ string: "1",		numeric: 1,		exp: 200	},
			"2":	{ string: "2",		numeric: 2,		exp: 450	},
			"3":	{ string: "3",		numeric: 3,		exp: 700	},
			"4":	{ string: "4",		numeric: 4,		exp: 1100	},
			"5":	{ string: "5",		numeric: 5,		exp: 1800	},
			"6":	{ string: "6",		numeric: 6,		exp: 2300	},
			"7":	{ string: "7",		numeric: 7,		exp: 2900	},
			"8":	{ string: "8",		numeric: 8,		exp: 3900	},
			"9":	{ string: "9",		numeric: 9,		exp: 5000	},
			"10":	{ string: "10",		numeric: 10,	exp: 5900	},
			"11":	{ string: "11",		numeric: 11,	exp: 7200	},
			"12":	{ string: "12",		numeric: 12,	exp: 8400	},
			"13":	{ string: "13",		numeric: 13,	exp: 10000	},
			"14":	{ string: "14",		numeric: 14,	exp: 11500	},
			"15":	{ string: "15",		numeric: 15,	exp: 13000	},
			"16":	{ string: "16",		numeric: 16,	exp: 15000	},
			"17":	{ string: "17",		numeric: 17,	exp: 18000	},
			"18":	{ string: "18",		numeric: 18,	exp: 20000	},
			"19":	{ string: "19",		numeric: 19,	exp: 22000	},
			"20":	{ string: "20",		numeric: 20,	exp: 25000	},
			"21":	{ string: "21",		numeric: 21,	exp: 33000	},
			"22":	{ string: "22",		numeric: 22,	exp: 41000	},
			"23":	{ string: "23",		numeric: 23,	exp: 50000	},
			"24":	{ string: "24",		numeric: 24,	exp: 62000	},
			"25":	{ string: "25",		numeric: 25,	exp: 75000	},
			"26":	{ string: "26",		numeric: 26,	exp: 90000	},
			"27":	{ string: "27",		numeric: 27,	exp: 105000	},
			"28":	{ string: "28",		numeric: 28,	exp: 120000	},
			"29":	{ string: "29",		numeric: 29,	exp: 135000	},
			"30":	{ string: "30",		numeric: 30,	exp: 155000	},
		};
	}
})();

(function() {
'use strict';

  angular
    .module('app')
    .value('playerLevels', {
      1: { level: 1,		easy: 25,	medium: 50,		hard: 75,	deadly: 100 },
      2: { level: 2,		easy: 50,	medium: 100,	hard: 150,	deadly: 200 },
      3: { level: 3,		easy: 75,	medium: 150,	hard: 225,	deadly: 400 },
      4: { level: 4,		easy: 125,	medium: 250,	hard: 375,	deadly: 500 },
      5: { level: 5,		easy: 250,	medium: 500,	hard: 750,	deadly: 1100 },
      6: { level: 6,		easy: 300,	medium: 600,	hard: 900,	deadly: 1400 },
      7: { level: 7,		easy: 350,	medium: 750,	hard: 1100,	deadly: 1700 },
      8: { level: 8,		easy: 450,	medium: 900,	hard: 1400,	deadly: 2100 },
      9: { level: 9,		easy: 550,	medium: 1100,	hard: 1600,	deadly: 2400 },
      10: { level: 10,	easy: 600,	medium: 1200,	hard: 1900,	deadly: 2800 },
      11: { level: 11,	easy: 800,	medium: 1600,	hard: 2400,	deadly: 3600 },
      12: { level: 12,	easy: 1000,	medium: 2000,	hard: 3000,	deadly: 4500 },
      13: { level: 13,	easy: 1100,	medium: 2200,	hard: 3400,	deadly: 5100 },
      14: { level: 14,	easy: 1250,	medium: 2500,	hard: 3800,	deadly: 5700 },
      15: { level: 15,	easy: 1400,	medium: 2800,	hard: 4300,	deadly: 6400 },
      16: { level: 16,	easy: 1600,	medium: 3200,	hard: 4800,	deadly: 7200 },
      17: { level: 17,	easy: 2000,	medium: 3900,	hard: 5900,	deadly: 8800 },
      18: { level: 18,	easy: 2100,	medium: 4200,	hard: 6300,	deadly: 9500 },
      19: { level: 19,	easy: 2400,	medium: 4900,	hard: 7300,	deadly: 10900 },
      20: { level: 20,	easy: 2800,	medium: 5700,	hard: 8500,	deadly: 12700 }
    });
})();
(function() {
	"use strict";

	angular.module("app")
		.factory("monsterFactory", MonsterFactory);

	MonsterFactory.$inject = ["alignments", "crInfo"];

	function MonsterFactory(alignments, crInfo) {
		var factory = {
			checkMonster: checkMonster,
			Monster: Monster,
		};

		return factory;

		function Monster(args) {
			var monster = this;
			monster.id = args.id;
			monster.name = args.name;
			monster.section = args.section;
			monster.ac = args.ac;
			monster.hp = args.hp;
			monster.init = args.init;
			monster.cr = crInfo[args.cr];
			monster.type = args.type;
			monster.tags = (args.tags) ? args.tags.sort() : undefined;
			monster.size = args.size;
			monster.alignment = args.alignment || alignments.unaligned;
			monster.special = args.special;
			monster.environments = (args.environments) ? args.environments.sort() : [];
			monster.legendary = args.legendary;
			monster.lair = args.lair;
			monster.unique = args.unique;
			monster.sources = [];

			monster.sizeSort = parseSize(monster.size);
			monster.searchable = [
				monster.name,
				monster.section,
				monster.type,
				monster.size,
				(monster.alignment) ? monster.alignment.text : "",
			].concat(
				monster.cr
			).concat(
				monster.tags
			).join("|").toLowerCase();
		}

		function parseSize(size) {
			switch ( size ) {
				case "Tiny": return 1;
				case "Small": return 2;
				case "Medium": return 3;
				case "Large": return 4;
				case "Huge": return 5;
				case "Gargantuan": return 6;
				default: return -1;
			}
		}

		function checkMonster(monster, filters, args) {
			args = args || {};

			if ( filters.type && monster.type !== filters.type ) {
				return false;
			}

			if ( filters.size && monster.size !== filters.size ) {
				return false;
			}

			if ( args.nonUnique && monster.unique ) {
				return false;
			}

			if ( filters.alignment ) {
				if ( !monster.alignment ) {
					return false;
				}

				if ( ! (filters.alignment.flags & monster.alignment.flags) ) {
					return false;
				}
			}

			if ( !args.skipCrCheck ) {
				if ( filters.minCr && monster.cr.numeric < filters.minCr ) {
					return false;
				}

				if ( filters.maxCr && monster.cr.numeric > filters.maxCr ) {
					return false;
				}
			}

			if ( filters.environment && monster.environments.indexOf(filters.environment) === -1 ) {
				return false;
			}

			if ( !isInSource(monster, filters.source) ) {
				return false;
			}

			if ( filters.search && monster.searchable.indexOf(filters.search.toLowerCase()) === -1 ) {
				return false;
			}

			return true;
		}

		function isInSource(monster, sources) {
			if ( !monster || !monster.sources) {
				return false;
			}

			for ( var i = 0; i < monster.sources.length; i++ ) {
				if ( sources[monster.sources[i].name] ) {
					return true;
				}
			}

			return false;
		}
	}
})();
(function() {
'use strict';

  // Usage:
  // 
  // Creates:
  // 

  angular
    .module('app')
    .component('navbar', {
      templateUrl: 'app/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: "vm",
      bindings: {
      },
    });

  function NavbarController() {
    var vm = this;
  }
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('EditPlayersController', EditPlayersController);

    EditPlayersController.$inject = ['players'];

    function EditPlayersController(players) {
        var vm = this;
        vm.players = players;

        activate();

        ////////////////

        function activate() { }
    }
})();
(function() {
'use strict';

    angular
        .module('app')
        .controller('ManagePlayersController', ManagePlayersController);

    ManagePlayersController.$inject = ['$state', 'actionQueue', 'players'];

    function ManagePlayersController($state, actionQueue, players) {
        var vm = this;

        vm.players = players;

        vm.select = function (party) {
            players.selectParty(party);

            actionQueue.next($state);
        };    

        activate();

        ////////////////

        function activate() { 
            // If there aren't any parties, send them to edit
            if ( !players.parties || !players.parties.length ) {
                $state.go("players.edit");
                return;
            }
        }
    }
})();
(function() {
'use strict';

	angular
		.module('app')
		.controller('PlayersController', PlayersController);

	PlayersController.$inject = [];
	
	function PlayersController() {
		var vm = this;

		activate();

		////////////////

		function activate() { }
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("actionQueue", ActionQueueService);


	function ActionQueueService() {
		var actionQueue = {
				actions: [],
				currentInstruction: "",
				clear: function () {
					actionQueue.actions.length = 0;
					actionQueue.currentInstruction = "";
				},
				next: function ($state) {
					if ( actionQueue.actions.length ) {
						var current = actionQueue.actions.shift();
						actionQueue.currentInstruction = current.message || "";

						$state.go(current.state);
						return true;
					}

					return false;
				},
				queue: function (nextState, message) {
					actionQueue.actions.push({ state: nextState, message: message });
				},
				unshift: function (nextState, message) {
					// First check to make sure this state isn't already in the queue
					var i = 0;
					while ( i < actionQueue.actions.length ) {
						if ( actionQueue.actions[i].state === nextState ) {
							actionQueue.actions.splice(i, 1);
						} else {
							i++;
						}
					}

					actionQueue.actions.unshift({ state: nextState, message: message });
				}
		};

		return actionQueue;
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("combat", CombatService);

	CombatService.$inject = ['store', 'encounter', 'integration', 'players', 'monsters', 'combatConstants'];

	function CombatService(store, encounter, integration, players, monsters, constants) {
		var combat = {
			active: 0,
			combatants: [],
			delta: 0,
			addMonster: function (monster, qty) {
				qty = qty || 1;

				var i, name;

				for ( i = 0; i < qty; i++ ) {
					name = [ monster.name ];

					if ( qty > 1 ) {
						name.push( i + 1 );
					}

					combat.combatants.push({
						type: "enemy",
						name: name.join(" "),
						ac: monster.ac,
						hp: monster.hp,
						initiativeMod: monster.init,
						initiative: 10 + monster.init,
						id: monster.id,
					});
				}
			},
			addLair: function () {
				combat.combatants.push({
					type: "lair",
					name: "Lair",
					iniativeMod: 0,
					initiative: 20,
					fixedInitiative: true,
					noHp: true,
				});
			},
			addPlayer: function (player) {
				combat.combatants.push({
					type: "player",
					name: player.name,
					initiativeMod: player.initiativeMod,
					initiative: player.initiative,
					hp: player.hp,
					damage: player.damage,
				});
			},
			applyDelta: function (combatant, multiplier) {
				multiplier = multiplier || 1;
				// Make sure damage is initialized
				combatant.damage = combatant.damage || 0;

				combatant.damage += combat.delta * multiplier;
				combat.delta = 0;

				// Damage can't reduce you below 0
				if ( combatant.damage > combatant.hp ) {
					combatant.damage = combatant.hp;
				}

				// Damage can't be negative
				if ( combatant.damage < 0 ) {
					combatant.damage = 0;
				}

				if ( combatant.type === "player" ) {
					players.setDamage(combatant.name, combatant.damage);
				}
			},
			begin: function () {
				combat.combatants.sort(function (a, b) {
					return b.initiative - a.initiative;
				});

				if (combat.combatants.length > 0) {			
					combat.combatants[combat.active].active = true;
				}
			},
			init: function () {
				combat.combatants.length = 0;
				combat.active = 0;
				combat.delta = 0;

				var monsterIds = Object.keys(encounter.groups),
					lair = false,
					i, monster, qty, player,
					retValue = 0;

				if ( ! monsterIds.length ) {
					// If there aren't any monsters, we can't run an encounter
					retValue |= constants.NO_MONSTERS;
				}

				if ( ! players.selectedParty ) {
					// If there aren't any players, we can't run the encounter either...
					retValue |= constants.NO_PLAYERS;
				}

				if ( retValue ) {
					return retValue;
				}

				for ( i = 0; i < players.selectedParty.length; i++ ) {
					player = players.selectedParty[i];
					combat.addPlayer({
						name: player.name,
						initiativeMod: player.initiativeMod,
						initiative: player.initiativeMod + 10,
						hp: player.hp,
						damage: player.damage,
					});
				}

				for ( i = 0; i < monsterIds.length; i++ ) {
					monster = monsters.byId[monsterIds[i]];
					qty = encounter.groups[monsterIds[i]].qty;
					lair = lair || monster.lair;

					combat.addMonster(monster, qty);
				}

				if ( lair ) {
					combat.addLair();
				}

				return constants.READY;
			},
			nextTurn: function () {
				combat.combatants[combat.active].active = false;
				combat.active = ( combat.active + 1 ) % combat.combatants.length;
				combat.combatants[combat.active].active = true;
			},
			rollInitiative: function (combatant) {
				var initRoll = _.random(20) + 1;
				combatant.initiative = initRoll + combatant.initiativeMod;
				combatant.initiativeRolled = true;
			},
		};

		combat.init();

		return combat;
	}
})();

(function () {
	"use strict";

	angular.module("app")
		.factory("encounter", EncounterService);

	EncounterService.$inject = ['$rootScope', '$log', 'randomEncounter', 'store', 'monsters', 'players', 'misc', 'playerLevels'];

	function EncounterService($rootScope, $log, randomEncounter, store, monsters, players, miscLib, playerLevels) {
		var encounter = {
				groups: {},
				partyLevel: playerLevels[1],
				playerCount: 4,
				reference: null,
				threat: {},
				add: function (monster, qty) {
					if ( typeof qty === "undefined" ) {
						qty = 1;
					}

					encounter.groups[monster.id] = encounter.groups[monster.id] || {
						qty: 0,
						monster: monster,
					};

					encounter.groups[monster.id].qty += qty;
					encounter.qty += qty;
					encounter.exp += monster.cr.exp * qty;

					encounter.reference = null;
				},
				generateRandom: function (filters, targetDifficulty) {
					targetDifficulty = targetDifficulty || 'medium';
					var targetExp = encounter.partyLevel[targetDifficulty];
					var monsters = randomEncounter.getRandomEncounter(encounter.playerCount, targetExp, filters),
						i;

					encounter.reset();

					for ( i = 0; i < monsters.length; i++ ) {
						encounter.add( monsters[i].monster, monsters[i].qty );
					}
				},
				randomize: function (monster, filters) {
					var monsterList = randomEncounter.getShuffledMonsterList(monster.cr.string),
						qty = encounter.groups[monster.id].qty;

					while ( monsterList.length ) {
						// Make sure we don't roll a monster we already have
						if ( encounter.groups[monsterList[0].name] ) {
							monsterList.shift();
							continue;
						}

						if ( monsters.check( monsterList[0], filters, { skipCrCheck: true } ) ) {
							encounter.remove(monster, true);
							encounter.add( monsterList[0], qty );
							return;					
						} else {
							monsterList.shift();
						}
					}
				},
				recalculateThreatLevels: function () {
					var count = encounter.playerCount,
						level = encounter.partyLevel,
						mediumExp = count * level.medium,
						singleMultiplier  = 1,
						pairMultiplier    = 1.5,
						groupMultiplier   = 2,
						trivialMultiplier = 2.5;
					
					if ( count < 3 ) {
						// For small groups, increase multiplier
						singleMultiplier  = 1.5;
						pairMultiplier    = 2;
						groupMultiplier   = 2.5;
						trivialMultiplier = 3;
					} else if ( count > 5 ) {
						// For large groups, reduce multiplier
						singleMultiplier  = 0.5;
						pairMultiplier    = 1;
						groupMultiplier   = 1.5;
						trivialMultiplier = 2;
					}

					encounter.threat.deadly  = count * level.deadly / singleMultiplier;
					encounter.threat.hard    = count * level.hard / singleMultiplier;
					encounter.threat.medium  = mediumExp / singleMultiplier;
					encounter.threat.easy    = count * level.easy / singleMultiplier;
					encounter.threat.pair    = mediumExp / ( 2 * pairMultiplier );
					encounter.threat.group   = mediumExp / ( 4 * groupMultiplier );
					encounter.threat.trivial = mediumExp / ( 8 * trivialMultiplier );
				},
				remove: function (monster, removeAll) {
					encounter.groups[monster.id].qty--;
					encounter.qty--;
					encounter.exp -= monster.cr.exp;
					if ( encounter.groups[monster.id].qty === 0 ) {
						delete encounter.groups[monster.id];
					} else if ( removeAll ) {
						// Removing all is implemented by recurively calling this function until the
						// qty is 0
						encounter.remove(monster, true);
					}

					encounter.reference = null;
				},
				reset: function (storedEncounter) {
					encounter.reference = null;
					encounter.qty = 0;
					encounter.exp = 0;
					encounter.groups = {};
					encounter.threat = {};

					if (storedEncounter) {
						Object.keys(storedEncounter.groups).forEach(function (id) {
							encounter.add(
								monsters.byId[id],
								storedEncounter.groups[id],
								{ skipFreeze: true }
							);
						});

						encounter.reference = storedEncounter;
					}

					encounter.recalculateThreatLevels();
				},

				get adjustedExp() {
					var qty = encounter.qty,
					exp = encounter.exp,
					multiplier = miscLib.getMultiplier(encounter.playerCount, qty);

					return Math.floor(exp * multiplier);
				},

				get difficulty() {
					var exp = encounter.adjustedExp,
						count = encounter.playerCount,
						level = encounter.partyLevel;

					if ( exp === 0 ) {
						return false;
					}

					if ( exp < ( count * level.easy ) ) {
						return '';
					} else if ( exp < ( count * level.medium ) ) {
						return "Easy";
					} else if ( exp < ( count * level.hard ) ) {
						return "Medium";
					} else if ( exp < ( count * level.deadly ) ) {
						return "Hard";
					} else {
						return "Deadly";
					}
				},

				initialize: initialize,
				thaw: thaw,
				freeze: freeze
		};

		return encounter;
		
		function initialize() {
			thaw().then(function () {
				encounter.recalculateThreatLevels();
			});
		}

		function freeze() {
			var o = {
				groups: {},
				partyLevel: encounter.partyLevel.level,
				playerCount: encounter.playerCount,
			};

			$log.log("Freezing party info", o);

			Object.keys(encounter.groups).forEach(function (monsterId) {
				o.groups[monsterId] = encounter.groups[monsterId].qty;
			});

			store.set("5em-encounter", o);
		}

		function thaw() {
			$log.log('Thawing party info');
			encounter.reset();

			return store.get("5em-encounter").then(function (frozen) {
				if ( !frozen ) {
					return;
				}

				$log.log('Load party level (' + frozen.partyLevel + ') and player count (' + frozen.playerCount + ') from the store');
				encounter.partyLevel = playerLevels[frozen.partyLevel];
				encounter.playerCount = frozen.playerCount;
			});
		}
	}
})();
(function() {
	"use strict";

	angular.module("app")
		.factory("integration", ExportService);


	// var payload = [{ "Name": "Nemo", "HP": { "Value": 10 } }, { "Name": "Fat Goblin", "HP": { "Value": 20 }, "Id": "mm.goblin"}, { "Id": "mm.goblin"}];
	var target = "http://improved-initiative.com/launchencounter/";
	var sourcePrefixes = [
		// Core books
		{ name: "Monster Manual", prefix: "mm" },
		{ name: "Volo's Guide to Monsters", prefix: "volo" },

		// Official adventures
		{ name: "Curse of Strahd", prefix: "strahd" },
		{ name: "Hoard of the Dragon Queen", prefix: "hoard" },
		{ name: "Out of the Abyss", prefix: "abyss" },
		{ name: "Princes of the Apocalypse", prefix: "apoc" },
		{ name: "Rise of Tiamat", prefix: "tiamat" },
		{ name: "Storm King's Thunder", prefix: "sking" },

		// Third-party
		{ name: "Fifth Edition Foes", prefix: "5ef" },
		{ name: "Monster-A-Day", prefix: "mad" },
		{ name: "Primeval Thule Campaign Setting", prefix: "thule-cs" },
		{ name: "Primeval Thule Gamemaster's Companion", prefix: "thule-gm" },
		{ name: "Tome of Beasts", prefix: "tob" },
	];

	ExportService.$inject = ["$document", "encounter", "players"];
	function ExportService($document, encounter, players) {
		function launchImpInit() {
			var payload = generatePayload({
				monsters: encounter.groups,
				players: players.selectedParty,
			});

			console.log(payload);

			openWindow({
				document: $document,
				target: target,
				data: { Combatants: payload },
			});
		}

		window.encounter = encounter;
		window.players = players;

		return {
			launchImpInit: launchImpInit,
		};
	}

	function generateFid(monster) {
		// Sources in order of precedence
		var prefix = "unknown";
		sourcePrefixes.some(function (definition) {
			var monsterInSource = monster.sources.some(function (monsterSource) {
				return (monsterSource.name == definition.name);
			});

			if ( monsterInSource ) {
				prefix = definition.prefix;
			}

			return monsterInSource;
		});

		var scrubbedName = monster.name
			.toLowerCase()
			.replace(/ /g, "-")
			.replace(/--+/g, "-")
			.replace(/[^-a-z0-9]/g, "");

		return [prefix, scrubbedName].join(".");
	}

	function generatePayload(args) {
		var combatants = [];

		Object.keys(args.monsters).forEach(function (guid) {
			var monsterGroup = args.monsters[guid];
			var monster = monsterGroup.monster;
			var qty = monsterGroup.qty;
			var fid = generateFid(monster);

			var i;
			for ( i = 1; i <= qty; i++ ) {

				combatants.push({
					Name: monster.name,
					HP: { Value: monster.hp },
					InitiativeModifier: monster.init,
					AC: { Value: monster.ac },
					Player: "npc",
					Id: fid,
				});
			}
		});

		args.players.forEach(function (player) {
			combatants.push({
				Name: player.name,
				InitiativeModifier: player.initiativeMod,
				HP: { Value: player.hp },
				Player: "player",
			});
		});

		return combatants;
	}

	function openWindow(args) {
		var form = document.createElement("form");
		form.style.display = "none";
		form.setAttribute("method", "POST");
		// form.setAttribute("target", "self");
		form.setAttribute("action", args.target);

		Object.keys(args.data).forEach(function (key) {
			var textarea = document.createElement("input");
			textarea.setAttribute("type", "hidden");
			textarea.setAttribute("name", key);
			textarea.setAttribute("value", JSON.stringify(args.data[key]));

			form.appendChild(textarea);
		});

		args.document[0].body.appendChild(form);
		form.submit();
		form.parentNode.removeChild(form);
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("library", LibraryService);

	LibraryService.$inject = ["$rootScope", "$log", "store"];

	function LibraryService($rootScope, $log, store) {
		var library = {
				encounters: [],
				remove: function (storedEncounter) {
					library.encounters.splice(library.encounters.indexOf(storedEncounter), 1);

					freeze();
				},
				store: function (encounter) {
					 for ( var i = 0; i < library.encounters.length; i++ ) {
					 	if ( angular.equals(encounter, library.encounters[i]) ) {
					 		return library.encounters[i];
					 	}
					 }

					library.encounters.push(encounter);
					freeze();

					return encounter;
				}
		};

		thaw();

		function freeze() {
			$log.log('Freeze library');
			store.set("5em-library", library.encounters);
		}

		function thaw() {
			$log.log('Thaw library');
			store.get("5em-library").then(function (frozen) {
				if (frozen) {
					library.encounters = frozen;
				}
			});
		}

		return library;
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("metaInfo", MetaInfoService);

	MetaInfoService.$inject = ['misc', 'alignments', 'crInfo'];
	
	function MetaInfoService(miscLib, alignments, crInfo) {
		var metaInfo = {
			alignments: alignments,
			crInfo: crInfo,
			crList: [
				crInfo["0"],	crInfo["1/8"],	crInfo["1/4"],	crInfo["1/2"],
				crInfo["1"],	crInfo["2"],	crInfo["3"],	crInfo["4"],
				crInfo["5"],	crInfo["6"],	crInfo["7"],	crInfo["8"],
				crInfo["9"],	crInfo["10"],	crInfo["11"],	crInfo["12"],
				crInfo["13"],	crInfo["14"],	crInfo["15"],	crInfo["16"],
				crInfo["17"],	crInfo["18"],	crInfo["19"],	crInfo["20"],
				crInfo["21"],	crInfo["22"],	crInfo["23"],	crInfo["24"],
				crInfo["25"],	crInfo["26"],	crInfo["27"],	crInfo["28"],
				crInfo["29"],	crInfo["30"],
			],
			environments: [
				"aquatic",
				"arctic",
				"cave",
				"coast",
				"desert",
				"dungeon",
				"forest",
				"grassland",
				"mountain",
				"planar",
				"ruins",
				"swamp",
				"underground",
				"urban",
			],
			tags: miscLib.tags,
			sizes: [
				"Tiny",
				"Small",
				"Medium",
				"Large",
				"Huge",
				"Gargantuan",
			],
			types: [
				"Aberration",
				"Beast",
				"Celestial",
				"Construct",
				"Dragon",
				"Elemental",
				"Fey",
				"Fiend",
				"Giant",
				"Humanoid",
				"Monstrosity",
				"Ooze",
				"Plant",
				"Undead",
			],
		};

		return metaInfo;
	}
})();
(function() {
	"use strict";

	angular.module("app")
		.factory('misc', MiscService);

	function MiscService() {

		var crs = [],
			sourceFilters = {},
			sources = [],
			shortNames = {},
			tags = {},
			i;

		crs.push({ text: "0", value: 0 });
		crs.push({ text: "1/8", value: 0.125 });
		crs.push({ text: "1/4", value: 0.25 });
		crs.push({ text: "1/2", value: 0.5 });
		for ( i = 1; i < 25; i++ ) {
			crs.push({ text: i.toString(), value: i });
		}

		var service = {		
			getMultiplier: getMultiplier,
			sourceFilters: sourceFilters,
			sources: sources,
			shortNames: shortNames,
			tags: tags,
		};

		return service;

		//////

		function getMultiplier(playerCount, monsterCount) {
			var multiplierCategory,
				multipliers = [
					0.5,
					1,
					1.5,
					2,
					2.5,
					3,
					4,
					5,
				];

			if ( monsterCount === 0 ) {
				return 0;
			} else if ( monsterCount === 1 ) {
				multiplierCategory = 1;
			} else if ( monsterCount === 2 ) {
				multiplierCategory = 2;
			} else if ( monsterCount < 7 ) {
				multiplierCategory = 3;
			} else if ( monsterCount < 11 ) {
				multiplierCategory = 4;
			} else if ( monsterCount < 15 ) {
				multiplierCategory = 5;
			} else {
				multiplierCategory = 6;
			}

			if ( playerCount < 3 ) {
				// Increase multiplier for parties of one and two
				multiplierCategory++;
			} else if ( playerCount > 5 ) {
				// Decrease multiplier for parties of six through eight
				multiplierCategory--;
			}

			return multipliers[multiplierCategory];
		}
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("monsters", Monsters);

	Monsters.$inject = ['monsterData', 'misc', 'monsterFactory', 'metaInfo'];

	function Monsters(data, miscLib, monsterLib, metaInfo) {
		var i, j, m, source,
			all = [],
			byId = {},
			byCr = {};

		window.metaInfo = metaInfo;

		for ( i = 0; i < data.monsters.length; i++ ) {
			m = new monsterLib.Monster(data.monsters[i]);

			all.push(m);
			byId[m.id] = m;

			if ( ! m.special ) {
				if ( ! byCr[m.cr.string] ) {
					byCr[m.cr.string] = [];
				}

				byCr[m.cr.string].push(m);
			}

			// TODO: CP from addMonster. Is this actually used?
			// if (args.tags) {
			// 	register(miscLib.tags, args.tags);
			// }
		}

		for ( i = 0; i < data.sources.length; i++ ) {
			source = data.sources[i];

			miscLib.sources.push(source.name);
			miscLib.sourceFilters[source.name] = source.initialState;
			miscLib.shortNames[source.name] = source.shortName;

			for ( j = 0; j < source.contents.length; j++ ) {
				m = source.contents[j];
				byId[m[0]].sources.push({
					name: source.name,
					page: m[1],
					url: m[2]
				});
			}
		}
		
		all.sort(function (a, b) {
			return (a.name > b.name) ? 1 : -1;
		});

		var service = {
			all: all,
			byCr: byCr,
			byId: byId,
			check: monsterLib.checkMonster,
		};

		return service;
	};
})();

(function () {
	"use strict";

	angular.module("app")
		.factory("players", PlayersService);

	PlayersService.$inject = ["$rootScope", "$log", "store"];

	function PlayersService($rootScope, $log, store) {
		var players = {
				selectedParty: null,
				selectParty: function (party) {
					players.selectedParty = party;
				},
				setDamage: function (name, damage) {
					for ( var i = 0; i < players.selectedParty.length; i++ ) {
						if ( players.selectedParty[i].name === name ) {
							players.selectedParty[i].damage = damage;
							rawDirty = true;
							freeze();
							return;
						}
					}
				},
				initialize: initialize
			},
			rawDirty = true,
			rawText = "",
			partiesDirty,
			parties = [];

		window.players = players;

		Object.defineProperty(players, "raw", {
			get: function () {
				if ( rawDirty ) {
					compileRaw();
				}

				return rawText;
			},
			set: function (value) {
				rawText = value;
				partiesDirty = true;
			},
		});

		Object.defineProperty(players, "parties", {
			get: function () {

				if ( partiesDirty ) {
					compileParties();
				}

				return parties;
			}
		});

		function compileParties() {
			var i, j, m;
			partiesDirty = false;
			parties = rawText.split(/\n\n+/);

			for ( i = 0; i < parties.length; i++ ) {
				parties[i] = parties[i].split("\n");
				for ( j = 0; j < parties[i].length; j++ ) {
					// 1: Name
					// 2: Initiative mod
					// 3: Remaining HP (optional)
					// 4: Max HP
					//                       1       2               3              4
					m = parties[i][j].match(/(.*?)\s+([-+]?\d+)\s+(?:(\d+)\s*\/\s*)?(\d+)\s*$/);

					if ( m ) {
						parties[i][j] = {
							name: m[1],
							initiativeMod: parseInt(m[2]),
							damage: (m[3]) ? m[4] - m[3] : 0,
							hp: parseInt(m[4]),
						};
					} else {
						$log.warn("Can't match:", parties[i][j]);
					}
				}

			}

			rawDirty = true;
			freeze();
		}

		function compileRaw() {
			var i, j, newRaw = [], p;
			rawDirty = false;
			
			for ( i = 0; i < players.parties.length; i++ ) {
				newRaw[i] = [];

				for ( j = 0; j < players.parties[i].length; j++ ) {
					p = players.parties[i][j];
					newRaw[i].push([
						p.name,
						(p.initiativeMod >= 0) ? "+" + p.initiativeMod : p.initiativeMod,
						p.hp - p.damage,
						"/",
						p.hp,
					].join(" "));
				}

				newRaw[i] = newRaw[i].join("\n");
			}

			rawText = newRaw.join("\n\n");
		}

		function initialize() {
			thaw();
		}

		function freeze() {
			$log.log('Freeze players');
			store.set("5em-players", parties);
		}

		function thaw() {
			$log.log('Thaw players');
			store.get("5em-players").then(function (frozen) {
				if (frozen) {
					parties = frozen;
					partiesDirty = false;
					rawDirty = true;
				}
			});
		}

		return players;
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("randomEncounter", RandomEncounterService);

	RandomEncounterService.$inject = ["monsterFactory", "misc", "shuffle", "metaInfo", "monsters"];

	function RandomEncounterService(monsterLib, miscLib, shuffle, metaInfo, monsters) {
		var randomEncounter = {
			getRandomEncounter: function (playerCount, targetExpLevel, filters) {
				var fudgeFactor = 1.1, // The algorithm is conservative in spending exp, so this tries to get it closer to the actual medium value
					baseExpBudget = playerCount * targetExpLevel * fudgeFactor,
					encounterTemplate = getEncounterTemplate(),
					multiplier = miscLib.getMultiplier(playerCount, encounterTemplate.total),
					availableExp = baseExpBudget / multiplier,
					monster,
					monsterGroups = [],
					currentGroup, targetExp;

				while ( encounterTemplate.groups[0] ) {
					// Exp should be shared as equally as possible between groups
					targetExp = availableExp / encounterTemplate.groups.length;
					currentGroup = encounterTemplate.groups.shift();

					// We need to find a monster who, in the correct number, is close to the target exp
					targetExp /= currentGroup;

					monster = getBestMonster(targetExp, filters);

					monsterGroups.push({
						monster: monster,
						qty: currentGroup,
					});

					// Finally, subtract the actual exp value
					availableExp -= currentGroup * monster.cr.exp;
				}

				return monsterGroups;
			},
			getShuffledMonsterList: function (crString) {
				var list = monsters.byCr[crString].slice(0);

				return shuffle(list);
			},
		};

		return randomEncounter;

		function getEncounterTemplate() {
			var templates = [
					[ 1 ],
					[ 1, 2 ],
					[ 1, 5 ],
					[ 1, 1, 1 ],
					[ 1, 1, 2 ],
					[ 1, 2, 3 ],
					[ 2, 2 ],
					[ 2, 4 ],
					[ 8 ],
				],
				groups = JSON.parse(JSON.stringify(templates[Math.floor(Math.random() * templates.length)])),
				total = groups.reduce(function (a, b) { return a+b; });

			// Silly hack to clone object
			return {
				total: total,
				groups: groups,
			};
		}

		function getBestMonster(targetExp, filters) {
			var bestBelow = 0,
				bestAbove,
				crIndex,
				currentIndex,
				step = -1,
				monsterList,
				i;

			for ( i = 1; i < metaInfo.crList.length; i++ ) {
				if ( metaInfo.crList[i].exp < targetExp ) {
					bestBelow = i;
				} else {
					bestAbove = i;
					break;
				}
			}

			if ( (targetExp - metaInfo.crList[bestBelow].exp) < (metaInfo.crList[bestAbove].exp - targetExp) ) {
				crIndex = bestBelow;
			} else {
				crIndex = bestAbove;
			}

			currentIndex = crIndex;

			monsterList = randomEncounter.getShuffledMonsterList(metaInfo.crList[crIndex].string);

			while ( true ) {
				if ( monsterLib.checkMonster(monsterList[0], filters, { skipCrCheck: true, nonUnique: true }) ) {
					return monsterList[0];
				} else {
					monsterList.shift();
				}

				// If we run through all the monsters from this level, check a different level
				if ( monsterList.length === 0 ) {
					// there were no monsters found lower than target exp, so we have to start checking higher
					if ( currentIndex === 0 ) {
						// Reset currentIndex
						currentIndex = crIndex;
						// Start looking up instead of down
						step = 1;
					}

					currentIndex += step;
					monsterList = randomEncounter.getShuffledMonsterList(metaInfo.crList[currentIndex].string);
				}
			}
		}
	}
})();
(function() {
	"use strict";

	angular.module("app")
		.factory('sources', SourcesService);

	SourcesService.$inject = ['misc'];

	function SourcesService(miscLib){
		return {
			all: miscLib.sources,
			filters: miscLib.sourceFilters,
			shortNames: miscLib.shortNames
		};
	}
})();

(function() {
	"use strict";

	angular.module("app")
		.factory("store", StoreService);

	StoreService.$inject = ['$q', '$log', 'localStorageService'];

	function StoreService($q, $log, localStorageService) {
		var store = {
			get: function (key) {
				return $q(function(resolve, reject) {
					var data;

					try {
						data = localStorageService.get(key);
						resolve(data);
					} catch (ex) {
						$log.warn("Unable to parse stored value for " + key);
						data = undefined;
						reject("Unable to parse stored value for " + key);
					}
				});
			},
			set: function (key, data) {
				localStorageService.set(key, data);
			},
		};

		return store;
	};
})();

(function() {
	'use strict';

	angular.module("app")
		.controller('TestController', TestController);

	TestController.$inject = ['misc', 'AppVersion', 'combatConstants',
		'sources',
		'store',
		'shuffle',
		'players',
		'library',
		'actionQueue',
		'crInfo',
		'alignments',
		'monsterFactory',
		'metaInfo',
		'monsterData',
		'randomEncounter',
		'encounter',
		'filters'
	];

	function TestController(miscLib, appVersion) {
		var vm = this;
		vm.appVersion = appVersion;
	}
})();
(function() {
  'use strict';

  angular
    .module('app')
    .factory('logger', logger);

  logger.$inject = ['$log'];

  /* @ngInject */
  function logger($log) {
    var service = {
      error: error,
      info: info,
      success: success,
      warning: warning,

      // straight to console; bypass toastr
      log: $log.log
    };

    return service;
    /////////////////////

    function error(message, data, title) {
      $log.error('Error: ' + message, data);
    }

    function info(message, data, title) {
      $log.info('Info: ' + message, data);
    }

    function success(message, data, title) {
      $log.info('Success: ' + message, data);
    }

    function warning(message, data, title) {
      $log.warn('Warning: ' + message, data);
    }
  }
} ());

/* Help configure the state-base ui.router */
(function() {
  'use strict';

  angular
    .module('app')
    .provider('routerHelper', routerHelperProvider);

  routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
  /* @ngInject */
  function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
      /* jshint validthis:true */
      this.$get = RouterHelper;

      //$locationProvider.html5Mode(true);

      RouterHelper.$inject = ['$state'];

      /* @ngInject */
      function RouterHelper($state) {
          var hasOtherwise = false;

          var service = {
              configureStates: configureStates,
              getStates: getStates
          };

          return service;

          ///////////////

          function configureStates(states, otherwisePath) {
              states.forEach(function(state) {
                  $stateProvider.state(state.state, state.config);
              });
              if (otherwisePath && !hasOtherwise) {
                  hasOtherwise = true;
                  $urlRouterProvider.otherwise(otherwisePath);
              }
          }

          function getStates() { return $state.get(); }
      }
  }
})();

(function () {
	"use strict";

	angular.module("app")
		.factory('shuffle', Shuffle);

	// via http://bost.ocks.org/mike/shuffle/

	function Shuffle() {
		return function (array) {
			var m = array.length, t, i;

			while (m) {
				i = Math.floor(Math.random() * m--);

				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}

			return array;
		};
	}
})();

angular.module('app').run(['$templateCache', function($templateCache) {$templateCache.put('app/test.html','<div class=container-fluid role=main>This is version {{vm.appVersion}}</div>');
$templateCache.put('app/about/about.html','<div class=container><div class="about--logo pull-right"><img src=images/logo.png class=img-responsive alt=Logo></div><h2>Contact us if you have questions or issues</h2><h3>Register Bugs, Issues, and Feature Reqeusts on our Idea Informer</h3><a href="http://kobold.idea.informer.com/" target=_blank>Kobold Fight Club Feedback</a><h3>Via Reddit</h3><a href=http://www.reddit.com/r/asmor target=_blank>Asmor\'s Official Subreddit</a><h3>Contact the Owners Directly</h3><dl class=dl-horizontal><dt>Site Owner:</dt><dd>Ian Toltz</dd><dd><a href=mailto:itoltz@gmail.com>itoltz@gmail.com</a><dd><a href=http://reddit.com/u/Asmor target=_blank>/u/Asmor</a></dd></dd></dl><dl class=dl-horizontal><dt>Site Contributor:</dt><dd>Joe Barzilai</dd><dd><a href=mailto:jabber3+kobold@gmail.com>jabber3@gmail.com</a><dd><a href=http://reddit.com/u/jabber3 target=_blank>/u/jabber3</a></dd></dd></dl><h3>Want to Contribute?</h3><p>Join us on the <a href=https://github.com/Asmor/5e-monsters>Kobold Github</a></p><p class="about--disclaimer lead">Kobold Fight Club is not associated with Wizards of the Coast.</p></div>');
$templateCache.put('app/battle-setup/battle-setup.html','<div class=combat-setup-controls><button class="btn btn-danger btn-lg" ui-sref=battle-tracker>Fight!</button> <button class="btn btn-lg combat-setup-controls--imp-init-button" ng-click=vm.launchImpInit()>Run in Improved Initiative</button></div><combatant-setup ng-repeat="combatant in vm.combat.combatants" combatant=combatant></combatant-setup>');
$templateCache.put('app/battle-setup/combatant-setup.html','<div class=combatant-setup ng-class="\'combatant-setup__\' + vm.combatant.type"><span class=combatant-setup--name><input class="combatant-setup--input combatant-setup--input__name" ng-model=vm.combatant.name></span> <span class=combatant-setup--initative-mod><span ng-if=!vm.combatant.fixedInitiative>Initiative Mod: <span ng-if="vm.combatant.initiativeMod >= 0">+</span>{{ vm.combatant.initiativeMod }}</span></span> <span class=combatant-setup--initative>Initiative: <span ng-if=!vm.combatant.fixedInitiative><number-input model=vm.combatant.initiative buttons="[-1, 1]"></number-input><button class="combatant-setup--button combatant-setup--button__roll" ng-click=vm.combat.rollInitiative(vm.combatant) ng-if=!vm.combatant.initiativeRolled>Roll</button></span> <span ng-if=vm.combatant.fixedInitiative>{{ vm.combatant.initiative }}</span></span> <span class=combatant-setup--hp><span ng-if=!vm.combatant.noHp>HP:<number-input model=vm.combatant.hp buttons="[-5, -1, 1, +5]" ng-if="vm.combatant.type != \'player\'"></number-input><span ng-if="vm.combatant.type == \'player\'">{{ vm.combatant.hp - vm.combatant.damage }} / {{ vm.combatant.hp }}</span></span></span></div>');
$templateCache.put('app/battle-tracker/battle-tracker.html','<div class=combat-controls><number-input model=vm.combat.delta buttons="[-10, -5, -1, 1, 5, 10]" non-negative=true></number-input><button class=combat-controls--next-turn ng-click=vm.combat.nextTurn()>Next turn</button></div><combatant ng-repeat="combatant in vm.combat.combatants" combatant=combatant></combatant>');
$templateCache.put('app/battle-tracker/combatant.html','<div class="combatant combatant__{{ vm.combatant.type }}" ng-class="{ \'combatant__active\': vm.combatant.active }"><span class=combatant--name>{{ vm.combatant.name }}</span> <span class=combatant--initiative-label>Initiative:</span> <span class=combatant--initiative>{{ vm.combatant.initiative }}</span> <span class=combatant--hp-label><span ng-if=!vm.combatant.noHp>HP:</span></span> <span class=combatant--hp><span ng-if=!vm.combatant.noHp>{{ vm.combatant.hp - vm.combatant.damage }} / {{ vm.combatant.hp }}</span></span> <span class=combatant--apply><span ng-show="vm.combat.delta && !vm.combatant.noHp"><button class=combatant--apply-button ng-click=vm.combat.applyDelta(vm.combatant)>Damage {{ vm.combat.delta }}</button> <button class=combatant--apply-button ng-click="vm.combat.applyDelta(vm.combatant, -1)">Heal {{ vm.combat.delta }}</button></span></span></div>');
$templateCache.put('app/common/difficulty-legend.html','<h3 ng-if=vm.showHeader>Legend</h3><ul><li class=difficulty-legend__deadly>Deadly: One of these is a deadly challenge</li><li class=difficulty-legend__hard>Hard: One of these is a hard challenge</li><li class=difficulty-legend__medium>Medium: One of these is a medium challenge</li><li class=difficulty-legend__easy>Easy: One of these is an easy challenge</li><li class=difficulty-legend__pair>Pair: Two of these is a medium challenge</li><li class=difficulty-legend__group>Group: Four of these is a medium challenge</li><li class=difficulty-legend__trivial>Trivial: Eight or more of these is a medium challenge</li></ul>');
$templateCache.put('app/common/number-input.html','<span class=number-input><button class="number-input--button number-input--button__negative" ng-class="{\'number-input--button__hidden\' : vm.hideNegative()}" ng-repeat="mod in vm.mods | negative" ng-click=vm.modify(mod)>{{ mod }}</button> <span class=number-input--value>{{ vm.value }}</span> <button class="number-input--button number-input--button__positive" ng-repeat="mod in vm.mods | positive" ng-click=vm.modify(mod)>+{{ mod }}</button></span>');
$templateCache.put('app/encounter-builder/current-encounter.html','<h2>Encounter Info<div class="btn-group pull-right"><button class="btn btn-info" ng-click=vm.generateRandom()>{{vm.randomButtonText()}}</button> <button type=button class="btn btn-info dropdown-toggle" data-toggle=dropdown aria-haspopup=true aria-expanded=false><span class=caret></span> <span class=sr-only>Toggle Dropdown</span></button><ul class=dropdown-menu><li><a href=# ng-click="vm.generateRandom(\'easy\')">Random Easy</a></li><li><a href=# ng-click="vm.generateRandom(\'medium\')">Random Medium</a></li><li><a href=# ng-click="vm.generateRandom(\'hard\')">Random Hard</a></li><li><a href=# ng-click="vm.generateRandom(\'deadly\')">Random Deadly</a></li></ul></div></h2><p class="current-encounter--empty bg-info text-muted" ng-if="vm.encounter.qty == 0">Create an encounter by clicking the Random encounter button or by adding monsters from the monsters table.</p><div class=current-encounter ng-class="{ \'current-encounter__shown\': vm.encounter.qty }"><div class=current-encounter--body><div class=current-encounter--table><div class=current-encounter--row ng-repeat="group in vm.encounter.groups | sortEncounter"><div class=current-encounter--monster-info><span class="current-encounter--monster-name text-capitalized">{{ group.monster.name }}</span><div><span class=current-encounter--monster-cr>CR: {{ group.monster.cr.string }}</span> <span class=current-encounter--monster-xp>XP: {{ group.monster.cr.exp | number}}</span><div class=current-encounter--monster-source ng-repeat="source in group.monster.sources" ng-show=vm.filters.source[source.name] title="{{source.name}} p.{{source.page}}">{{ source.name }} <span ng-if=source.page>p.{{ source.page }}</span> <span ng-if=source.url><a target=_blank href="{{ source.url }}">[Link]</a></span></div></div></div><div class=current-encounter--monster-qty-col><button ng-click="vm.encounter.randomize(group.monster, vm.filters)" class="btn btn-default" title="Randomize Monster"><i class="fa fa-random"></i></button> <input class="current-encounter--monster-qty form-control input-lg" type=number ng-model=group.qty><div class=current-encounter--monster-qty-btns><button ng-click=vm.encounter.add(group.monster) class="btn btn-xs btn-success"><i class="fa fa-plus"></i></button> <button ng-click=vm.encounter.remove(group.monster) class="btn btn-xs btn-danger"><i class="fa fa-minus"></i></button></div></div></div></div><div class=current-encounter--totals><div class=current-encounter--totals-difficulty>Difficulty: {{ vm.encounter.difficulty }}</div><div class=current-encounter--totals-xp><span>Total XP: {{ vm.encounter.exp | number }}</span> <span>Adjusted XP: {{ vm.encounter.adjustedExp | number }}</span></div></div><div class=current-encounter--btns><button class="btn btn-danger btn-new" ng-click=vm.encounter.reset()>New</button> <button class="btn btn-primary" ui-sref=encounter-manager ng-if=!vm.encounter.reference>Save</button></div></div></div>');
$templateCache.put('app/encounter-builder/encounter-builder.html','<div class="encounter-builder container-fluid" role=main><div class=row><div class=col-md-4><group-info></group-info><div class=encounter-builder--current-encounter-container><div class=encounter-builder--current-encounter-slider ng-class="{\'encounter-builder--current-encounter-slider__shown\': encounterShown }"><div class=encounter-builder--encounter-info-bar ng-click="encounterShown = !encounterShown"><i class="fa encounter-builder--toggle-arrow" ng-class="{ \'fa-toggle-up\': !encounterShown, \'fa-toggle-down\': encounterShown }" aria-hidden=true></i><div class=encounter-builder--encounter-info-text><span ng-if=vm.encounter.exp>{{ vm.getMonsterQtyString() }}, {{ vm.encounter.exp }} exp ({{ vm.encounter.difficulty }})</span> <span ng-if=!vm.encounter.exp><span ng-if=encounterShown>Browse monsters</span> <span ng-if=!encounterShown>Manage encounter</span></span></div></div><div class=encounter-builder--current-encounter><current-encounter filters=vm.filters></current-encounter></div></div></div><div class="difficulty-legend hidden-xs hidden-sm"><button class="btn btn-warning difficulty-legend-button" type=button data-toggle=collapse data-target=#legend-collapse>Legend <i class="fa fa-angle-double-up" aria-hidden=true></i></button><div id=legend-collapse class="difficulty-legend-popout collapse" aria-expanded=false aria-controls=legend-collapse><difficulty-legend></difficulty-legend></div></div></div><div class=col-md-8><search-controls filters=vm.filters></search-controls><monster-table filters=vm.filters></monster-table><div class="difficulty-legend-sm visible-xs visible-sm"><difficulty-legend show-header=true></difficulty-legend></div></div></div></div>');
$templateCache.put('app/encounter-builder/group-info.html','<div class=group-info><div class=group-info--input><h2 class=group-info--header>Group Info</h2><div><div class=group-info--input-section><label>Players:</label><select ng-model=vm.encounter.playerCount ng-options="count for count in [1,2,3,4,5,6,7,8,9,10,11,12]" ng-change=vm.updateAndSave()></select></div><div class=group-info--input-section><label>Level:</label><select ng-model=vm.encounter.partyLevel ng-options="level as level.level for level in vm.levels" ng-change=vm.updateAndSave()></select></div></div></div><ul class="group-info--guidelines list-unstyled"><li ng-class="{\'group-info--guidelines-active\': vm.encounter.difficulty === \'Easy\'}"><span>Easy:</span> <span class=group-info--guidelines-values>{{ vm.encounter.partyLevel.easy * vm.encounter.playerCount | number }} exp</span></li><li ng-class="{\'group-info--guidelines-active\': vm.encounter.difficulty === \'Medium\'}"><span>Medium:</span> <span class=group-info--guidelines-values>{{ vm.encounter.partyLevel.medium * vm.encounter.playerCount | number }} exp</span></li><li ng-class="{\'group-info--guidelines-active\': vm.encounter.difficulty === \'Hard\'}"><span>Hard:</span> <span class=group-info--guidelines-values>{{ vm.encounter.partyLevel.hard * vm.encounter.playerCount | number }} exp</span></li><li ng-class="{\'group-info--guidelines-active\': vm.encounter.difficulty === \'Deadly\'}"><span>Deadly:</span> <span class=group-info--guidelines-values>{{ vm.encounter.partyLevel.deadly * vm.encounter.playerCount | number }} exp</span></li></ul></div>');
$templateCache.put('app/encounter-builder/monster-table.html','<div class="monster-table table-responsive"><table class="monster-table--table table table-bordered table-striped"><thead><tr><th class="monster-table--column monster-table--column__button"></th><th class="monster-table--column monster-table--column__sortable monster-table--column__name" ng-click="vm.filters.sort = \'name\'">Name</th><th class="monster-table--column monster-table--column__sortable monster-table--column__cr" ng-click="vm.filters.sort = \'cr\'">CR</th><th class="monster-table--column monster-table--column__sortable monster-table--column__size" ng-click="vm.filters.sort = \'size\'">Size</th><th class="monster-table--column monster-table--column__sortable monster-table--column__type" ng-click="vm.filters.sort = \'type\'">Type</th><th class="monster-table--column monster-table--column__sortable monster-table--column__alignment" ng-click="vm.filters.sort = \'alignment\'">Alignment</th><th class="monster-table--column monster-table--column__source">Source</th></tr></thead><tbody><tr dir-paginate="monster in vm.monsters | monstersFilter:vm.filters | itemsPerPage: vm.filters.pageSize" class=monster-table--row><td class=monster-table--button-cell><button ng-click=vm.encounter.add(monster) class="btn btn-sm btn-success"><i class="fa fa-plus"></i></button></td><td class=monster-table--name-cell><div class=monster-table--name>{{ monster.name }}</div><div ng-if=monster.section class=monster-table--section><span class=monster-table--label>Section:</span> {{ monster.section }}</div></td><td class=monster-table--cr-cell ng-class="\'monster-table--cr-cell__\' + vm.dangerZone(monster)"><span class=monster-table--cr-label>CR</span> {{ monster.cr.string }}</td><td class=monster-table--size-cell><span class=monster-table--label>Size:</span> {{ monster.size }}</td><td class=monster-table--type-cell><span class=monster-table--label>Type:</span> {{ monster.type }} <span ng-if=monster.tags class=monster-table--tags>({{ monster.tags.join(", ") }})</span></td><td class=monster-table--alignment-cell><span ng-if=monster.alignment><span class=monster-table--label>Alignment:</span> {{ monster.alignment.text }}</span></td><td class=monster-table--source-cell><span class=monster-table--label>Source(s):</span><div class=monster-table--sources ng-repeat="source in monster.sources" ng-show=vm.filters.source[source.name]><span class="monster-table--source-name monster-table--source-name__short" title="{{ source.name }}">{{ vm.sources.shortNames[source.name] }}</span> <span class="monster-table--source-name monster-table--source-name__long">{{ source.name }}</span> <span ng-if=source.page>p.{{ source.page }}</span> <span ng-if=source.url><a target=_blank href="{{ source.url }}">[Link]</a></span></div></td></tr></tbody></table></div><div class=pagination-container><dir-pagination-controls></dir-pagination-controls></div>');
$templateCache.put('app/encounter-builder/search.html','<div class=search><div class="search--search-form form-inline"><label class=sr-only>Search</label> <input class="form-control search-input" type=text ng-model=vm.filters.search placeholder=Search...><select class=form-control ng-model=vm.filters.size ng-options="size for size in vm.sizes"><option value>Any Size</option></select><select class=form-control ng-model=vm.filters.type ng-options="type for type in vm.types"><option value>Any Type</option></select><select class=form-control ng-model=vm.filters.minCr ng-options="cr.numeric as cr.string for cr in vm.crList"><option value>Min CR</option></select><select class=form-control ng-model=vm.filters.maxCr ng-options="cr.numeric as cr.string for cr in vm.crList"><option value>Max CR</option></select><select class=form-control ng-model=vm.filters.alignment ng-options="alignment as alignment.text for (key, alignment) in vm.alignments"><option value>Any Alignment</option></select><select class=form-control ng-model=vm.filters.environment ng-options="environment as environment for environment in vm.environments"><option value>Any Environment</option></select><button type=button class="btn btn-default" data-toggle=modal data-target=#sourcesModal>Set Sources</button></div><div class=search--reset><button class="btn btn-danger" ng-click=vm.resetFilters()>Reset Filters</button><div class=search--size-controls><label>Page size:</label><select class="form-control search--page-size" ng-model=vm.filters.pageSize ng-options="page for page in [10, 25, 50, 100, 250, 500, 1000]"></select></div></div><div class=modal id=sourcesModal tabindex=-1 role=dialog aria-labelledby=myModalLabel><div class=modal-dialog role=document><div class=modal-content><div class=modal-header><button type=button class=close data-dismiss=modal aria-label=Close><span aria-hidden=true>&times;</span></button><h4 class=modal-title id=myModalLabel>Set Source Material</h4></div><div class=modal-body><div class=sources-modal--buttons><button class="btn btn-primary" ng-click="vm.updateSourceFilters(\'all\')">Everything</button> <button class="btn btn-primary" ng-click="vm.updateSourceFilters(\'core\')">Core Books</button> <button class="btn btn-primary" ng-click="vm.updateSourceFilters(\'books\')">All Books</button> <button class="btn btn-primary" ng-click="vm.updateSourceFilters(\'basic\')">Basic</button> <button class="btn btn-primary" ng-click="vm.updateSourceFilters(\'thirdparty\')">Third Party</button></div><ul><li class=search--source ng-repeat="source in vm.sourceNames" ng-class="{ \'search--source__off\': !vm.filters.source[source] }"><label><input type=checkbox ng-model=vm.filters.source[source]> {{ source }}</label></li></ul></div><div class=modal-footer><button type=button class="btn btn-default" data-dismiss=modal>Close</button></div></div></div></div></div>');
$templateCache.put('app/encounter-manager/encounter-manager.html','<div class=encounter-manager><div class=encounter-manager--no-encounters ng-if="!vm.encounter.qty && !vm.library.encounters.length">You don\'t have any encounters saved. <button ui-sref=encounter-builder>Return to encounter builder</button></div><div class="encounter-manager-encounter encounter-manager-encounter__unsaved" ng-if="vm.encounter.qty && !vm.encounter.reference"><div class=encounter-manager-encounter--controls><input class=encounter-manager-encounter--name-input placeholder="{{ vm.newEncounter.placeholder }}" ng-model=vm.newEncounter.name> <button class=encounter-manager-encounter--save-button ng-click=vm.save()>Save current encounter</button></div><div class=encounter-manager-monster ng-repeat="(id, group) in vm.encounter.groups"><span ng-if="group.qty > 1">{{ group.qty }}x</span> {{ group.monster.name }}</div></div><div ng-repeat="storedEncounter in vm.library.encounters track by $index"><manager-row stored-encounter=storedEncounter></manager-row></div></div>');
$templateCache.put('app/encounter-manager/manager-row.html','<div class=encounter-manager-row><div class=encounter-manager-row--controls><div class=encounter-manager-row--name>{{ vm.storedEncounter.name }}</div><div class=encounter-manager-row--exp>Exp: {{ vm.calculateExp(vm.storedEncounter) }}</div><button class=encounter-manager-row--load-button ng-click=vm.load(vm.storedEncounter) ng-if="vm.encounter.reference != vm.storedEncounter">Choose</button> <button class=encounter-manager-row--remove-button ng-click=vm.remove(vm.storedEncounter)>Remove</button> <span class=encounter-manager-row--active ng-if="vm.encounter.reference == vm.storedEncounter">Active</span></div><div class=encounter-manager-monster ng-repeat="(id, qty) in vm.storedEncounter.groups"><span ng-if="qty > 1">{{ qty }}x</span> {{ vm.monsters.byId[id].name }}</div></div>');
$templateCache.put('app/navbar/navbar.html','<nav class="navbar navbar-inverse navbar-fixed-top"><div class=container-fluid><div class=navbar-header><button type=button class="navbar-toggle collapsed" data-toggle=collapse data-target=.navbar-collapse aria-expanded=false aria-controls=navbar><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navbar-brand href=#>Kobold Fight Club</a></div><div id=navbar class="collapse navbar-collapse"><ul class="nav navbar-nav navbar-right"><li ui-sref-active=active data-toggle=collapse data-target=.navbar-collapse.in><a ui-sref=encounter-builder>Home</a></li><li ui-sref-active=active data-toggle=collapse data-target=.navbar-collapse.in><a ui-sref=encounter-manager>Manage Encounters</a></li><li ui-sref-active=active data-toggle=collapse data-target=.navbar-collapse.in><a ui-sref=players.manage>Manage Players</a></li><li ui-sref-active=active data-toggle=collapse data-target=.navbar-collapse.in><a ui-sref=battle-setup>Run Encounters</a></li><li ui-sref-active=active data-toggle=collapse data-target=.navbar-collapse.in><a ui-sref=about>About</a></li></ul></div></div></nav>');
$templateCache.put('app/players/edit.html','<div class=edit-players><p>One character per line. Blank line to separate different parties. Format: name initiative hp</p><textarea class="edit-players--text-input form-control" ng-model=vm.players.raw rows=10></textarea></div>');
$templateCache.put('app/players/manage.html','<div class=manage-players><div class=manage-players--party ng-repeat="party in vm.players.parties"><button class=manage-players--party-select-button ng-if="vm.players.selectedParty != party" ng-click=vm.select(party)>Select this party</button> <span class=manage-players--selected-party ng-if="vm.players.selectedParty == party">Selected</span><div class=manage-players--player ng-repeat="player in party"><span class=manage-players--player--name>{{ player.name }}</span> <span class=manage-players--player--init>Initiative: <span ng-if="player.initiativeMod >= 0">+</span>{{ player.initiativeMod }}</span> <span class=manage-players--player--hp>HP: {{ player.hp - player.damage }} / {{ player.hp }}</span></div></div></div>');
$templateCache.put('app/players/players.html','<div class=players-controls><button class="btn btn-primary" ui-sref=players.manage>Manage</button> <button class="btn btn-primary" ui-sref=players.edit>Edit</button></div><div ui-view></div>');}]);