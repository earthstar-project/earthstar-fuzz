import * as fc from 'fast-check';
import {
    b32chars,
    decodeBase32ToBuffer,
    encodeBufferToBase32
} from 'earthstar';

jest.setTimeout(12000)
fc.configureGlobal({
    verbose: true,
    numRuns: 500,
    interruptAfterTimeLimit: 11000,
    markInterruptAsFailure: true,
});

test('base32 encoding/decoding starting from a buffer', () => {
    fc.assert(
        fc.property(
            // https://github.com/dubzzz/fast-check/blob/main/documentation/Arbitraries.md
            fc.uint8Array({minLength: 0, maxLength: 20}),
            (uintArray) => {
                let buffer = Buffer.from(uintArray);
                let str = encodeBufferToBase32(buffer);

                expect(str.length).toBeGreaterThanOrEqual(1);
                expect(str[0]).toStrictEqual('b');
                expect(str.toLowerCase()).toStrictEqual(str);

                let buffer2 = decodeBase32ToBuffer(str);
                expect(buffer).toStrictEqual(buffer2);

                let str2 = encodeBufferToBase32(buffer2);
                expect(str).toStrictEqual(str2);

                //console.log(str, buffer);
            }
        ), {
            // https://github.com/dubzzz/fast-check/blob/main/documentation/Runners.md
            examples: [
                [new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1])],
            ],
        }
    );
});

test('base32 encoding/decoding starting from a string', () => {
    fc.assert(
        fc.property(
            // https://github.com/dubzzz/fast-check/blob/main/documentation/Arbitraries.md
            fc.stringOf(fc.constantFrom(...b32chars), { minLength: 0, maxLength: 10} ),
            (strNoB) => {
                let str = 'b' + strNoB;
                try {
                    let buffer = decodeBase32ToBuffer(str);
                    let str2 = encodeBufferToBase32(buffer);
                    let buffer2 = decodeBase32ToBuffer(str2);
                    //console.log(str, buffer);
                    expect(str).toStrictEqual(str2);
                    expect(buffer).toStrictEqual(buffer2);
                } catch (err) {
                    if (err instanceof SyntaxError) {
                        // ok
                        //console.log(str, 'could not be decoded, which is ok');
                    } else {
                        console.log(str, 'threw an unexpected error');
                        throw err;
                    }
                }
            }
        ), {
        }
    );
});