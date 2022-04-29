import CONST from "./constants.js";
import * as lib from "./lib.js";

const regexCache = {};
let lastRegex = "";

export default class Monster {

    constructor(app, data) {
        this.app = app;
        this.data = data;
        this.cr = CONST.CR[this.data.cr];

        this.slug = lib.slugify(this.data.name+'-'+this.data.sources+"-"+this.cr.string);

        this.tags = this.data.tags ? this.data.tags.split(/\s*,\s*/).sort() : null;

        this.special = !!this.data.special;
        this.legendary = !!this.data.legendary;
        this.lair = !!this.data.lair;
        this.unique = !!this.data.unique;
        this.alignment = this.data.alignment ? Monster.parseAlignment(this.data.alignment) : "";

        this.environments.split(',').forEach(environment => {

            if(environment && !this.app.environments[environment]){
                let label = environment = environment.trim();
                label = label.slice(0,1).toUpperCase() + label.slice(1);
                this.app.environments[environment] = {
                    value: environment,
                    label: label
                }
            }
        });

        this.searchable = [
            this.data.name,
            this.data.section,
            this.data.type,
            this.data.size,
            (this.data.alignment) ? this.alignment.text : "",
            this.data.cr.string
        ].concat(this.tags).join("|").toLowerCase();

        this.sources = this.data.sources.split(', ').map(str => {
            const [book, location] = str.split(": ");
            let source = {};
            if (!isNaN(location)) {
                source.reference = this.app.sources[book];
                source.page = location;
            } else if (lib.isValidHttpUrl(location)) {
                source.reference = {
                    name: book,
                    shortname: book,
                    link: location
                }
            }

            source.fullText = source.reference.name + (source.page ? ' p.' + source.page : '');
            return source;
        });

        this.sources.sort((a, b) => a.fullText.localeCompare(b.fullText, 'en', { sensitivity: "base" }))

    }

    get name() {
        return this.data.name;
    }

    get type() {
        return this.data.type;
    }

    get size() {
        return this.data.size;
    }

    get environments() {
        return this.data.environment;
    }

    get isUnique () {
        return !!this.data["unique?"];
    }

    get sourceEnabled() {
        return this.sources.find(source => source.reference.enabled);
    }

    static parseAlignment(str = "") {
        return {
            string: str, bits: str.split(/\s*(,|or|,\s*or)\s*/i)
                .reduce((total, alignment) => {
                    return total | (CONST.ALIGNMENT_TEST_ORDER.find(function (alignmentDefinition) {
                        return alignment.match(alignmentDefinition.regex);
                    })?.bits ?? CONST.ALIGNMENTS.UNALIGNED.bits);
                }, 0)
        };
    }

    filter(search, filters, crString = false) {

        if (search) {

            let checkRegex = search.match(/^\/(.*?)\/?$/);
            if (checkRegex) {
                let regex;
                let raw = checkRegex[1];
                try {
                    regex = regexCache[raw] || new RegExp(raw, "i");

                    if (regex) {
                        lastRegex = regex;
                    }
                } catch (ex) {
                    regexCache[raw] = null;
                }

                regex = regex || lastRegex;

                if (!this.searchable.match(regex)) {
                    return false;
                }
            } else if (this.searchable.indexOf(search.toLowerCase()) === -1) {
                return false;
            }
        }

        if (crString && this.cr.string !== crString) return false;

        if (filters.alignment !== undefined && !(this.alignment.bits & filters.alignment)) {
            return false;
        }

        if (filters.size?.length && !filters.size?.includes("any")) {
            if (!filters.size.includes(this.size.toLowerCase())) return false;
        }

        if (filters.legendary?.length && !filters.legendary?.includes("any")) {
            for (let legendary of filters.legendary) {
                let legendaryMonsterKey = CONST.LEGENDARY_MAP[filters.legendary];

                if (legendaryMonsterKey) {
                    if (!this.data.legendary[legendaryMonsterKey]) return false;
                } else {
                    if (this.legendary || this.lair) return false;
                }
            }
        }

        if (filters.type?.length && !filters.type?.includes("any")) {
            if (!filters.type.includes(this.type.toLowerCase())) return false;
        }

        if (filters.environment?.length && !filters.environment?.includes("any")) {
            if (!filters.environment.find(environment => this.environments.indexOf(environment) > -1)) {
                return false;
            }
        }

        if (!crString && filters?.cr) {
            if (filters.cr?.min !== 0 && this.cr.numeric < filters.cr.min) {
                return false;
            }
            if (filters.cr?.max !== 30 && this.cr.numeric > filters.cr.max) {
                return false;
            }
        }

        return true;

    }

}