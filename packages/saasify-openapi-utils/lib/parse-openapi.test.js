'use strict'

const fs = require('fs-extra')
const globby = require('globby')
const path = require('path')
const test = require('ava')
const parseOpenAPI = require('./parse-openapi')

const fixturesSuccess = globby.sync('./fixtures/success/*.json')
const fixturesError = globby.sync('./fixtures/error/*.json')

for (const fixture of fixturesSuccess) {
  const { name } = path.parse(fixture)

  test(`parseOpenAPI success ${name}`, async (t) => {
    const spec = await fs.readJson(fixture)
    const result = await parseOpenAPI(spec)
    t.truthy(result)
    t.snapshot(result)
  })
}

for (const fixture of fixturesError) {
  const { name } = path.parse(fixture)

  test(`parseOpenAPI error ${name}`, async (t) => {
    const spec = await fs.readJson(fixture)
    try {
      const result = await parseOpenAPI(spec)
      console.error(result)
      t.fail(`expected ${name} to throw an error`)
    } catch (err) {
      console.log('(expected)', err.message)
      t.snapshot(err.message)
    }
  })
}
