import * as fc from 'fast-check';
import {
    AuthorKeypair,
    ValidationError,
    decodeBase32ToBuffer,
    sign,
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

test('sign(): good keypair, any unicode msg', () => {
    fc.assert(
        fc.property(
            fc.fullUnicodeString(),
            (msg) => {
                let b32string = sign(goodKeypair, msg);
                if (b32string instanceof ValidationError) {
                    throw b32string;
                }
                expect(typeof b32string).toBe('string');
                expect(b32string.length).toStrictEqual(104);

                // make sure the b32 is valid
                let buffer = decodeBase32ToBuffer(b32string as string);
                expect(buffer.length).toStrictEqual(64);
            }
        )
    );
});

test('sign: bad keypair missing some properties, any unicode msg', () => {
    fc.assert(
        fc.property(
            fc.record({
                address: fc.fullUnicodeString(),
                secret: fc.fullUnicodeString(),
            }, { requiredKeys: [] }),
            fc.fullUnicodeString(),
            (badKeypair, msg) => {
                let b32string = sign(badKeypair as any, msg);
                if (b32string instanceof ValidationError) {
                    // good
                } else {
                    throw new Error('expected a ValidationError');
                }
            }
        ), {
            examples: [
                [ {}, 'hello' ],
            ],
        }
    );
});

test('verify: should always return false on garbage inputs (msg as string or buffer)', () => {
    fc.assert(
        fc.property(
            fc.fullUnicodeString(),
            fc.fullUnicodeString(),
            fc.oneof(
                fc.fullUnicodeString(),
                fc.uint8Array({minLength: 0, maxLength: 20}),
            ),
            (address, sig, msgStrOrBuf: any) => {
                if (typeof msgStrOrBuf !== 'string') {
                    // if it's a Uint8Array, convert it to a Buffer
                    // if it's a string, leave it alone
                    msgStrOrBuf = Buffer.from(msgStrOrBuf);
                }
                let isValid = verify(address, sig, msgStrOrBuf);
                expect(isValid).toStrictEqual(false);
            }
        ), {
            examples: [
                ["@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a", "xxxxx", "yyyyy"],
                ["@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a", "xxxxx", Buffer.from([1,2,3])],
            ],
        }
    );
});
