import {
    AuthorKeypair,
    ValidationError,
    ValidatorEs4,
} from 'earthstar';
import {
    ALL_ASCII,
    EMOJIS,
    anyString,
    anything,
    insertChar,
    mutateStringN,
    randInt,
    removeChar,
} from '../mutate';

jest.setTimeout(12000)
let iters = 1000;

let goodKeypair: AuthorKeypair = {
    address: "@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a",
    secret: "bwgwycyh4gytyw4p2cp55t53wqhbxb7kqnj4assaazroviffuqn7a"
};

test('parseAuthorAddress: on mutated good address', () => {
    for (let ii = 0; ii < iters; ii++) {
        let which = randInt(1, 2);
        let badAddress = goodKeypair.address;
        if (which === 1) { badAddress = removeChar(badAddress); }
        else if (which === 2) { badAddress = insertChar(badAddress, ALL_ASCII + EMOJIS); }

        let err = ValidatorEs4.parseAuthorAddress(badAddress);
        if (err instanceof ValidationError) {
            // good
        } else {
            console.log(badAddress, err);
            expect(err instanceof ValidationError).toBeTruthy();
        }
    }
});

test('parseAuthorAddress: on anything', () => {
    for (let ii = 0; ii < iters; ii++) {
        let badAddress = anything();
        let err = ValidatorEs4.parseAuthorAddress(badAddress as string);
        if (err instanceof ValidationError) {
            // good
        } else {
            console.log(JSON.stringify(badAddress), err);
            expect(err instanceof ValidationError).toBeTruthy();
        }
    }
});