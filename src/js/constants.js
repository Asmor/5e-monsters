const CONST = {

    EXP: {
        1: {  daily: 300,	easy: 25,   medium: 50,   hard: 75,   deadly: 100 },
        2: {  daily: 600,	easy: 50,   medium: 100,  hard: 150,  deadly: 200 },
        3: {  daily: 1200,	easy: 75,   medium: 150,  hard: 225,  deadly: 400 },
        4: {  daily: 1700,	easy: 125,  medium: 250,  hard: 375,  deadly: 500 },
        5: {  daily: 3500,	easy: 250,  medium: 500,  hard: 750,  deadly: 1100 },
        6: {  daily: 4000,	easy: 300,  medium: 600,  hard: 900,  deadly: 1400 },
        7: {  daily: 5000,	easy: 350,  medium: 750,  hard: 1100, deadly: 1700 },
        8: {  daily: 6000,	easy: 450,  medium: 900,  hard: 1400, deadly: 2100 },
        9: {  daily: 7500,	easy: 550,  medium: 1100, hard: 1600, deadly: 2400 },
        10: { daily: 9000,	easy: 600,  medium: 1200, hard: 1900, deadly: 2800 },
        11: { daily: 10500, easy: 800,  medium: 1600, hard: 2400, deadly: 3600 },
        12: { daily: 11500, easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
        13: { daily: 13500, easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
        14: { daily: 15000, easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
        15: { daily: 18000, easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
        16: { daily: 20000, easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
        17: { daily: 25000, easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
        18: { daily: 27000, easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
        19: { daily: 30000, easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
        20: { daily: 40000, easy: 2800, medium: 5700, hard: 8500, deadly: 12700 }
    },

    CR: {
        LIST: ["0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
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
    },

    ALIGNMENTS: {
        ANY: { string: "any" },
        ANY_LAWFUL: { string: "any lawful" },
        ANY_CHAOTIC: { string: "any chaotic" },
        ANY_EVIL: { string: "any evil" },
        ANY_GOOD: { string: "any good" },
        ANY_NEUTRAL: { string: "any neutral" },
        NON_LAWFUL: { string: "non lawful" },
        NON_CHAOTIC: { string: "non chaotic" },
        NON_GOOD: { string: "non good" },
        NON_EVIL: { string: "non evil" },
        NON_NEUTRAL: { string: "non neutral" },

        LAWFUL_GOOD: { string: "lawful good" },
        NEUTRAL_GOOD: { string: "neutral good" },
        CHAOTIC_GOOD: { string: "chaotic good" },
        LAWFUL_NEUTRAL: { string: "lawful neutral" },
        NEUTRAL: { string: "neutral" },
        CHAOTIC_NEUTRAL: { string: "chaotic neutral" },
        LAWFUL_EVIL: { string: "lawful evil" },
        NEUTRAL_EVIL: { string: "neutral evil" },
        CHAOTIC_EVIL: { string: "chaotic evil" },
        UNALIGNED: { string: "unaligned" },
    }
}

let i = 0
CONST.ALIGNMENTS.LAWFUL_GOOD.bitwise = Math.pow(2, i++);
CONST.ALIGNMENTS.NEUTRAL_GOOD.bitwise = Math.pow(2, i++);
CONST.ALIGNMENTS.CHAOTIC_GOOD.bitwise = Math.pow(2, i++);
CONST.ALIGNMENTS.LAWFUL_NEUTRAL.bitwise = Math.pow(2, i++);
CONST.ALIGNMENTS.NEUTRAL.bitwise = Math.pow(2, i++);
CONST.ALIGNMENTS.CHAOTIC_NEUTRAL.bitwise = Math.pow(2, i++);
CONST.ALIGNMENTS.LAWFUL_EVIL.bitwise = Math.pow(2, i++);
CONST.ALIGNMENTS.NEUTRAL_EVIL.bitwise = Math.pow(2, i++);
CONST.ALIGNMENTS.CHAOTIC_EVIL.bitwise = Math.pow(2, i++);
CONST.ALIGNMENTS.UNALIGNED.bitwise = Math.pow(2, i++);

CONST.ALIGNMENTS.ANY.bitwise =
      CONST.ALIGNMENTS.LAWFUL_GOOD.bitwise
    | CONST.ALIGNMENTS.NEUTRAL_GOOD.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_GOOD.bitwise
    | CONST.ALIGNMENTS.LAWFUL_NEUTRAL.bitwise
    | CONST.ALIGNMENTS.NEUTRAL.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_NEUTRAL.bitwise
    | CONST.ALIGNMENTS.LAWFUL_EVIL.bitwise
    | CONST.ALIGNMENTS.NEUTRAL_EVIL.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_EVIL.bitwise;

CONST.ALIGNMENTS.ANY_LAWFUL.bitwise =
      CONST.ALIGNMENTS.LAWFUL_GOOD.bitwise
    | CONST.ALIGNMENTS.LAWFUL_NEUTRAL.bitwise
    | CONST.ALIGNMENTS.LAWFUL_EVIL.bitwise

CONST.ALIGNMENTS.ANY_CHAOTIC.bitwise =
      CONST.ALIGNMENTS.CHAOTIC_GOOD.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_NEUTRAL.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_EVIL.bitwise;

CONST.ALIGNMENTS.ANY_EVIL.bitwise =
      CONST.ALIGNMENTS.LAWFUL_EVIL.bitwise
    | CONST.ALIGNMENTS.NEUTRAL_EVIL.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_EVIL.bitwise;

CONST.ALIGNMENTS.ANY_GOOD.bitwise =
      CONST.ALIGNMENTS.LAWFUL_GOOD.bitwise
    | CONST.ALIGNMENTS.NEUTRAL_GOOD.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_GOOD.bitwise;

CONST.ALIGNMENTS.ANY_NEUTRAL.bitwise =
      CONST.ALIGNMENTS.NEUTRAL_GOOD.bitwise
    | CONST.ALIGNMENTS.LAWFUL_NEUTRAL.bitwise
    | CONST.ALIGNMENTS.NEUTRAL.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_NEUTRAL.bitwise
    | CONST.ALIGNMENTS.NEUTRAL_EVIL.bitwise;

CONST.ALIGNMENTS.NON_LAWFUL.bitwise =
      CONST.ALIGNMENTS.NEUTRAL_GOOD.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_GOOD.bitwise
    | CONST.ALIGNMENTS.NEUTRAL.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_NEUTRAL.bitwise
    | CONST.ALIGNMENTS.NEUTRAL_EVIL.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_EVIL.bitwise;

CONST.ALIGNMENTS.NON_CHAOTIC.bitwise =
      CONST.ALIGNMENTS.LAWFUL_GOOD.bitwise
    | CONST.ALIGNMENTS.NEUTRAL_GOOD.bitwise
    | CONST.ALIGNMENTS.LAWFUL_NEUTRAL.bitwise
    | CONST.ALIGNMENTS.NEUTRAL.bitwise
    | CONST.ALIGNMENTS.LAWFUL_EVIL.bitwise
    | CONST.ALIGNMENTS.NEUTRAL_EVIL.bitwise

CONST.ALIGNMENTS.NON_GOOD.bitwise =
      CONST.ALIGNMENTS.LAWFUL_NEUTRAL.bitwise
    | CONST.ALIGNMENTS.NEUTRAL.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_NEUTRAL.bitwise
    | CONST.ALIGNMENTS.LAWFUL_EVIL.bitwise
    | CONST.ALIGNMENTS.NEUTRAL_EVIL.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_EVIL.bitwise;

CONST.ALIGNMENTS.NON_EVIL.bitwise =
      CONST.ALIGNMENTS.LAWFUL_GOOD.bitwise
    | CONST.ALIGNMENTS.NEUTRAL_GOOD.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_GOOD.bitwise
    | CONST.ALIGNMENTS.LAWFUL_NEUTRAL.bitwise
    | CONST.ALIGNMENTS.NEUTRAL.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_NEUTRAL.bitwise;

CONST.ALIGNMENTS.NON_NEUTRAL.bitwise =
      CONST.ALIGNMENTS.LAWFUL_GOOD.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_GOOD.bitwise
    | CONST.ALIGNMENTS.LAWFUL_EVIL.bitwise
    | CONST.ALIGNMENTS.CHAOTIC_EVIL.bitwise;

export default CONST;