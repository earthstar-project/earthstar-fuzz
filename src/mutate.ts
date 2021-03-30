import { deepEqual } from 'fast-equals';

import {
    b32chars,
    alphaLower,
    alphaUpper,
    digits,
    hexLower,
    authorShortnameChars,
    authorAddressChars,
    workspaceAddressChars,
    workspaceNameChars,
} from 'earthstar';

//================================================================================

// inclusive
export let randInt = (lo: number, hi: number): number =>
    lo + Math.floor(Math.random() * (hi - lo + 1));
export let stringChoice = (chars: string | string[]): string =>
    chars[randInt(0, chars.length-1)];
export let arrChoice = <T>(arr: T[]): T =>
    arr[randInt(0, arr.length-1)];
export let range = (lo: number, hi: number): number[] => {
    let arr: number[] = [];
    for (let ii = lo; ii <= hi; ii++) { arr.push(ii); }
    return arr;
}
export let charToNum = (char: string): number =>
    char.charCodeAt(0);
export let numToChar = (n: number): string =>
    String.fromCharCode(n);

export let ALL_ASCII = range(0, 127).map(n => numToChar(n)).join('');
export let WHITESPACE = '\t\n\r';
export let PRINTABLE_ASCII = range(32, 126).map(n => numToChar(n)).join('');
export let NULL_BYTE = '\u0000';
export let EMOJIS = ['👩‍🎤', '🧑‍🎤', '👨‍🎤', '⛄️', '💜', '🍆'];

//================================================================================

export let mutateStringN = (s: string, chars: string | string[], n: number): string => {
    let s2 = s;
    let ii = 0;
    while (true) {
        s2 = mutateString(s2, chars);
        ii += 1;
        if (ii >= n && s2 !== s) { return s2; }
    }
}

export let mutateString = (s: string, chars: string | string[]): string => {
    // s will always be different
    while (true) {
        let s2 = s;
        let which = randInt(1, 4);
        if      (which === 1) { s2 = changeChar(s, chars); }
        else if (which === 2) { s2 = insertChar(s, chars); }
        else if (which === 3) { s2 = removeChar(s); }
        else if (which === 4) { s2 = swapChar(s); }
        if (s !== s2) {
            return s2;
        }
    }
}

//================================================================================

export let changeChar = (s: string, chars: string | string[]): string => {
    if (s.length === 0) { return s; }
    let ii = randInt(0, s.length-1);
    let arr = s.split('');
    arr[ii] = stringChoice(chars);
    return arr.join('');
}

export let insertChar = (s: string, chars: string | string[]): string => {
    if (s.length === 0) { return stringChoice(chars); }
    let ii = randInt(0, s.length);
    return s.slice(0, ii) + stringChoice(chars) + s.slice(ii);
}

export let removeChar = (s: string): string => {
    if (s.length === 0) { return s; }
    if (s.length === 1) { return ''; }
    let ii = randInt(1, s.length);
    return s.slice(0, ii-1) + s.slice(ii);
}

export let swapChar = (s: string): string => {
    // swap two randomly chosen characters
    if (s.length <= 1) { return s; }
    let ii = randInt(0, s.length - 2);
    let chars = s.split('');
    let a = chars[ii];
    let b = chars[ii + 1];
    chars[ii] = b;
    chars[ii + 1] = a;
    return chars.join('');
}

//================================================================================
// VALUE MAKERS

export let anything = (): any =>
    arrChoice([
        '',
        stringChoice(ALL_ASCII + EMOJIS),
        stringChoice(ALL_ASCII + EMOJIS) + stringChoice(ALL_ASCII + EMOJIS),
        randInt(-2, 2),
        randInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
        Math.random() * 10 - 5,
        Infinity,
        NaN,
        -Infinity,
        -0,
        undefined,
        null,
        [],
        {},
    ]);

export let anyString = (): any =>
    range(0, 5).map(n => stringChoice(ALL_ASCII + EMOJIS));

//================================================================================

interface MutateOpts {
    removeKey?: boolean,
    addKey?: boolean,
    replaceKey?: boolean,
    mutateKey?: boolean,
}
export let mutateObj = (obj: Record<string, any>, opts: MutateOpts = {}): Record<string, any> => {
    while (true) {
        let obj2 = {...obj};
        let which = randInt(1, 3);
        if      (which === 1 && opts.removeKey  !== false) { obj2 = removeKeyFromObj(obj2); }
        else if (which === 2 && opts.addKey     !== false) { obj2 = addRandomKeyToObj(obj2, anyString, anything); }
        else if (which === 3 && opts.replaceKey !== false) { obj2 = replaceObjKey(obj2, anything); }
        else if (which === 4 && opts.mutateKey  !== false) { obj2 = mutateObjKey(obj2); }
        if (!deepEqual(obj, obj2)) { return obj2; }
    }
}

export let replaceObjKey = (obj: Record<string, any>, maker: () => any): Record<string, any> => {
    let keys = Object.keys(obj);
    if (keys.length === 0) { return {}; }
    let key = arrChoice(keys);
    let obj2 = {...obj};
    obj2[key] = maker();
    return obj2;
}

export let mutateObjKey = (obj: Record<string, any>): Record<string, any> => {
    let keys = Object.keys(obj);
    if (keys.length === 0) { return {}; }
    let key = arrChoice(keys);
    let value = obj[key];
    let obj2 = {...obj};
    if (typeof value === 'number') {
        obj2[key] = value + Math.random() * 4 - 2;
    } else if (typeof value === 'string') {
        obj2[key] = mutateString(value, ALL_ASCII + EMOJIS);
    } else {
        obj2[key] = anything();
    }
    return obj2;
}

export let removeKeyFromObj = (obj: Record<string, any>): Record<string, any> => {
    let obj2 = {...obj};
    let keys = Object.keys(obj2);
    if (keys.length === 0) { return obj2; }
    delete obj2[stringChoice(keys)];
    return obj2;
}

export let addRandomStringKeyToObj = (obj: Record<string, any>, chars: string | string[]): Record<string, any> => {
    let obj2 = {...obj};
    obj2[stringChoice(chars)] = stringChoice(chars);
    return obj2;
}

export let addRandomKeyToObj = (obj: Record<string, any>, keyMaker: () => any, valueMaker: () => any): Record<string, any> => {
    let obj2 = {...obj};
    obj2[keyMaker()] = valueMaker();
    return obj2;
}

//================================================================================

/*
let obj = {sss: 'sss', n: 123, arr: []};
for (let ii = 0; ii < 10; ii++) {
    console.log(JSON.stringify(mutateObj(obj), null, 4));
}
*/
/*
for (let ii = 0; ii < 10; ii++) {
    console.log(JSON.stringify(mutateString('123', ALL_ASCII + EMOJIS)));
}
console.log();
for (let ii = 1; ii < 10; ii++) {
    console.log(JSON.stringify(mutateStringN('123', ALL_ASCII + EMOJIS, ii)));
}
*/



