import { memoize } from './index';
import { strict as assert } from 'assert';

const fib = (n: number): number => n > 1 ? fib(n - 1) + fib(n - 2) : n;

try {
    const fibMemo = memoize(fib);
    assert.equal(fibMemo(40), 102334155)
} catch (ex) {
    console.error(ex);
}
