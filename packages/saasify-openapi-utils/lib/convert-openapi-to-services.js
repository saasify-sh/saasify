'use strict'

const slugify = require('@sindresorhus/slugify')

const httpMethodWhitelist = new Set([
  'get',
  'head',
  'post',
  'put',
  'delete',
  'patch'
])

/**
 * Converts an OpenAPI spec to Saasify's `Service` format.
 *
 * @param {object} openapi - OpenAPI spec.
 * @param {object} config - Parsed Saasify project configuration.
 *
 * @return {Promise}
 */
module.exports = async (openapi, config) => {
  const origServices = config.services.slice()
  const services = []

  const firstService = origServices[0]
  let defaultService = false

  for (const path of Object.keys(openapi.paths)) {
    const pathItem = openapi.paths[path]
    const ops = Object.values(pathItem)
    let name = ops.map((op) => op.summary).filter(Boolean)[0]

    if (!name) {
      name = path.slice(1)

      if (!name) {
        name = 'Default'
      } else if (name.includes('/')) {
        name = slugify(name)
      }
    }

    let index = origServices.findIndex((s) => s.path === path)
    let origService

    if (
      index < 0 &&
      origServices.length === 1 &&
      origServices[0].path === undefined
    ) {
      if (defaultService) {
        throw new Error(
          'Error resolving OpenAPI spec to services: include "path" in services to disambiguate'
        )
      }

      index = 0
      defaultService = true
    }

    if (index >= 0) {
      origService = origServices[index]
      origServices.splice(index, 1)
    }

    const service = {
      name,
      path,
      src: firstService ? firstService.src : undefined,
      ...origService
    }

    service.GET = false
    service.HEAD = false
    service.POST = false
    service.PUT = false
    service.DELETE = false
    service.PATCH = false

    const httpMethods = Object.keys(pathItem)
    for (const httpMethod of httpMethods) {
      if (httpMethodWhitelist.has(httpMethod)) {
        service[httpMethod.toUpperCase()] = true
      }
    }

    services.push(service)
  }

  // if there are any origServices that were not matched, throw an error
  if (origServices.length > 0) {
    const extra = origServices[0]
    const extraLabel = extra.name || extra.path

    throw new Error(
      `Error mapping OpenAPI spec to services: found extra unmatched service "${extraLabel}"}`
    )
  }

  return services
}
