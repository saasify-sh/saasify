'use strict'

module.exports = async (api, config) => {
  const origServices = config.services.slice()
  const services = []

  for (const path of Object.keys(api.paths)) {
    const pathItem = api.paths[path]
    const name = path.slice(1)

    let index = origServices.findIndex((s) => s.path === path)
    if (
      index < 0 &&
      origServices.length === 1 &&
      origServices[0].path === undefined
    ) {
      index = 0
    }

    const origService =
      origService >= 0 ? origServices.splice(index, 1)[0] : undefined

    const service = {
      name,
      path,
      ...origService
    }

    const httpMethods = Object.keys(pathItem)
    for (const httpMethod of httpMethods) {
      service[httpMethod.toUpperCase()] = true
    }

    services.push(service)
  }

  return services
}
