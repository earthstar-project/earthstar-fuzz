import * as fc from 'fast-check';
import {
    AuthorKeypair,
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

test('verify: should always return false on garbage inputs (msg as string)', () => {
    fc.assert(
        fc.property(
            fc.fullUnicodeString(),
            fc.fullUnicodeString(),
            fc.fullUnicodeString(),
            (address, sig, msg) => {
                let isValid = verify(address, sig, msg);
                expect(isValid).toStrictEqual(false);
            }
        ), {
            examples: [
                ["@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a", "xxxxx", "yyyyy"],
            ],
        }
    );
});

test('verify: should always return false on garbage inputs (msg as Buffer)', () => {
    fc.assert(
        fc.property(
            fc.fullUnicodeString(),
            fc.fullUnicodeString(),
            fc.uint8Array({minLength: 0, maxLength: 20}),
            (address, sig, msgUint) => {
                let msgBuffer = Buffer.from(msgUint);
                let isValid = verify(address, sig, msgBuffer);
                expect(isValid).toStrictEqual(false);
            }
        ), {
            examples: [
                ["@suzy.b724w6da6euw2ip7szpxopq2uodagdyswovh4pqd6ptnanz2u362a", "xxxxx", Buffer.from([0, 1, 2])],
            ],
        }
    );
});
