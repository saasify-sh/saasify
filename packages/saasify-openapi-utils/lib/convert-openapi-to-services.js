'use strict'

const slugify = require('@sindresorhus/slugify')

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

  // TODO: clean up this hacky service resolution stuffs
  const isSingleService = origServices.length === 1
  const firstService = origServices[0]
  let origService = firstService

  // TODO: convert openapi path to service path syntax so we can use
  // https://github.com/pillarjs/path-to-regexp for routing

  for (const path of Object.keys(openapi.paths)) {
    const pathItem = openapi.paths[path]
    let name = path.slice(1)

    if (name.includes('/')) {
      name = slugify(name)
    }

    if (!isSingleService) {
      let index = origServices.findIndex((s) => s.path === path)

      if (
        index < 0 &&
        origServices.length === 1 &&
        origServices[0].path === undefined
      ) {
        index = 0
      }

      if (index >= 0) {
        origService = origServices.splice(index, 1)[0]
      } else {
        origService = null
      }
    }

    const service = {
      name,
      path,
      src: firstService.src,
      ...origService
    }

    service.GET = false
    service.POST = false

    const httpMethods = Object.keys(pathItem)
    for (const httpMethod of httpMethods) {
      service[httpMethod.toUpperCase()] = true
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
