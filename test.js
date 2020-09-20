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
    return fib1(n - 1) + fib2(n - 2);
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
const perCentage = (timeRecursion - timeWr) * BigInt(100) / timeRecursion;
console.log(`Recursive fibonacci is ${perCentage}% slower than non recursive fibonacci.`);

const timeMemoized = time(_ => fibMemo(40));
const percentMemo = (timeMemoized - timeWr) * BigInt(100) / timeMemoized;
console.log(`Memoized fibonacci is only ${percentMemo}% slower than non recursive fibonacci.`);

console.log('Without recursion       : ', timeWr);
console.log('With recursion          : ', timeRecursion);
console.log('With memoized recursion : ', timeMemoized);

try {
  // fibonacci of 40 is 102334155
  assert.equal(fibMemo(40), 102334155);
  assert.equal(memoize(fib1)(40), 102334155);
  assert.equal(memoize(fib2)(40), 102334155);
} catch (ex) {
  console.error(ex);
}
