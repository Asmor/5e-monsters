(function() {
	"use strict";

	angular.module("app")
		.factory("integration", ExportService);


	// var payload = [{ "Name": "Nemo", "HP": { "Value": 10 } }, { "Name": "Fat Goblin", "HP": { "Value": 20 }, "Id": "mm.goblin"}, { "Id": "mm.goblin"}];
	var target = "https://www.improved-initiative.com/launchencounter/";
	ExportService.$inject = ["$document", "encounter", "players"];
	function ExportService($document, encounter, players) {
		function launchImpInit() {
			var payload = generatePayload({
				monsters: encounter.groups || [],
				players: players.selectedParty || [],
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

	function generatePayload(args) {
		var combatants = [];

		Object.keys(args.monsters).forEach(function (guid) {
			var monsterGroup = args.monsters[guid];
			var monster = monsterGroup.monster;
			var qty = monsterGroup.qty;

			var i;
			for ( i = 1; i <= qty; i++ ) {

				combatants.push({
					Name: monster.name,
					HP: { Value: monster.hp },
					TotalInitiativeModifier: monster.init,
					AC: { Value: monster.ac },
					Player: "npc",
					Id: monster.fid,
				});
			}
		});

		args.players.forEach(function (player) {
			combatants.push({
				Name: player.name,
				TotalInitiativeModifier: player.initiativeMod,
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
