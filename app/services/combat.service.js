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
					advantageOnInitiative: player.advantageOnInitiative,
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
						advantageOnInitiative: player.advantageOnInitiative,
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
				var initRoll = _.random(1, 20);
				if (combatant.advantageOnInitiative) {
					var secondRoll = _.random(1, 20);
					if (secondRoll > initRoll) initRoll = secondRoll;
				}
				combatant.initiative = initRoll + combatant.initiativeMod;
				combatant.initiativeRolled = true;
			},
		};

		combat.init();

		return combat;
	}
})();
