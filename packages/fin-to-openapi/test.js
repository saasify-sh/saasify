'use strict'

const globby = require('globby')
const parser = require('swagger-parser')
const path = require('path')
const test = require('ava')

const finToOpenAPI = require('.')

const fixtures = globby.sync('./fixtures/*.json')

for (const fixture of fixtures) {
  const { name } = path.parse(fixture)

  test(name, async (t) => {
    const deployment = require(fixture)
    const spec = await finToOpenAPI(deployment)

    console.log(JSON.stringify(spec, null, 2))
    t.snapshot(spec)

    await parser.validate(spec)
  })
}
