/* exported Controllers */
/* exported alignments */
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