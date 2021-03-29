import * as fc from 'fast-check';
import {
    AuthorKeypair,
    ValidationError,
    checkAuthorKeypairIsValid,
} from 'earthstar';

jest.setTimeout(12000)
fc.configureGlobal({
    verbose: true,
    numRuns: 100,
    interruptAfterTimeLimit: 11000,
    markInterruptAsFailure: true,
});

test('checkAuthorKeypairIsValid: with garbage object should return ValidationError', () => {
    fc.assert(
        fc.property(
            fc.oneof(
                fc.dictionary(fc.string(), fc.string()),
                fc.unicodeJsonObject(),
            ),
            (obj) => {
                let err = checkAuthorKeypairIsValid(obj as any);
                expect(err instanceof ValidationError).toBeTruthy();
            }
        )
    );
});

let goodKeypair: AuthorKeypair = {
    address: "@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a",
    secret: "bwgwycyh4gytyw4p2cp55t53wqhbxb7kqnj4assaazroviffuqn7a"
};

test('checkAuthorKeypairIsValid: with garbage records should return ValidationError', () => {
    fc.assert(
        fc.property(
            fc.record({
                address: fc.fullUnicodeString(),
                secret: fc.fullUnicodeString(),
            }, { requiredKeys: [] }),
            (obj) => {
                let err = checkAuthorKeypairIsValid(obj as any);
                expect(err instanceof ValidationError).toBeTruthy();
            }
        ), {
            examples: [
                [{
                    // no @
                    "address": "suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a",
                    "secret": "bwgwycyh4gytyw4p2cp55t53wqhbxb7kqnj4assaazroviffuqn7a"
                }],
                [{
                    // no .
                    "address": "@suzyb724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a",
                    "secret": "bwgwycyh4gytyw4p2cp55t53wqhbxb7kqnj4assaazroviffuqn7a"
                }],
                [{
                    // no b
                    "address": "@suzy.724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a",
                    "secret": "bwgwycyh4gytyw4p2cp55t53wqhbxb7kqnj4assaazroviffuqn7a"
                }],
                [{
                    // removed last char of address
                    "address": "@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362",
                    "secret": "bwgwycyh4gytyw4p2cp55t53wqhbxb7kqnj4assaazroviffuqn7a"
                }],
                [{
                    "address": "@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a",
                    // removed last char of secret
                    "secret": "bwgwycyh4gytyw4p2cp55t53wqhbxb7kqnj4assaazroviffuqn7"
                }],
                [{
                    "address": "@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a",
                    // no b
                    "secret": "wgwycyh4gytyw4p2cp55t53wqhbxb7kqnj4assaazroviffuqn7a"
                }],
            ],
        }
    );
});

