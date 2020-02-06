'use strict'

const fs = require('fs-extra')
const globby = require('globby')
const path = require('path')
const test = require('ava')
const parser = require('swagger-parser')
const getExamplesFromPathItem = require('./get-examples-from-path-item')

const fixturesSuccess = globby.sync('./fixtures/success/*.json')

for (const fixture of fixturesSuccess) {
  const { name } = path.parse(fixture)

  test(`parseOpenAPI success ${name}`, async (t) => {
    const input = await fs.readJson(fixture)
    const spec = await parser.dereference(input)

    for (const path of Object.keys(spec.paths)) {
      const pathItem = spec.paths[path]
      const results = await getExamplesFromPathItem(pathItem)
      console.log(path, JSON.stringify(results, null, 2))
      t.truthy(results)
      t.snapshot(results)
    }
  })
}
