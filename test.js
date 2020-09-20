import { memoize } from './index.js';
import { strict as assert }  from 'assert';


// the fibonacci series using recursion.
const fib = (n) => n > 1 ? fib(n - 1) + fib(n - 2) : n;

// different syntax because I am literally rewriting the code.
const fib1 = n => n > 1 ? fib1(n - 1) + fib1(n - 2) : n;

const fib2 = (n) => {
  if (n > 1) { return fib2(n - 1) + fib2(n - 2); }
  else { return n; }
};

// this syntax is not handled
function fib3 (n) {
  if (n > 1) {
    return fib3(n - 1) + fib3(n - 2);
  } else {
    return n;
  }
}

// the fibonacci series without recursion.
const fibWr = (n) => {
    let a = 0, b = 1, c, i;
    if (n == 0) return a;
    for (i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }
    return b;
};

const fibMemo = memoize(fib);

const timer = start => process.hrtime.bigint() - BigInt(start || 0);

const time = func => {
  const start = timer();
  func();
  return timer(start);
};


const timeWr = time(_ => fibWr(40));
const timeRecursion = time(_ => fib(40));
const times = timeRecursion / timeWr;
console.log(`Recursive fibonacci is ${times} times slower than non recursive fibonacci.`);

const timeMemoized = time(_ => fibMemo(40));
const percentMemo = (timeMemoized - timeWr) * BigInt(100) / timeMemoized;
const memoTimes = timeMemoized / timeWr;
console.log(`Memoized fibonacci is only ${memoTimes} times slower than non recursive fibonacci.`);

const timeMemoized2 = time(_ => fibMemo(40));
const percentMemo2 = (timeWr - timeMemoized2) * BigInt(100) / timeWr;
const memoTimes2 = timeWr / timeMemoized2;
console.log(`When run again.`);
console.log(`Memoized fibonacci is ${percentMemo2} times faster than non recursive fibonacci.`);

console.log('Without recursion                     : ', timeWr);
console.log('With recursion                        : ', timeRecursion);
console.log('With memoized recursion               : ', timeMemoized);
console.log('With memoized recursion another time. : ', timeMemoized2);

try {
  // fibonacci of 40 is 102334155
  assert.equal(fibMemo(40), 102334155);
  assert.equal(memoize(fib1)(40), 102334155);
  assert.equal(memoize(fib2)(40), 102334155);
} catch (ex) {
  console.error(ex);
}
