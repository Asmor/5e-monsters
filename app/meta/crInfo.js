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
