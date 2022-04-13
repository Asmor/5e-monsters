/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _encounter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./encounter.js */ "./src/js/encounter.js");
/* harmony import */ var _party_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./party.js */ "./src/js/party.js");


var internationalNumberFormat = new Intl.NumberFormat('en-US');

function app() {
  var cr_list = ["0", "1/8", "1/4", "1/2"];

  for (var i = 1; i <= 30; i++) {
    cr_list.push(i.toString());
  }

  return {
    menu: true,
    isLoading: true,
    loading: false,
    pages: 1,
    page: 1,
    allMonsters: [],
    difficultySelectOpen: false,
    cr_list: cr_list,
    encounter: _encounter_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    party: _party_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    init: function init() {
      var _this = this;

      this.fetch_monsters();
      this.party.groups = localStorage.getItem("party") ? JSON.parse(localStorage.getItem("party")) : [{
        players: 4,
        level: 1
      }];
      this.$watch("party.groups", function () {
        localStorage.setItem("party", JSON.stringify(_this.party.groups));
      });
      this.encounter.app = this;
      this.party.app = this;
    },
    fetch_monsters: function fetch_monsters() {
      var _this2 = this;

      this.isLoading = true;
      fetch("/json/se_monsters.json").then(function (res) {
        return res.json();
      }).then(function (data) {
        _this2.isLoading = false;
        _this2.allMonsters = data;
        _this2.page = 1;
        _this2.pages = Math.floor(_this2.allMonsters.length / 10);
      });
    },

    get monsters() {
      var start = !this.page ? 0 : this.page * 10 + 1;
      var end = (this.page + 1) * 10;
      return this.allMonsters.slice(start, end);
    },

    formatNumber: function formatNumber(num) {
      return internationalNumberFormat.format(num);
    }
  };
}

function multiSelect($el, options) {
  return {
    multiple: true,
    value: ['any'],
    options: options,
    init: function init() {
      var _this3 = this;

      this.$nextTick(function () {
        var choices = new Choices($el, {
          allowHTML: true,
          removeItemButton: true
        });

        var refreshChoices = function refreshChoices() {
          var selection = _this3.multiple ? _this3.value : [_this3.value];
          choices.clearStore();
          choices.setChoices(_this3.options.map(function (_ref) {
            var value = _ref.value,
                label = _ref.label;
            return {
              value: value,
              label: label,
              selected: selection.includes(value)
            };
          }));
        };

        refreshChoices();
        $el.addEventListener('change', function () {
          _this3.value = choices.getValue(true);
        });

        _this3.$watch('value', function () {
          return refreshChoices();
        });

        _this3.$watch('options', function () {
          return refreshChoices();
        });
      });
    }
  };
}

window.app = app;
window.multiSelect = multiSelect;

/***/ }),

/***/ "./src/js/constants.js":
/*!*****************************!*\
  !*** ./src/js/constants.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var CONST = {
  EXP: {
    1: {
      daily: 300,
      easy: 25,
      medium: 50,
      hard: 75,
      deadly: 100
    },
    2: {
      daily: 600,
      easy: 50,
      medium: 100,
      hard: 150,
      deadly: 200
    },
    3: {
      daily: 1200,
      easy: 75,
      medium: 150,
      hard: 225,
      deadly: 400
    },
    4: {
      daily: 1700,
      easy: 125,
      medium: 250,
      hard: 375,
      deadly: 500
    },
    5: {
      daily: 3500,
      easy: 250,
      medium: 500,
      hard: 750,
      deadly: 1100
    },
    6: {
      daily: 4000,
      easy: 300,
      medium: 600,
      hard: 900,
      deadly: 1400
    },
    7: {
      daily: 5000,
      easy: 350,
      medium: 750,
      hard: 1100,
      deadly: 1700
    },
    8: {
      daily: 6000,
      easy: 450,
      medium: 900,
      hard: 1400,
      deadly: 2100
    },
    9: {
      daily: 7500,
      easy: 550,
      medium: 1100,
      hard: 1600,
      deadly: 2400
    },
    10: {
      daily: 9000,
      easy: 600,
      medium: 1200,
      hard: 1900,
      deadly: 2800
    },
    11: {
      daily: 10500,
      easy: 800,
      medium: 1600,
      hard: 2400,
      deadly: 3600
    },
    12: {
      daily: 11500,
      easy: 1000,
      medium: 2000,
      hard: 3000,
      deadly: 4500
    },
    13: {
      daily: 13500,
      easy: 1100,
      medium: 2200,
      hard: 3400,
      deadly: 5100
    },
    14: {
      daily: 15000,
      easy: 1250,
      medium: 2500,
      hard: 3800,
      deadly: 5700
    },
    15: {
      daily: 18000,
      easy: 1400,
      medium: 2800,
      hard: 4300,
      deadly: 6400
    },
    16: {
      daily: 20000,
      easy: 1600,
      medium: 3200,
      hard: 4800,
      deadly: 7200
    },
    17: {
      daily: 25000,
      easy: 2000,
      medium: 3900,
      hard: 5900,
      deadly: 8800
    },
    18: {
      daily: 27000,
      easy: 2100,
      medium: 4200,
      hard: 6300,
      deadly: 9500
    },
    19: {
      daily: 30000,
      easy: 2400,
      medium: 4900,
      hard: 7300,
      deadly: 10900
    },
    20: {
      daily: 40000,
      easy: 2800,
      medium: 5700,
      hard: 8500,
      deadly: 12700
    }
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CONST);

/***/ }),

