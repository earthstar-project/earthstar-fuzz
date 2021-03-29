import * as fc from 'fast-check';
import fs from 'fs';
import {
    ValidationError,
    ValidatorEs4,
} from 'earthstar';

let writeSamples = (n: number, fn: string): any[] => {
    let samples = fc.sample(
        fc.anything(),
        n,
    )
    fs.writeFileSync(fn, JSON.stringify(samples, null, 4), 'utf-8');
    return samples
}

let n = 100000;
let fn = `samples-${Date.now()}.json`;
let samples: any[];

console.log(`writing ${n} samples to ${fn}...`);
samples = writeSamples(n, fn);
console.log('    ....done');

//console.log(`reading samples from ${fn}...`);
//samples = JSON.parse(fs.readFileSync(fn, 'utf-8'));
//console.log(`    ...got ${samples.length}`);

console.log('parsing as author addresses...');
for (let sample of samples) {
    let err = ValidatorEs4.parseAuthorAddress(sample as any);
    if (! (err instanceof ValidationError)) {
        console.warn('WARNING: should have been a validation error but was not:');
        console.warn(JSON.stringify(sample));
    }
}
console.log('    ....done');
