'use strict'

const validators = require('./validators')

module.exports = async (api, source) => {
  const services = []

  for (const path of Object.keys(api.paths)) {
    const pathItem = api.paths[path]
    const name = path.slice(1)

    const service = {
      ...source,
      name,
      path
    }

    const httpMethods = Object.keys(pathItem)
    for (const httpMethod of httpMethods) {
      service[httpMethod.toUpperCase()] = true
    }

    services.push(service)
  }

  return services
}
