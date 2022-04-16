require('@fortawesome/fontawesome-free')

import encounter from "./encounter.js";
import noUiSlider from "nouislider";
import * as lib from "./lib.js";
import CONST from "./constants.js";
import Monster from "./monster.js";

import persist from '@alpinejs/persist'
import Alpine from 'alpinejs'

const internationalNumberFormat = new Intl.NumberFormat('en-US')

function app() {
    
    return {
        menu: true,
        isLoading: true,
        loading: false,
        showFilters: true,
        showSourcesModal: true,

        filters: {},
        searchPlaceholder: "",
        nonDefaultFiltersCount: 0,

        loadedSources: Alpine.$persist([]).as('sources'),
        loadedMonsters: Alpine.$persist([]).as('monsters'),

        encounterHistory: Alpine.$persist([]).as('encounterHistory'),
        savedEncounters: Alpine.$persist([]).as('savedEncounters'),

        loadedEncounterIndex: null,

        sources: {},
        allMonsters: [],
        filteredMonsters: [],
        monsterLookupTable: {},

        totalPages: 1,
        currentPage: 1,
        pagination: [],
        monstersPerPage: Alpine.$persist(10).as("monstersPerPage"),

        encounterType: Alpine.$persist("random").as("encounterType"),
        encounterTypeSelectOpen: false,
        encounterTypes: Object.fromEntries(Object.entries(CONST.ENCOUNTER_TYPES).map(entry => {
            return [entry[0], { key: entry[0], label: entry[1].name }];
        })),

        difficultySelectOpen: false,
        difficulty: Alpine.$persist("medium").as("difficulty"),
        search: Alpine.$persist("").as("search"),

        encounter: encounter,

        party: {

            groups: Alpine.$persist([{ players: 4, level: 1 }]).as('groups'),

            add_group() {
                this.groups.push({
                    ...this.groups[this.groups.length - 1]
                });
            },

            remove_group(index) {
                this.groups.splice(index, 1);
            },

            get experience() {
                return this.groups.reduce((acc, group) => {
                    const groupExp = CONST.EXP[group.level];
                    return {
                        easy: acc.easy + (groupExp.easy * group.players),
                        medium: acc.medium + (groupExp.medium * group.players),
                        hard: acc.hard + (groupExp.hard * group.players),
                        deadly: acc.deadly + (groupExp.deadly * group.players),
                        daily: acc.daily + (groupExp.daily * group.players)
                    }
                }, { easy: 0, medium: 0, hard: 0, deadly: 0, daily: 0 });
            },

            get totalPlayers() {
                return this.groups.reduce((acc, group) => {
                    return acc + group.players
                }, 0);
            }

        },

        init(){
            this.encounter.app = this;
            this.party.app = this;
            this.fetchData();
        },

        get monsters(){
            const currentPage = this.currentPage-1;
            const start = !currentPage ? 0 : (currentPage*this.monstersPerPage)+1;
            const end = !currentPage ? this.monstersPerPage : ((currentPage+1)*this.monstersPerPage)+1
            return this.filteredMonsters.slice(start, end);
        },

        async fetchData() {
            this.isLoading = true;
            this.formatSources(await this.fetchSources());
            this.formatMonsters(await this.fetchMonsters());
            this.currentPage = 1;
            this.searchPlaceholder = lib.randomArrayElement(this.allMonsters).name;
            this.filteredMonsters = this.filterMonsters();
            this.isLoading = false;
            this.updatePagination();

            if(this.encounterHistory.length){
                this.encounter.load(this.encounterHistory[this.encounterHistory.length-1]);
            }
        },

        setPage(page){
            if(page.divider) return;
            this.setPageNumber(page.number)
        },

        setPageNumber(num){
            this.currentPage = num;
            this.updatePagination();
        },

        updatePagination(){

            this.currentPage = Math.max(1, Math.min(this.totalPages, this.currentPage));
            this.totalPages = Math.floor(this.filteredMonsters.length / this.monstersPerPage);

            if(this.currentPage < 5){
                this.pagination = [
                    { number: 1, active: this.currentPage === 1 },
                    { number: 2, active: this.currentPage === 2 },
                    { number: 3, active: this.currentPage === 3 },
                    { number: 4, active: this.currentPage === 4 },
                    { number: 5, active: this.currentPage === 5 },
                    { divider: true },
                    { number: this.totalPages }
                ]
            }else if(this.currentPage > this.totalPages-5){
                this.pagination = [
                    { number: 1 },
                    { divider: true },
                    { number: this.totalPages-4, active: this.totalPages-4 === this.currentPage },
                    { number: this.totalPages-3, active: this.totalPages-3 === this.currentPage },
                    { number: this.totalPages-2, active: this.totalPages-2 === this.currentPage },
                    { number: this.totalPages-1, active: this.totalPages-1 === this.currentPage },
                    { number: this.totalPages, active: this.totalPages === this.currentPage  }
                ]
            }else{
                this.pagination = [
                    { number: 1 },
                    { divider: true },
                    { number: this.currentPage-1 },
                    { number: this.currentPage, active: true },
                    { number: this.currentPage+1 },
                    { divider: true },
                    { number: this.totalPages }
                ]
            }

        },

        async fetchSources(){

            if(this.loadedSources.length){
                return this.loadedSources;
            }

            let sources = [];

            await fetch("/json/se_sources.json")
                .then(res => res.json())
                .then((data) => {
                    sources = sources.concat(data);
                });

            await fetch("/json/se_third_party_sources.json")
                .then(res => res.json())
                .then((data) => {
                    sources = sources.concat(data);
                });

            await fetch("/json/se_community_sources.json")
                .then(res => res.json())
                .then((data) => {
                    sources = sources.concat(data);
                });

            this.loadedSources = sources;

            return sources;

        },

        async fetchMonsters(){

            if(this.loadedMonsters.length){
                return this.loadedMonsters;
            }

            let monsters = [];

            await fetch("/json/se_monsters.json")
                .then(res => res.json())
                .then((data) => {
                    monsters = monsters.concat(data);
                });

            await fetch("/json/se_third_party_monsters.json")
                .then(res => res.json())
                .then((data) => {
                    monsters = monsters.concat(data);
                });

            await fetch("/json/se_community_monsters.json")
                .then(res => res.json())
                .then((data) => {
                    monsters = monsters.concat(data);
                });

            this.loadedMonsters = monsters;

            return monsters;
        },

        formatSources(data){
            this.sources = data.reduce((acc, source) => {
                acc[source.name] = source;
                return acc;
            }, this.sources);
            //this.sources.sort((a, b) => a.name > b.name ? 1 : -1);
        },

        formatMonsters(data){
            this.allMonsters = this.allMonsters.concat(data.map(data => {
                const monster = new Monster(this, data);
                this.monsterLookupTable[monster.slug] = monster;
                return monster;
            }));
        },

        filterMonsters(crString = false, filterCallback = () => { return true; }){
            return this.allMonsters.filter(monster => {
                return filterCallback(monster) && monster.filter(this.search, this.filters, crString)
            });
        },

        filtersChanged($event){
            const { name, value, asArray } = $event.detail;
            this.filters[name] = asArray ? Object.values(value) : value;
            this.nonDefaultFiltersCount = Object.entries(this.filters).filter(entry => {
                const [name, filter] = entry;
                switch(name){
                    case "cr":
                        return filter.min !== 0 || filter.max !== 30;
                    case "alignment":
                        return filter !== CONST.ALL_ALIGNMENTS;
                    default:
                        return filter.length && !filter.includes('any');
                }
            }).length;
            this.updateFilteredMonsters();
        },

        updateFilteredMonsters(){
            this.filteredMonsters = this.filterMonsters();
            this.updatePagination();
        },

        formatNumber(num){
            return internationalNumberFormat.format(num);
        },
    }
}

