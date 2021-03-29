import * as fc from 'fast-check';
import {
    AuthorKeypair,
    decodeAuthorKeypair,
    decodeBase32ToBuffer,
    sign,
    ValidationError,
    verify,
} from 'earthstar';

jest.setTimeout(12000)
fc.configureGlobal({
    verbose: true,
    numRuns: 100,
    interruptAfterTimeLimit: 11000,
    markInterruptAsFailure: true,
});

let goodKeypair: AuthorKeypair = {
    address: "@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a",
    secret: "bwgwycyh4gytyw4p2cp55t53wqhbxb7kqnj4assaazroviffuqn7a"
};

test('decodeAuthorKeypair: on malformed keypair', () => {
    fc.assert(
        fc.property(
            fc.record({
                address: fc.fullUnicodeString(),
                secret: fc.fullUnicodeString(),
            }, { requiredKeys: [] }),
            (badKeypair) => {
                let err = decodeAuthorKeypair(badKeypair as any);
                if (err instanceof ValidationError) {
                    // good
                } else {
                    throw new Error('should have thrown a ValidationError');
                }
            }
        ), {
            examples: [
                // TODO: test ValidatorEs4.parseAuthorAddress which is the source of the crash
                [{}],
            ],
        }
    );
});
