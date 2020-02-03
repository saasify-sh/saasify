'use strict'

const fs = require('fs-extra')
const globby = require('globby')
const path = require('path')
const test = require('ava')
const validateOpenAPI = require('./validate-openapi')

const fixturesSuccess = globby.sync('./fixtures/success/*.json')

for (const fixture of fixturesSuccess) {
  const { name } = path.parse(fixture)

  test(`validateOpenAPI success ${name}`, async (t) => {
    const spec = await fs.readJson(fixture)
    await validateOpenAPI(spec)
    t.pass()
  })
}
