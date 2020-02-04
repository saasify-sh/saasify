'use strict'

/**
 * Finds the service that corresponds with a particular relative URL path.
 */
module.exports = (path, deployment) => {
  for (const service of deployment.services) {
    if (path === service.path) {
      return service
    }
  }
}
