import CONST from "./constants.js";

const party = {

    groups: [],

    add_group() {
        this.groups.push({
            ...this.groups[this.groups.length-1]
        });
        this._experience = false;
    },

    remove_group(index){
        this.groups.splice(index, 1);
        this._experience = false;
    },

    get experience(){
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

    get totalPlayers(){
        return this.groups.reduce((acc, group) => { return acc + group.players }, 0);
    }

}

export default party;