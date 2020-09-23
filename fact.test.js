import { memoize } from './index.js';
import { strict as assert } from 'assert';

const fact = n => n && (BigInt(n) * fact(n - 1)) || BigInt(1);

const factWr = n => {
  let answer = 1;
  if (n > 1) {
    for (let i = n; i >= 1; i--) {
      answer = answer * i;
    }
  }
  return answer;
};
const factMemo = memoize(fact);

const timer = start => process.hrtime.bigint() - BigInt(start || 0);
const time = func => {
  const start = timer();
  func();
  return timer(start);
};

const timeRecursion = time(_ => fact(1000));
const timeWr = time(_ => factWr(1000));
const times = timeRecursion / timeWr;

console.log(`Recursive factorial is ${times} times slower than non recursive fibonacci.`);

const timeMemoized = time(_ => factMemo(1000));
const memoTimes = timeMemoized / timeWr;

console.log(`Memoized factorial is ${memoTimes} times slower than non recursive fibonacci.`);

const timeMemoized2 = time(_ => factMemo(1000));
const memoTimes2 = timeWr / timeMemoized2;
console.log(`When run again.`);
console.log(`Memoized factorial is ${memoTimes2} times faster than non recursive fibonacci.`);

console.log('Without recursion                     : ', timeWr);
console.log('With recursion                        : ', timeRecursion);
console.log('With memoized recursion               : ', timeMemoized);
console.log('With memoized recursion another time. : ', timeMemoized2);

try {
  // fibonacci of 40 is 102334155
  //assert.equal(factMemo(40), BigInt(815915283247897734345611269596115894272000000000));
  //assert.equal(fact(40), BigInt(815915283247897734345611269596115894272000000000));
} catch (ex) {
  console.error(ex);
}
