const esprima = require('esprima');
const escodegen = require('escodegen');

const isExpression = exp => exp && exp.expression && exp.expression.type === 'ArrowFunctionExpression';
const isFunction = fn => fn && fn.type === 'FunctionDeclaration';
const parseFunc = (exp, fname) => {
  try {
    return esprima.parseScript(exp).body[0];
  } catch (ex) {
    if (exp.startsWith('function')) {
      const pos = exp.indexOf('(') - 1;
      const newFunc = `${exp.slice(0, pos)} ${fname}${exp.slice(pos)}`;
      return esprima.parseScript(newFunc).body[0];
    }
    throw ex;
  }
};
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

exports.memoize = (func, cache = Object.create(null)) => {
  const parsedFunc = parseFunc(func.toString(), func.name);
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
