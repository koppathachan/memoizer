# memoizer

I was looking for a memoizer that can cache the values of a recursive
fibonacci series while it is executing.

I found that specific solutions exists by passing a cache object to
the recursive function and using it in the immplementation but nothing
generic exists. This is my attempt at writing one.

## Usage:

```js
// the fibonacci series using recursion.
const fib = (n) => n > 1 ? fib(n - 1) + fib(n - 2) : n;
const fibMemo = memoize(fib);
fibMemo(40); // run the test file to see benchmarks
```

## To get benchmarks and a more than trivial test, run :
```js
npm test
```
