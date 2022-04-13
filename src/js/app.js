import encounter from "./encounter.js";
import party from "./party.js";
import noUiSlider from "nouislider";
import * as lib from "./lib.js";
import { random_array_element } from "./lib.js";

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

        cr_list,

        encounter,
        party,

        init(){
            this.fetch_monsters();
            this.party.groups = localStorage.getItem("party") ? JSON.parse(localStorage.getItem("party")) : [{ players: 4, level: 1 }];
            this.$watch("party.groups", () => {
                localStorage.setItem("party", JSON.stringify(this.party.groups));
            });
            this.encounter.app = this;
            this.party.app = this;
        },

        fetch_monsters() {
            this.isLoading = true;
            fetch("/json/se_monsters.json")
                .then(res => res.json())
                .then(data => {
                    this.isLoading = false;
                    this.allMonsters = data;
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

        formatNumber(num){
            return internationalNumberFormat.format(num);
        },
    }
}

function multiSelect($el, options) {
    return {
        multiple: true,
        value: ['any'],
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
                    this.value = choices.getValue(true)
                })

                this.$watch('value', () => refreshChoices())
                this.$watch('options', () => refreshChoices())
            })
        }
    }
}

window.app = app;
window.multiSelect = multiSelect;
window.noUiSlider = noUiSlider;