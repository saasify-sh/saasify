'use strict'

const fs = require('fs-extra')
const globby = require('globby')
const path = require('path')
const test = require('ava')

const convertSaasifyToOpenAPI = require('saasify-to-openapi')
const annotateOpenAPI = require('./annotate-openapi')
const openapiHeaderBlacklist = require('./openapi-header-blacklist')
const isHttpMethod = require('./is-http-method')

const fixtures = globby.sync('./fixtures/deployments/*.json')

for (const fixture of fixtures) {
  const { name } = path.parse(fixture)

  test(`annotateOpenAPI ${name}`, async (t) => {
    const deployment = await fs.readJson(fixture)
    const spec = await convertSaasifyToOpenAPI(deployment)
    t.truthy(spec)
    const fullSpec = await annotateOpenAPI(spec, deployment)
    t.truthy(fullSpec)

    // TODO: temporary
    delete fullSpec.info.description
    console.log(JSON.stringify(fullSpec, null, 2))

    t.snapshot(fullSpec)

    for (const path of Object.keys(fullSpec.paths)) {
      const pathItem = fullSpec.paths[path]
      const httpMethods = Object.keys(pathItem).filter(isHttpMethod)

      for (const httpMethod of httpMethods) {
        const op = pathItem[httpMethod]

        if (op.parameters) {
          for (const param of op.parameters) {
            if (param.in === 'header') {
              t.false(openapiHeaderBlacklist.has(param.name))
            }
          }
        }
      }
    }
  })
}
