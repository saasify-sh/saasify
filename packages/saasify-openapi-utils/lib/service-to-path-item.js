'use strict'

/**
 * Finds the OpenAPI PathItem that corresponds to a particular service.
 */
module.exports = (service, openapi) => {
  for (const path of Object.keys(openapi.paths)) {
    if (path === service.path) {
      return openapi.paths[path]
    }
  }
}
