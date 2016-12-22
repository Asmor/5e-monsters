(function() {
	"use strict";

	angular.module("app")
		.factory("integration", ExportService);


	// var payload = [{ "Name": "Nemo", "HP": { "Value": 10 } }, { "Name": "Fat Goblin", "HP": { "Value": 20 }, "Id": "mm.goblin"}, { "Id": "mm.goblin"}];
	var target = "http://localhost/launchencounter/";
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

			var instanceName, i;
			for ( i = 1; i <= qty; i++ ) {
				instanceName = [monster.name];
				if ( qty > 1 ) {
					instanceName.push("#" + i);
				}

				combatants.push({
					Name: instanceName.join(" "),
					HP: { Value: monster.hp },
					InitiativeModifier: monster.init,
					AC: monster.ac,
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
