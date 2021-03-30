import {
    AuthorKeypair,
    decodeAuthorKeypair,
    decodeBase32ToBuffer,
    sign,
    ValidationError,
    verify,
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
    mutateObj,
} from '../mutate';

jest.setTimeout(12000)
let iters = 2000;

let goodKeypair: AuthorKeypair = {
    address: "@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a",
    secret: "bwgwycyh4gytyw4p2cp55t53wqhbxb7kqnj4assaazroviffuqn7a"
};

test('decodeAuthorKeypair: on anything', () => {
    for (let ii = 0; ii < iters; ii++) {
        let badKeypair = anything();
        let err = decodeAuthorKeypair(badKeypair as any);
        if (err instanceof ValidationError) {
            // good
        } else {
            console.log(badKeypair, err);
            expect(err instanceof ValidationError).toBeTruthy();
        }
    }
});

test('decodeAuthorKeypair: on mutated good keypair', () => {
    for (let ii = 0; ii < iters; ii++) {
        let badKeypair = mutateObj(goodKeypair, {addKey: false});
        let err = decodeAuthorKeypair(badKeypair as any);
        if (err instanceof ValidationError) {
            // good
        } else {
            console.log(badKeypair, err);
            expect(err instanceof ValidationError).toBeTruthy();
        }
    }
});