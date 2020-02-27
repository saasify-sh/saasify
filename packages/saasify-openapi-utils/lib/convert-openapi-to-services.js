'use strict'

const cloneDeep = require('clone-deep')
const parser = require('swagger-parser')
const slugify = require('@sindresorhus/slugify')

const getExamplesFromPathItem = require('./get-examples-from-path-item')

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
 * @param {object} spec - OpenAPI spec.
 * @param {object} config - Parsed Saasify project configuration.
 *
 * @return {Promise}
 */
module.exports = async (spec, config) => {
  const openapi = await parser.dereference(cloneDeep(spec))
  const origServices = config.services.slice()
  const services = []

  const firstService = origServices[0]
  let defaultService = false

  for (const path of Object.keys(openapi.paths)) {
    const pathItem = openapi.paths[path]

    const httpMethods = Object.keys(pathItem)

    for (const httpMethod of httpMethods) {
      if (!httpMethodWhitelist.has(httpMethod)) {
        continue
      }

      const op = pathItem[httpMethod]
      let name = op.operationId

      if (!name) {
        name = path.slice(1)

        if (!name) {
          name = 'Default'
        } else if (name.includes('/')) {
          name = slugify(name)
        }
      }

      let index = origServices.findIndex(
        (s) =>
          s.path === path &&
          (httpMethods.length === 1 || s[httpMethod.toUpperCase()])
      )
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

      service[httpMethod.toUpperCase()] = true

      // extract any examples from the OpenAPI PathItem for this service
      // TODO: restrict this only to an operation
      const examples = await getExamplesFromPathItem(pathItem)
      service.examples = (service.examples || []).concat(examples)

      services.push(service)
    }
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
