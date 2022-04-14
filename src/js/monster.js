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
        return this.data.environments;
    }

    static parseAlignment(str) {
        let bits = (str || "")
            .split(/\s*(,|or|,\s*or)\s*/i)
            .reduce(function (total, current) {
                return total | Monster.parseSingleAlignmentFlags(current);
            }, 0);

        if (!bits) {
            bits = CONST.ALIGNMENTS.UNALIGNED.bits;
        }

        return { string: str, bits: bits };
    }

    static parseSingleAlignmentFlags(alignment) {
        let flags;

        alignmentTestOrder.some(function (alignmentDefinition) {
            if ( alignment.match(alignmentDefinition.regex) ) {
                flags = alignmentDefinition.bits;
                return true;
            }
        });

        return flags;
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
                let legendaryMonsterKey = legendaryMap[filters.legendary];

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

        if (filters.alignment?.length && !filters.alignment?.includes("any")) {
            for(let alignment of filters.alignment){

            }
            if (!filters.alignment.includes(this.alignment.toLowerCase())) return false;
        }

        if (filters.environment?.length && this.environments.indexOf(filters.environment) === -1) {
            return false;
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

const legendaryMap = {
    'Legendary': 'legendary',
    'Legendary (in lair)': 'lair',
    'Ordinary': false
};

const alignmentTestOrder = [
    CONST.ALIGNMENTS.ANY_CHAOTIC,
    CONST.ALIGNMENTS.ANY_EVIL,
    CONST.ALIGNMENTS.ANY_GOOD,
    CONST.ALIGNMENTS.ANY_LAWFUL,
    CONST.ALIGNMENTS.ANY_NEUTRAL,
    CONST.ALIGNMENTS.NON_CHAOTIC,
    CONST.ALIGNMENTS.NON_EVIL,
    CONST.ALIGNMENTS.NON_GOOD,
    CONST.ALIGNMENTS.NON_LAWFUL,
    CONST.ALIGNMENTS.UNALIGNED,
    CONST.ALIGNMENTS.LAWFUL_GOOD,
    CONST.ALIGNMENTS.NEUTRAL_GOOD,
    CONST.ALIGNMENTS.CHAOTIC_GOOD,
    CONST.ALIGNMENTS.LAWFUL_NEUTRAL,
    CONST.ALIGNMENTS.CHAOTIC_NEUTRAL,
    CONST.ALIGNMENTS.LAWFUL_EVIL,
    CONST.ALIGNMENTS.NEUTRAL_EVIL,
    CONST.ALIGNMENTS.CHAOTIC_EVIL,
    CONST.ALIGNMENTS.NEUTRAL,
    CONST.ALIGNMENTS.ANY
]