/**
 * Multiplies a value by 2. (Also a full example of Typedoc's functionality.)
 *
 * ### Example (es module)
 * ```js
 * import { double } from 'typescript-starter'
 * console.log(double(4))
 * // => 8
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var double = require('typescript-starter').double;
 * console.log(double(4))
 * // => 8
 * ```
 *
 * @param value   Comment describing the `value` parameter.
 * @returns       Comment describing the return type.
 * @anotherNote   Some other value.
 */
export function double(value: number): number {
  return value * 2
}
