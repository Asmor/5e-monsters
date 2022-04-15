/**
 *  Returns a floating point number between a minimum and maximum value
 *
 * @param  {Number}     min                     The minimum value
 * @param  {Number}     max                     The maximum value
 * @return {Number}                             A random value between the range given
 */
export function randomFloatBetween(min, max) {
    const random = Math.random();
    const _max = Math.max(Number(max), Number(min));
    const _min = Math.min(Number(max), Number(min));
    return random * (_max - _min) + _min;
}

/**
 *  Returns an integer between a minimum and maximum value
 *
 * @param  {Number}     min                     The minimum value
 * @param  {Number}     max                     The maximum value
 * @return {Number}                             A random integer between the range given
 */
export function randomIntBetween(min, max) {
    return Math.floor(randomFloatBetween(min, max));
}

/**
 *  Returns a random element in the given array
 *
 * @param  {Array}   inArray                    An array
 * @param  {Boolean} recurse                    Whether to recurse if the randomly chosen element is also an array
 * @return {any}                                A random element from the array
 */
export function randomArrayElement(inArray, { recurse = false } = {}) {
    let choice = inArray[randomIntBetween(0, inArray.length)];
    if (recurse && Array.isArray(choice)) {
        return randomArrayElement(choice, { recurse: true });
    }
    return choice;
}

/**
 * Clones an object and returns a copy of it
 *
 * @param inObj
 * @return {any}
 */
export function clone(inObj){
    return JSON.parse(JSON.stringify(inObj));
}

/**
 * Checks whether a string is
 *
 * @param {String} string
 * @return {boolean}
 */
export function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (err) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

export function ratio(start, end, value){
    return (value-start)/(end-start);
}

export function slugify(str) {
    return str
        .normalize('NFKD')
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[-\s]+/g, '-');
}