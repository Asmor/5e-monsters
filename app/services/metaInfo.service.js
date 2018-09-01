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
			legendaryList: [
				"Ordinary",
				"Legendary",
				"Legendary (in lair)"
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
			sortChoices: [
				{ value: 'name', text: 'Name' },
				{ value: 'cr', text: 'CR' },
				{ value: 'size', text: 'Size' },
				{ value: 'type', text: 'Type' },
				{ value: 'alignment', text: 'Alignment' },
			],
		};

		return metaInfo;
	}
})();