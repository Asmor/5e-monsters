const internationalNumberFormat = new Intl.NumberFormat('en-US')

function app() {

    const cr_list = ["0", "1/8", "1/4", "1/2"];
    for(let i = 1; i <= 30; i++) cr_list.push(i.toString());

    return {
        menu: true,
        isLoading: true,
        loading: false,
        allMonsters: [],
        pages: 1,
        page: 1,
        cr_list: cr_list,

        init(){
            this.fetch_monsters()
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
                })
                .catch((err) => {
                    console.log(err);
                })

        },

        get monsters(){
            const start = !this.page ? 0 : (this.page*10)+1;
            const end = (this.page+1)*10;
            return this.allMonsters.slice(start, end);
        },

        setSizes(sizes) {
            this.sizes = sizes;
        },

        add_party() {
            this.parties.push({
                ...this.parties[this.parties.length-1]
            });
        },

        remove_party(){
            this.parties.pop();
        },

        formatNumber(num){
            return internationalNumberFormat.format(num);
        },

        party_xp: {
            easy: 1025,
            medium: 2050,
            hard: 3075,
            deadly: 4500,
            daily: 14300,
        },

        parties: [
            {
                players: 4,
                level: 5
            },
            {
                players: 1,
                level: 1
            },
            {
                players: 1,
                level: 1
            }
        ],

        get total_players(){
            return this.parties.reduce(function(acc, item){
                return acc + item.players
            }, 0);
        },

        randomEncounter: {
            open: false,
            type: "Medium",
            set(type){
                this.type = type;
                this.open = false;
            },
            monsters: [
                {
                    name: "Young Blue Dragon",
                    cr: 9,
                    xp: 5000,
                    source: "Monster Manual",
                    source_page: "p.91",
                    count: 1
                }
            ],
            difficulty: "Easy",
            get total_xp(){
                return this.monsters.reduce((acc, monster) => {
                    return acc + monster.xp;
                }, 0);
            },
            adjusted_xp: 1450,
        }
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
                    sizes = this.value;
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