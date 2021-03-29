import * as fc from 'fast-check';
import {
    AuthorKeypair,
    ValidationError,
    ValidatorEs4,
} from 'earthstar';

jest.setTimeout(12000)
fc.configureGlobal({
    verbose: true,
    numRuns: 1000,
    interruptAfterTimeLimit: 11000,
    markInterruptAsFailure: true,
});

let goodKeypair: AuthorKeypair = {
    address: "@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a",
    secret: "bwgwycyh4gytyw4p2cp55t53wqhbxb7kqnj4assaazroviffuqn7a"
};

// TODO: this sometimes triggers a warning on stderr:
//   node(3292,0x7fff9f21e380) malloc: *** error for object 0x102f19010: pointer being freed was not allocated
//   *** set a breakpoint in malloc_error_break to debug
test('parseAuthorAddress: on garbage anything', () => {
    fc.assert(
        fc.property(
            fc.anything(),//{ maxDepth: 0 }),
            (badAddress) => {
                let err = ValidatorEs4.parseAuthorAddress(badAddress as any);
                expect(err instanceof ValidationError).toBeTruthy();
            }
        ), {
            numRuns: 50000,
        }
    );
});

test('parseAuthorAddress: on garbage unicode or ascii', () => {
    fc.assert(
        fc.property(
            fc.oneof(fc.fullUnicodeString(), fc.asciiString()),
            (badAddress) => {
                let err = ValidatorEs4.parseAuthorAddress(badAddress as any);
                expect(err instanceof ValidationError).toBeTruthy();
            }
        )
    );
});

test('parseAuthorAddress: on ablated real address', () => {
    fc.assert(
        fc.property(
            // ordered subset of characters from a known good example
            // (e.g. randomly delete 1 or more characters)
            fc.subarray(goodKeypair.address.split(''), { maxLength: goodKeypair.address.length-1 })
                .map(arr => arr.join('')),
            (badAddress) => {
                let err = ValidatorEs4.parseAuthorAddress(badAddress as any);
                expect(err instanceof ValidationError).toBeTruthy();
            }
        ), {
            numRuns: 1000,
        }
    );
});
