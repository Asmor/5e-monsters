import encounter from "./encounter.js";
import party from "./party.js";
import noUiSlider from "nouislider";
import * as lib from "./lib.js";
import { random_array_element } from "./lib.js";
import CONST from "./constants.js";

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
        allMonsters: [],
        searchPlaceholder: "",

        difficultySelectOpen: false,
        minCr: 0,
        maxCr: 30,

        cr_list,

        filters: {},

        encounter,
        party,

        init(){
            this.fetch_monsters();
            this.party.groups = localStorage.getItem("party") ? JSON.parse(localStorage.getItem("party")) : [{ players: 4, level: 1 }];
            this.encounter.difficulty = localStorage.getItem("difficulty") || "medium";
            this.$watch("party.groups", () => {
                localStorage.setItem("party", JSON.stringify(this.party.groups));
            });
            this.$watch("encounter.difficulty", () => {
                localStorage.setItem("difficulty", this.encounter.difficulty);
            });
            this.encounter.app = this;
            this.party.app = this;

            this.$watch('minCr', (value) => {
                console.log(value);
            });
            this.$watch('maxCr', (value) => {
                console.log(value);
            })

            console.log(this.$refs.monster);
        },

        fetch_monsters() {
            this.isLoading = true;
            fetch("/json/se_monsters.json")
                .then(res => res.json())
                .then(data => {
                    this.isLoading = false;
                    this.allMonsters = data.map(monster => {
                        monster.exp = CONST.CR[monster.cr];
                        monster.sources = monster.sources.split(', ').map(source => {
                            return {
                                book: source.split(": ")[0],
                                page: source.split(": ")[1]
                            };
                        });
                        return monster;
                    });
                    this.page = 1;
                    this.pages = Math.floor(this.allMonsters.length / 10);
                    this.searchPlaceholder = lib.random_array_element(this.allMonsters).name;
                });

        },

        get monsters(){
            const start = !this.page ? 0 : (this.page*10)+1;
            const end = (this.page+1)*10;
            return this.allMonsters.slice(start, end);
        },

        filtersChanged($event){
            const { name, value } = $event.detail;
            this.filters[name] = Object.values(value);
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
        init() {
            this.slider = noUiSlider.create($el, {
                start: [5, totalSteps - 4],
                connect: true,
                range: {
                    'min': 0,
                    'max': totalSteps
                },
                step: 1
            });

            this.slider.on('update', (values) => {updateCallback(options[parseInt(values[0])], options[parseInt(values[1])])});
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