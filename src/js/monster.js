import CONST from "./constants.js";
import * as lib from "./lib.js";

const regexCache = {};
let lastRegex = "";

export default class Monster {

    constructor(app, data) {
        this.app = app;
        this.data = data;

        this.cr = CONST.CR[this.data.cr];

        this.tags = this.data.tags ? this.data.tags.split(/\s*,\s*/).sort() : null;

        this.special = !!this.data.special;
        this.legendary = !!this.data.legendary;
        this.lair = !!this.data.lair;
        this.unique = !!this.data.unique;
        this.alignment = this.data.alignment ? Monster.parseAlignment(this.data.alignment) : "";

        this.searchable = [
            this.data.name,
            this.data.section,
            this.data.type,
            this.data.size,
            (this.data.alignment) ? this.alignment.text : "",
            this.data.cr.string
        ].concat(
            this.tags
        ).join("|").toLowerCase();

        this.sources = this.data.sources.split(', ').map(str => {
            const [book, location] = str.split(": ");
            const source = { book }
            if (!isNaN(location)) {
                source.page = location;

                const bookFound = this.app.sources[book];
                if (bookFound.link) {
                    source.link = bookFound.link;
                }

            } else if (lib.isValidHttpUrl(location)) {
                source.link = location;
            }

            source.fullText = source.book + (source.page ? ' p.' + source.page : '');
            return source;
        });

        this.sources.sort((a, b) => a.book.localeCompare(b.book, 'en', { sensitivity: "base" }))

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

    static parseAlignment(str = "") {
        return {
            string: str,
            bits: str.split(/\s*(,|or|,\s*or)\s*/i)
                .reduce((total, alignment) => {
                    return total | (CONST.ALIGNMENT_TEST_ORDER.find(function (alignmentDefinition) {
                        return alignment.match(alignmentDefinition.regex);
                    })?.bits ?? CONST.ALIGNMENTS.UNALIGNED.bits);
                }, 0)
        };
    }

    filter(filters, crString = false) {

        if (crString && this.cr.string !== crString) return false;

        if (filters.search) {

            let checkRegex = filters.search.match(/^\/(.*?)\/?$/);
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
            } else if (this.searchable.indexOf(filters.search.toLowerCase()) === -1) {
                return false;
            }
        }

        if (filters.alignment !== undefined && !(filters.alignment.bits & this.alignment.bits)){
            return false;
        }

        if (filters.sources?.length) {
            let found = false;
            for (let source of this.sources) {
                if (filters.sources.includes(source.book)) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }

        if (filters.size?.length && !filters.size?.includes("any")) {
            if (!filters.size.includes(this.size.toLowerCase())) return false;
        }

        if (filters.legendary?.length && !filters.legendary?.includes("any")) {
            for (let legendary of filters.legendary) {
                let legendaryMonsterKey = CONST.LEGENDARY_MAP[filters.legendary];

                if (legendaryMonsterKey) {
                    if (!this[legendaryMonsterKey]) return false;
                } else {
                    if (this.legendary || this.lair) return false;
                }
            }
        }

        if (filters.type?.length && !filters.type?.includes("any")) {
            if (!filters.type.includes(this.type.toLowerCase())) return false;
        }

        if (filters.environment?.length && !filters.environment?.includes("any")) {
            if(!filters.environment.find(environment => this.environments.indexOf(environment) > -1)) {
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