function multiSlider($el, name, options, updateCallback) {
    return {
        slider: {},
        originals: {
            min: '0',
            max: '30',
        },
        options: options,
        value: Alpine.$persist({min: '0', max: '30'}).as(name),
        init() {
            this.slider = noUiSlider.create($el, {
                start: [options.findIndex((option) => option.value === this.value.min), options.findIndex((option) => option.value === this.value.max)],
                connect: true,
                range: {
                    'min': 0,
                    'max': options.length - 1
                },
                step: 1
            });

            this.slider.on('update', (values) => updateCallback(this.options[parseInt(values[0])], this.options[parseInt(values[1])]));
            this.slider.on('change', (values) => {
                this.value = {
                    min: this.options[parseInt(values[0])].value,
                    max: this.options[parseInt(values[1])].value
                };

                this.onFiltersChanged();
            });

            this.onFiltersChanged();
        },
        onFiltersChanged() {
            window.dispatchEvent(new CustomEvent('filters-changed', { detail: {
                    name: "cr",
                    value: {
                        min: CONST.CR[this.value.min].numeric,
                        max: CONST.CR[this.value.max].numeric
                    }
                }}))
        },
        reset() {
            this.value = JSON.parse(JSON.stringify(this.originals));
            this.slider.set([0, this.options.length - 1]);

            this.onFiltersChanged();
        },
        set($event) {
            this.slider.set($event.detail);
        }
    }
}

function multiSelect($el, name, options) {
    return {
        multiple: true,
        value: Alpine.$persist(['any']).as(name),
        name: name,
        options: options,
        init() {
            this.$nextTick(() => {
                let choices = new Choices($el, {
                    allowHTML: true,
                    removeItemButton: true
                })

                let refreshChoices = () => {
                    let selection = this.multiple ? this.value : [this.value]

                    choices.clearStore()
                    choices.setChoices(this.options.map(({ value, label }) => ({
                        value,
                        label,
                        selected: selection.includes(value),
                    })))

                    this.onFiltersChanged();
                }

                refreshChoices()

                $el.addEventListener('change', () => {
                    this.value = choices.getValue(true);

                    if(this.value.length > 1 && this.value.includes('any')) {
                        this.value = this.value.filter(value => value !== 'any');
                    }

                    if(this.multiple && !this.value.length) {
                        this.value = ['any'];
                    }

                    this.onFiltersChanged();
                })

                this.$watch('value', () => refreshChoices())
                this.$watch('options', () => refreshChoices())

                this.onFiltersChanged();
            })
        },
        onFiltersChanged() {
            window.dispatchEvent(new CustomEvent('filters-changed', { detail: {
                name: this.name,
                asArray: true,
                value: this.value
            }}))
        },
        reset(){
            this.value = ['any'];
        }
    }
}

window.app = app;
window.multiSelect = multiSelect;
window.multiSlider = multiSlider;
window.noUiSlider = noUiSlider;

window.Alpine = Alpine

Alpine.plugin(persist)
Alpine.start()
