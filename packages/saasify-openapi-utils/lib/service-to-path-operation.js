'use strict'

/**
 * Finds the OpenAPI PathOperation that corresponds to a particular service.
 */
module.exports = (service, openapi) => {
  const pathItem = openapi.paths[service.path]
  if (pathItem) {
    return pathItem[service.httpMethod]
  }
}
