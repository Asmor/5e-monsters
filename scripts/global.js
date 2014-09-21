/* exported Controllers */
/* exported alignments */
/* exported expByCr */
/* exported tags */
/* exported monsters */
/* exported monstersByName */
/* exported registerSource */
/* exported sourceFilters */
/* exported sources */
/* exported sizes */
/* exported types */
"use strict";

var Controllers = {};
var monsters = [],
	monstersByName = {},
	crs = [],
	sizes = [
		"Tiny",
		"Small",
		"Medium",
		"Large",
		"Huge",
		"Gargantuan",
	],
	types = [
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
	sourceFilters = {},
	sources = [],
	tags = {},
	alignments = {
		any: {
			text: "any",
			lg: true,	ng: true,	cg: true,
			ln: true,	n:  true,	cn: true,
			le: true,	ne: true,	ce: true,
		},
		any_chaotic: {
			text: "any chaotic",
			lg: false,	ng: false,	cg: true,
			ln: false,	n:  false,	cn: true,
			le: false,	ne: false,	ce: true,
		},
		any_evil: {
			text: "any evil",
			lg: false,	ng: false,	cg: false,
			ln: false,	n:  false,	cn: false,
			le: true,	ne: true,	ce: true,
		},
		any_good: {
			text: "any good",
			lg: true,	ng: true,	cg: true,
			ln: false,	n:  false,	cn: false,
			le: false,	ne: false,	ce: false,
		},
		any_lawful: {
			text: "any lawful",
			lg: true,	ng: false,	cg: false,
			ln: true,	n:  false,	cn: false,
			le: true,	ne: false,	ce: false,
		},
		any_neutral: {
			text: "any neutral",
			lg: false,	ng: true,	cg: false,
			ln: true,	n:  true,	cn: true,
			le: false,	ne: true,	ce: false,
		},
		non_chaotic: {
			text: "non-chaotic",
			lg: true,	ng: true,	cg: false,
			ln: true,	n:  true,	cn: false,
			le: true,	ne: true,	ce: false,
		},
		non_evil: {
			text: "non-evil",
			lg: true,	ng: true,	cg: true,
			ln: true,	n:  true,	cn: true,
			le: false,	ne: false,	ce: false,
		},
		non_good: {
			text: "non-good",
			lg: false,	ng: false,	cg: false,
			ln: true,	n: true,	cn: true,
			le: true,	ne: true,	ce: true,
		},
		non_lawful: {
			text: "non-lawful",
			lg: false,	ng: true,	cg: true,
			ln: false,	n: true,	cn: true,
			le: false,	ne: true,	ce: true,
		},
		lg: { lg: true, text: "lawful good" },
		ng: { ng: true, text: "neutral good" },
		cg: { cg: true, text: "chaotic good" },
		ln: { ln: true, text: "lawful nuetral" },
		n:  { n:  true, text: "neutral" },
		cn: { cn: true, text: "chaotic nuetral" },
		le: { le: true, text: "lawful evil" },
		ne: { ne: true, text: "neutral evil" },
		ce: { ce: true, text: "chaotic evil" },
	},
	expByCr = {
		"0": 10,
		"1/2": 100,
		"1/4": 50,
		"1/8": 25,
		"1": 200,
		"2": 450,
		"3": 700,
		"4": 1100,
		"5": 1800,
		"6": 2300,
		"7": 2900,
		"8": 3900,
		"9": 5000,
		"10": 5900,
		"11": 7200,
		"12": 8400,
		"13": 10000,
		"14": 11500,
		"15": 13000,
		"16": 15000,
		"17": 18000,
		"18": 20000,
		"19": 22000,
		"20": 25000,
		"21": 33000,
		"22": 41000,
		"23": 50000,
		"24": 62000,
		"25": 75000,
		"26": 90000,
		"27": 105000,
		"28": 120000,
		"29": 135000,
		"30": 155000,
	},
	i;

crs.push({ text: "0", value: 0 });
crs.push({ text: "1/8", value: 0.125 });
crs.push({ text: "1/4", value: 0.25 });
crs.push({ text: "1/2", value: 0.5 });
for ( i = 1; i < 25; i++ ) {
	crs.push({ text: i.toString(), value: i });
}

function registerSource(name, initialState) {
	sources.push(name);
	sourceFilters[name] = initialState;
}