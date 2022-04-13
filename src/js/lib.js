export function clone(inObj){
    return JSON.parse(JSON.stringify(inObj));
}

/**
 *  Returns a floating point number between a minimum and maximum value
 *
 * @param  {number}     min                     The minimum value
 * @param  {number}     max                     The maximum value
 * @return {number}                             A random value between the range given
 */
export function random_float_between(min, max) {
    const random = Math.random();
    const _max = Math.max(Number(max), Number(min));
    const _min = Math.min(Number(max), Number(min));
    return random * (_max - _min) + _min;
}

/**
 *  Returns an integer between a minimum and maximum value
 *
 * @param  {number}     min                     The minimum value
 * @param  {number}     max                     The maximum value
 * @return {int}                                A random integer between the range given
 */
export function random_int_between(min, max) {
    return Math.floor(random_float_between(min, max));
}

/**
 *  Returns a shuffled copy of the original array.
 *
 * @param  {array}   inArray
 * @return {array}
 */
export function shuffle_array(inArray) {
    let shuffled = clone(inArray);
    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
}

/**
 *  Returns a random element in the given array
 *
 * @param  {array}   inArray                    An array
 * @param  {boolean} recurse                    Whether to recurse if the randomly chosen element is also an array
 * @return {object}                             A random element from the array
 */
export function random_array_element(inArray, { recurse = false } = {}) {
    let choice = inArray[random_int_between(0, inArray.length)];
    if (recurse && Array.isArray(choice)) {
        return random_array_element(choice, { recurse: true });
    }
    return choice;
}

export function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}