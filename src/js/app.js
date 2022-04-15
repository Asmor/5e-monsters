require('@fortawesome/fontawesome-free')

import encounter from "./encounter.js";
import party from "./party.js";
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

        pages: 1,
        page: 1,
        monstersPerPage: 10,
        allMonsters: [],
        filteredMonsters: [],

        sources: {},

        searchPlaceholder: "",

        difficultySelectOpen: false,
        minCr: 0,
        maxCr: 30,

        filters: {},
        nonDefaultFiltersCount: 0,

        encounter,
        party,

        init(){
            this.encounter.app = this;
            this.party.app = this;
            this.fetchData();
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
            this.searchPlaceholder = lib.randomArrayElement(this.allMonsters).name;
            this.filteredMonsters = this.filterMonsters();
            this.isLoading = false;
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
                return new Monster(this, data);
            }));
        },

        filterMonsters(crString = false, filterCallback = () => { return true; }){
            return this.allMonsters.filter(monster => {
                return filterCallback(monster) && monster.filter(this.filters, crString)
            });
        },

        get monsters(){
            const page = this.page-1;
            const start = !page ? 0 : (page*this.monstersPerPage)+1;
            const end = (page+1)*this.monstersPerPage;
            return this.filteredMonsters.slice(start, end);
        },

        filtersChanged($event){
            const { name, value, asArray } = $event.detail;
            this.filters[name] = asArray ? Object.values(value) : value;
            this.filteredMonsters = this.filterMonsters();
            this.nonDefaultFiltersCount = Object.entries(this.filters).filter(entry => {
                const [name, filter] = entry;
                switch(name){
                    case "cr":
                        return filter.min !== 0 && filter.max !== 30;
                    case "search":
                        return false;
                    default:
                        return filter.length && !filter.includes('any');
                }
            }).length;
        },

        formatNumber(num){
            return internationalNumberFormat.format(num);
        },
    }
}

function multiSlider($el, $persist, name, options, updateCallback) {
    return {
        slider: {},
        originals: [],
        value: $persist({min: '0', max: '30'}).as(name),
        init() {
            this.originals = [0, options.findIndex((option) => option.value === '30')];
            this.slider = noUiSlider.create($el, {
                start: [options.findIndex((option) => option.value === this.value.min), options.findIndex((option) => option.value === this.value.max)],
                connect: true,
                range: {
                    'min': 0,
                    'max': options.length - 1
                },
                step: 1
            });

            this.slider.on('update', (values) => updateCallback(options[parseInt(values[0])], options[parseInt(values[1])]));
            this.slider.on('change', (values) => {
                this.value = {
                    min: options[parseInt(values[0])].value,
                    max: options[parseInt(values[1])].value
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
            this.slider.set(this.originals);
        },
        set($event) {
            this.slider.set($event.detail);
        }
    }
}

function multiSelect($el, $persist, name, options) {
    return {
        multiple: true,
        value: $persist(['any']).as(name),
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
                }

                refreshChoices()

                $el.addEventListener('change', () => {
                    this.value = choices.getValue(true);
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
