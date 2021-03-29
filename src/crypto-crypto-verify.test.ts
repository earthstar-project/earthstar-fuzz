import * as fc from 'fast-check';
import {
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

test('verify should always return false on garbage inputs (msg as string)', () => {
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

test('verify should always return false on garbage inputs (msg as Buffer)', () => {
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