/***/ "./src/js/encounter.js":
/*!*****************************!*\
  !*** ./src/js/encounter.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var encounter = {
  difficulty: "medium",
  monsters: [],

  get totalExp() {
    return this.monsters.reduce(function (acc, monster) {
      return acc + monster.xp;
    }, 0);
  },

  get adjustedExp() {
    var multiplierCategory;
    var multipliers = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5];

    if (this.monsters.length < 3) {
      multiplierCategory = this.monsters.length;
    } else if (this.monsters.length < 7) {
      multiplierCategory = 3;
    } else if (this.monsters.length < 11) {
      multiplierCategory = 4;
    } else if (this.monsters.length < 15) {
      multiplierCategory = 5;
    } else {
      multiplierCategory = 6;
    }

    if (this.app.party.totalPlayers < 3) {
      multiplierCategory++;
    } else if (this.app.party.totalPlayers > 5) {
      multiplierCategory--;
    }

    return multipliers[Math.max(0, multiplierCategory)];
  },

  get actualDifficulty() {
    var exp = this.adjustedExp;
    var levels = this.app.party.experience;

    if (exp === 0) {
      return 'None';
    }

    if (exp < levels.easy) {
      return '';
    } else if (exp < levels.medium) {
      return "Easy";
    } else if (exp < levels.hard) {
      return "Medium";
    } else if (exp < levels.deadly) {
      return "Hard";
    }

    return "Deadly";
  },

  generateRandom: function generateRandom() {
    var totalExperienceTarget = this.party.experience[this.difficulty];
    console.log(totalExperienceTarget);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (encounter);
/*

(function() {
	"use strict";

	angular.module("app")
		.factory("randomEncounter", RandomEncounterService);

	RandomEncounterService.$inject = ["monsterFactory", "misc", "shuffle", "metaInfo", "monsters"];

	function RandomEncounterService(monsterLib, miscLib, shuffle, metaInfo, monsters) {
		var randomEncounter = {
			//
			//	getRandomEncounter
			//		playerCount: Count of total number of players in party
			//		targetTotalExp: The experience target value. Takes into account player count, player level, and target difficulty already.
			//		filters: Any filters that should be applied when making the encounter
			//
			getRandomEncounter: function (playerCount, targetTotalExp, filters, maxMonsters) {
				var fudgeFactor = 1.1, // The algorithm is conservative in spending exp, so this tries to get it closer to the actual medium value
					baseExpBudget = targetTotalExp * fudgeFactor,
					encounterTemplate = getEncounterTemplate(maxMonsters),
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

		function getEncounterTemplate(maxMonsters) {
			var templates = [
					[ 1 ],
					[ 1, 1 ],
					[ 1, 2 ],
					[ 1, 5 ],
					[ 1, 1, 1 ],
					[ 1, 1, 2 ],
					[ 1, 2, 3 ],
					[ 2, 2 ],
					[ 2, 4 ],
					[ 8 ],
				];
			if (maxMonsters) {
				templates = templates.filter(function(t) {
					let sum = t.reduce(function (a, b) { return a+b; });
					return sum <= maxMonsters;
				});
			}
			var groups = JSON.parse(JSON.stringify(templates[Math.floor(Math.random() * templates.length)])),
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




 */

/***/ }),

/***/ "./src/js/party.js":
/*!*************************!*\
  !*** ./src/js/party.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./src/js/constants.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var party = {
  groups: [],
  _experience: false,
  add_group: function add_group() {
    this.groups.push(_objectSpread({}, this.groups[this.groups.length - 1]));
    this._experience = false;
  },
  remove_group: function remove_group(index) {
    this.groups.splice(index, 1);
    this._experience = false;
  },

  get experience() {
    if (!this._experience) {
      this._experience = this.groups.reduce(function (acc, group) {
        var groupExp = _constants_js__WEBPACK_IMPORTED_MODULE_0__["default"].EXP[group.level];
        return {
          easy: acc.easy + groupExp.easy * group.players,
          medium: acc.medium + groupExp.medium * group.players,
          hard: acc.hard + groupExp.hard * group.players,
          deadly: acc.deadly + groupExp.deadly * group.players,
          daily: acc.daily + groupExp.daily * group.players
        };
      }, {
        easy: 0,
        medium: 0,
        hard: 0,
        deadly: 0,
        daily: 0
      });
    }

    return this._experience;
  },

  get totalPlayers() {
    return this.groups.reduce(function (acc, group) {
      return acc + group.players;
    }, 0);
  }

};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (party);

/***/ }),

/***/ "./src/css/kobold.css":
/*!****************************!*\
  !*** ./src/css/kobold.css ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/app": 0,
/******/ 			"css/styles": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_5e_monsters"] = self["webpackChunk_5e_monsters"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/styles"], () => (__webpack_require__("./src/js/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/styles"], () => (__webpack_require__("./src/css/kobold.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;