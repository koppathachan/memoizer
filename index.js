import esprima from 'esprima';
import escodegen from 'escodegen';

const isExpression = exp => exp && exp.expression && exp.expression.type === 'ArrowFunctionExpression';
const isFunction = fn => fn && fn.type === 'FunctionDeclaration';
const parseFunc = exp => esprima.parseScript(exp).body[0];
const parseExpParams = ({ expression: { params } }) => params.map(p => p.name).join();
const parseExpBody = ({ expression: { body, expression } }) => (expression && gen(body)) || genFn(body);
const parseFnParams = ({ params }) => params.map(p => p.name).join();
const parseFnBody = ({ body }) => genFn(body);
const gen = code => escodegen.generate(code);
const genFn = code => `(() => ${gen(code)})()`;

const memoizedFn = (name, args, body) => `
return function ${name} (${args}) {
  let result = cache[JSON.stringify([${args}])]
  if (result) { return result; }
  result = ${body}
  cache[JSON.stringify([${args}])] = result;
  return result;
}
`;

// TODO: typescript
export const memoize = (func, cache = Object.create(null)) => {
  const parsedFunc = parseFunc(func.toString());
  if(isExpression(parsedFunc)) {
    return new Function('cache',
			memoizedFn(func.name, parseExpParams(parsedFunc), parseExpBody(parsedFunc)))(cache);
  }
  if(isFunction(parsedFunc)) {
    return new Function('cache',
			memoizedFn(func.name, parseFnParams(parsedFunc), parseFnBody(parsedFunc)))(cache);
  }

  throw new Error('Error adding memoization unsupported format.');
};
