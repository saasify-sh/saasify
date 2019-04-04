/**
 * Example ES6 JavaScript function commented with jsdoc.
 *
 * @param {string} foo Description of foo
 * @param {number} [bar=5] Description of bar
 *
 * @returns {string}
 */
export default async function example(foo, bar) {
  return JSON.stringify({ foo, bar }, null, 2)
}
