import encounter from "./encounter.js";
import party from "./party.js";
import noUiSlider from "nouislider";
import * as lib from "./lib.js";
import CONST from "./constants.js";
import { isValidHttpUrl } from "./lib.js";

const internationalNumberFormat = new Intl.NumberFormat('en-US')

function app() {

    const cr_list = ["0", "1/8", "1/4", "1/2"];
    for(let i = 1; i <= 30; i++) cr_list.push(i.toString());

    return {
        menu: true,
        isLoading: true,
        loading: false,

        pages: 1,
        page: 1,
        monstersPerPage: 10,
        allMonsters: [],
        filteredMonsters: [],

        sources: [],

        searchPlaceholder: "",

        difficultySelectOpen: false,
        minCr: 0,
        maxCr: 30,

        cr_list,

        filters: {},

        encounter,
        party,

        init(){
            this.encounter.app = this;
            this.party.app = this;
            this.loadSettings();
            this.setupListeners();
            this.fetchData();
        },

        loadSettings(){
            this.party.groups = localStorage.getItem("party") ? JSON.parse(localStorage.getItem("party")) : [{ players: 4, level: 1 }];
            this.encounter.difficulty = localStorage.getItem("difficulty") || "medium";
            this.filters = localStorage.getItem("filters") ? JSON.parse(localStorage.getItem("filters")) : {};
        },

        setupListeners(){
            this.$watch("party.groups", () => {
                localStorage.setItem("party", JSON.stringify(this.party.groups));
            });
            this.$watch("encounter.difficulty", () => {
                localStorage.setItem("difficulty", this.encounter.difficulty);
            });
            this.$watch("filters", () => {
                localStorage.setItem("filters", JSON.stringify(this.filters));
            });
        },

        async fetchData() {
            this.isLoading = true;

            await fetch("/json/se_sources.json")
                .then(res => res.json())
                .then(this.formatSources.bind(this))

            await fetch("/json/se_third_party_sources.json")
                .then(res => res.json())
                .then(this.formatSources.bind(this))

            await fetch("/json/se_community_sources.json")
                .then(res => res.json())
                .then(this.formatSources.bind(this))

            await fetch("/json/se_monsters.json")
                .then(res => res.json())
                .then(this.formatMonsters.bind(this));

            await fetch("/json/se_third_party_monsters.json")
                .then(res => res.json())
                .then(this.formatMonsters.bind(this));

            await fetch("/json/se_community_monsters.json")
                .then(res => res.json())
                .then(this.formatMonsters.bind(this));

            this.page = 1;
            this.pages = Math.floor(this.allMonsters.length / this.monstersPerPage);
            this.searchPlaceholder = lib.random_array_element(this.allMonsters).name;
            this.filteredMonsters = this.filterMonsters();
            this.isLoading = false;
        },

        formatSources(data){
            this.sources = this.sources.concat(data);
            this.sources.sort((a, b) => a.name > b.name ? 1 : -1);
        },

        formatMonsters(data){

            this.allMonsters = this.allMonsters.concat(data.map(monster => {
                monster.cr = CONST.CR[monster.cr];
                monster.sources = monster.sources.split(', ').map(str => {
                    const [ book, location ] = str.split(": ");
                    const source = { book }
                    if(!isNaN(location)){
                        source.page = location;

                        const bookFound = this.sources.find(src => {
                            return src.name === book;
                        });
                        if(bookFound.link){
                            source.link = bookFound.link;
                        }
                        
                    }else if(lib.isValidHttpUrl(location)){
                        source.link = location;
                    }

                    source.fullText = source.book + (source.page ? ' p.' + source.page : '');
                    return source;
                });
                return monster;
            }));

        },

        filterMonsters(crString = false){

            const hasFilters = Object.entries(this.filters).length > 0;
            const filters = this.filters;

            const legendaryMap = {
                'Legendary': 'legendary',
                'Legendary (in lair)': 'lair',
                'Ordinary': false
            };

            return this.allMonsters.filter(monster => {

                if (crString && monster.cr.string !== crString) return false;

                if (hasFilters) {

                    if (filters.sources?.length){
                        let found = false;
                        for (let source of monster.sources){
                            if(filters.sources.includes(source.book)){
                                found = true;
                                break;
                            }
                        }
                        if(!found) return false;
                    }

                    if (filters.size?.length && !filters.size?.includes("any")) {
                        if (!filters.size.includes(monster.size.toLowerCase())) return false;
                    }

                    if (filters.legendary?.length && !filters.legendary?.includes("any")) {
                        for (let legendary of filters.legendary) {
                            let legendaryMonsterKey = legendaryMap[filters.legendary];

                            if (legendaryMonsterKey) {
                                if (!monster[legendaryMonsterKey]) return false;
                            } else {
                                if (monster.legendary || monster.lair) return false;
                            }
                        }
                    }

                    if (filters.type?.length && !filters.type?.includes("any")) {
                        if (!filters.type.includes(monster.type.toLowerCase())) return false;
                    }

                    if (filters.alignment?.length && !filters.alignment?.includes("any")) {
                        if (!filters.alignment.includes(monster.alignment.toLowerCase())) return false;
                    }

                    if (filters.environment?.length && monster.environments.indexOf(filters.environment) === -1) {
                        return false;
                    }

                    if (!crString && filters?.cr) {
                        if (filters.cr?.min !== 0 && monster.cr.numeric < filters.cr.min) {
                            return false;
                        }
                        if (filters.cr?.max !== 30 && monster.cr.numeric > filters.cr.max) {
                            return false;
                        }
                    }
                }

                return true;

            });
        },

        get monsters(){
            const page = this.page-1;
            const start = !page ? 0 : (page*this.monstersPerPage)+1;
            const end = (page+1)*this.monstersPerPage;
            return this.filteredMonsters.slice(start, end);
        },

        filtersChanged($event){
            const { name, value } = $event.detail;
            this.filters[name] = Object.values(value);
            this.filteredMonsters = this.filterMonsters();
        },

        crChanged($event){
            const { name, value } = $event.detail;
            this.filters[name] = value;
            this.filteredMonsters = this.filterMonsters();
        },

        formatNumber(num){
            return internationalNumberFormat.format(num);
        },
    }
}

