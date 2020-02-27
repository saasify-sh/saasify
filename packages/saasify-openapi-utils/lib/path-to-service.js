'use strict'

/**
 * Finds the service that corresponds with a particular relative URL path.
 *
 * TODO: this should require an HTTP method as well for proper resolving.
 */
module.exports = (path, deployment) => {
  for (const service of deployment.services) {
    if (path === service.path) {
      return service
    }
  }
}
