'use strict'

const pick = require('lodash.pick')

module.exports = function pruneDeployment(deployment, verbose) {
  if (!verbose) {
    deployment = pick(deployment, [
      'id',
      'project',
      'user',
      'url',
      'saasUrl',
      'openApiUrl',
      'description',
      'version',
      'createdAt',
      'updatedAt',
      'enabled',
      'published',
      'services'
    ])

    deployment.services = deployment.services.map((service) =>
      pruneService(service, verbose)
    )
  }

  return deployment
}

function pruneService(service, verbose) {
  if (verbose) {
    return service
  } else {
    return pick(service, [
      'name',
      'path',
      'httpMethod',
      'url',
      'route',
      'adaptor',
      'immutable',
      'src'
    ])
  }
}
