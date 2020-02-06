'use strict'

const { parseFaasIdentifier } = require('saasify-faas-utils')

/**
 * Finds the service that corresponds with a particular relative URL path.
 */
module.exports = (path, deployment) => {
  if (path.includes('@')) {
    const parsedPath = parseFaasIdentifier(path)
    if (parsedPath) {
      path = parsedPath.servicePath
    }
  }

  for (const service of deployment.services) {
    if (path === service.path) {
      return service
    }
  }
}
