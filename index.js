const removeStartingPara = args => args.startsWith('(') && args.slice(1) || args;
const removeEndingPara = args => args.endsWith(')') && args.slice(0, -1) || args;
const sanitizeArgs = args => removeStartingPara(removeEndingPara(args.trim()));

// TODO: handle non arrow functions.
export const memoize = (func) => {
  // cache is local.
  const cache = Object.create(null);
  // splits based on '=>'
  const [argsWithBrackets, ...bodyParts] = func.toString().split('=>');
  const args = sanitizeArgs(argsWithBrackets);
  const body = bodyParts.join('=>');
  return new Function('cache',
`
return function ${func.name} (${args}) {
  let result = cache[n]
  if (result) { return result; }
  result = ${body}
  cache[n] = result;
  return result;
}
`)(cache);
};