function multiSlider($el, options, updateCallback) {
    const totalSteps = options.length - 1;

    return {
        slider: {},
        originals: [],
        init() {
            this.originals = [0, totalSteps];
            this.slider = noUiSlider.create($el, {
                start: [8, totalSteps - 8],
                connect: true,
                range: {
                    'min': 0,
                    'max': totalSteps
                },
                step: 1
            });

            this.slider.on('update', (values) => updateCallback(options[parseInt(values[0])], options[parseInt(values[1])]));
            this.slider.on('change', (values) => {
                window.dispatchEvent(new CustomEvent('cr-changed', { detail: {
                    name: "cr",
                    value: {
                        min: CONST.CR[options[parseInt(values[0])].value].numeric,
                        max: CONST.CR[options[parseInt(values[1])].value].numeric
                    }
                }}))
            });
        },
        reset() {
            this.slider.set(this.originals);
        },
        set($event) {
            this.slider.set($event.detail);
        }
    }
}

function multiSelect($el, name, options) {
    return {
        multiple: true,
        value: ['any'],
        name: name,
        options: options,
        init() {
            this.$nextTick(() => {
                let choices = new Choices($el, {
                    allowHTML: true,
                    removeItemButton: true,
                })

                let refreshChoices = () => {
                    let selection = this.multiple ? this.value : [this.value]

                    choices.clearStore()
                    choices.setChoices(this.options.map(({ value, label }) => ({
                        value,
                        label,
                        selected: selection.includes(value),
                    })))
                }

                refreshChoices()

                $el.addEventListener('change', () => {
                    this.value = choices.getValue(true);
                    window.dispatchEvent(new CustomEvent('filters-changed', { detail: {
                        name: this.name,
                        value: this.value
                    }}))
                })

                this.$watch('value', () => refreshChoices())
                this.$watch('options', () => refreshChoices())
            })
        }
    }
}

window.app = app;
window.multiSelect = multiSelect;
window.multiSlider = multiSlider;
window.noUiSlider = noUiSlider;