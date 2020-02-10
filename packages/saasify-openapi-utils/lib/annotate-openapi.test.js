'use strict'

const fs = require('fs-extra')
const globby = require('globby')
const path = require('path')
const test = require('ava')

const convertSaasifyToOpenAPI = require('saasify-to-openapi')
const annotateOpenAPI = require('./annotate-openapi')

const fixtures = globby.sync('./fixtures/deployments/*.json')

for (const fixture of fixtures) {
  const { name } = path.parse(fixture)

  test(`annotateOpenAPI ${name}`, async (t) => {
    const deployment = await fs.readJson(fixture)
    const spec = await convertSaasifyToOpenAPI(deployment)
    t.truthy(spec)
    const fullSpec = await annotateOpenAPI(spec, deployment)

    // TODO: temporary
    delete fullSpec.info.description
    console.log(fullSpec)

    t.truthy(fullSpec)
    t.snapshot(fullSpec)
  })
}
