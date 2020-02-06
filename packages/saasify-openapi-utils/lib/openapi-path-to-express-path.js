'use strict'

const url = require('url')

const pathParamRe = /{([a-zA-Z_]\w*)}/g

/**
 * Converts an OpenAPI-style path to an express-style path.
 *
 * OpenAPI-style paths use `{pathParam}` syntax to denote path params, whereas
 * express-style paths use `:pathParam` syntax.
 *
 * OpenAPI also allows full query params in the path, whereas for express-style
 * route matching, we'd like to focus only on the URL's pathname.
 *
 * @param {string} path
 *
 * @return {string}
 */
module.exports = (path) => {
  const pathExpress = path.replace(pathParamRe, ':$1')

  // eslint-disable-next-line
  return url.parse(pathExpress).pathname
}
