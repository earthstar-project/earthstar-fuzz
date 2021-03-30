import {
    AuthorKeypair,
    ValidationError,
    checkAuthorKeypairIsValid,
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
let iters = 500;

test('checkAuthorKeypairIsValid: on anything should return ValidationError', () => {
    for (let ii = 0; ii < iters; ii++) {
        let badKeypair = anything();
        let err = checkAuthorKeypairIsValid(badKeypair as any);
        if (err instanceof ValidationError) {
            // good
        } else {
            console.log('cccakiv-373219', badKeypair, err);
            expect((err as any) instanceof ValidationError).toBeTruthy();
        }
    }
});

let goodKeypair: AuthorKeypair = {
    address: "@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a",
    secret: "bwgwycyh4gytyw4p2cp55t53wqhbxb7kqnj4assaazroviffuqn7a"
};

test('checkAuthorKeypairIsValid: with mutated good keypair should return ValidationError', () => {
    let examples = [{
        address: '@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a',
        secret: 'b'
    }];

    for (let ii = 0; ii < iters; ii++) {
        let badKeypair: any = null;
        if (ii < examples.length) {
            badKeypair = examples[ii];
        } else {
            badKeypair = mutateObj(goodKeypair, {addKey: false});
        }
        let err = checkAuthorKeypairIsValid(badKeypair as any);
        if (err instanceof ValidationError) {
            // good
        } else {
            console.log('cccakiv-0187342', badKeypair, err);
            expect((err as any) instanceof ValidationError).toBeTruthy();
        }
    }
});
