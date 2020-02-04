'use strict'

const pathParamRe = /{([a-zA-Z_]\w*)}/g

/**
 * Converts an OpenAPI-style path to an Express-style path.
 *
 * OpenAPI-style paths use `{pathParam}` syntax to denote path params, whereas
 * Express-style paths use `:pathParam` syntax.
 *
 * @param {string} path
 *
 * @return {string}
 */
module.exports = (path) => {
  return path.replace(pathParamRe, ':$1')
}
