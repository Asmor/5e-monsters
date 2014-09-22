/* exported Controllers */
/* exported alignments */
/* exported crInfo */
/* exported levels */
/* exported monsters */
/* exported monstersByName */
/* exported registerSource */
/* exported sizes */
/* exported sourceFilters */
/* exported sources */
/* exported tags */
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
	crInfo = {
		"0":	{ string: "0",		numeric: 0,		exp: 10 },
		"1/8":	{ string: "1/8",	numeric: 0.125,	exp: 25 },
		"1/4":	{ string: "1/4",	numeric: 0.25,	exp: 50 },
		"1/2":	{ string: "1/2",	numeric: 0.5,	exp: 100 },
		"1":	{ string: "1",		numeric: 1,		exp: 200 },
		"2":	{ string: "2",		numeric: 2,		exp: 450 },
		"3":	{ string: "3",		numeric: 3,		exp: 700 },
		"4":	{ string: "4",		numeric: 4,		exp: 1100 },
		"5":	{ string: "5",		numeric: 5,		exp: 1800 },
		"6":	{ string: "6",		numeric: 6,		exp: 2300 },
		"7":	{ string: "7",		numeric: 7,		exp: 2900 },
		"8":	{ string: "8",		numeric: 8,		exp: 3900 },
		"9":	{ string: "9",		numeric: 9,		exp: 5000 },
		"10":	{ string: "10",		numeric: 10,	exp: 5900 },
		"11":	{ string: "11",		numeric: 11,	exp: 7200 },
		"12":	{ string: "12",		numeric: 12,	exp: 8400 },
		"13":	{ string: "13",		numeric: 13,	exp: 10000 },
		"14":	{ string: "14",		numeric: 14,	exp: 11500 },
		"15":	{ string: "15",		numeric: 15,	exp: 13000 },
		"16":	{ string: "16",		numeric: 16,	exp: 15000 },
		"17":	{ string: "17",		numeric: 17,	exp: 18000 },
		"18":	{ string: "18",		numeric: 18,	exp: 20000 },
		"19":	{ string: "19",		numeric: 19,	exp: 22000 },
		"20":	{ string: "20",		numeric: 20,	exp: 25000 },
		"21":	{ string: "21",		numeric: 21,	exp: 33000 },
		"22":	{ string: "22",		numeric: 22,	exp: 41000 },
		"23":	{ string: "23",		numeric: 23,	exp: 50000 },
		"24":	{ string: "24",		numeric: 24,	exp: 62000 },
		"25":	{ string: "25",		numeric: 25,	exp: 75000 },
		"26":	{ string: "26",		numeric: 26,	exp: 90000 },
		"27":	{ string: "27",		numeric: 27,	exp: 105000 },
		"28":	{ string: "28",		numeric: 28,	exp: 120000 },
		"29":	{ string: "29",		numeric: 29,	exp: 135000 },
		"30":	{ string: "30",		numeric: 30,	exp: 155000 },
	},
	levels = [
		{ level: 1,		easy: 25,	medium: 50,		hard: 75,	deadly: 100 },
		{ level: 2,		easy: 50,	medium: 100,	hard: 150,	deadly: 200 },
		{ level: 3,		easy: 75,	medium: 150,	hard: 225,	deadly: 400 },
		{ level: 4,		easy: 125,	medium: 250,	hard: 375,	deadly: 500 },
		{ level: 5,		easy: 250,	medium: 500,	hard: 750,	deadly: 1100 },
		{ level: 6,		easy: 300,	medium: 600,	hard: 900,	deadly: 1400 },
		{ level: 7,		easy: 350,	medium: 750,	hard: 1100,	deadly: 1700 },
		{ level: 8,		easy: 450,	medium: 900,	hard: 1400,	deadly: 2100 },
		{ level: 9,		easy: 550,	medium: 1100,	hard: 1600,	deadly: 2400 },
		{ level: 10,	easy: 600,	medium: 1200,	hard: 1900,	deadly: 2800 },
		{ level: 11,	easy: 800,	medium: 1600,	hard: 2400,	deadly: 3600 },
		{ level: 12,	easy: 1000,	medium: 2000,	hard: 3000,	deadly: 4500 },
		{ level: 13,	easy: 1100,	medium: 2200,	hard: 3400,	deadly: 5100 },
		{ level: 14,	easy: 1250,	medium: 2500,	hard: 3800,	deadly: 5700 },
		{ level: 15,	easy: 1400,	medium: 2800,	hard: 4300,	deadly: 6400 },
		{ level: 16,	easy: 1600,	medium: 3200,	hard: 4800,	deadly: 7200 },
		{ level: 17,	easy: 2000,	medium: 3900,	hard: 5900,	deadly: 8800 },
		{ level: 18,	easy: 2100,	medium: 4200,	hard: 6300,	deadly: 9500 },
		{ level: 19,	easy: 2400,	medium: 4900,	hard: 7300,	deadly: 10900 },
		{ level: 20,	easy: 2800,	medium: 5700,	hard: 8500,	deadly: 12700 },
	],
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