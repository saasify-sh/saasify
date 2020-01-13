'use strict'

const globby = require('globby')
const parser = require('swagger-parser')
const path = require('path')
const delay = require('delay')
const test = require('ava')

const saasifyToOpenAPI = require('.')

const fixtures = globby.sync('./fixtures/*.json')
// const fixtures = globby.sync('./fixtures/ta11y.json')

for (const fixture of fixtures) {
  const { name } = path.parse(fixture)

  test(name, async (t) => {
    const deployment = require(fixture)
    const spec = await saasifyToOpenAPI(deployment)

    console.log(JSON.stringify(spec, null, 2))
    t.snapshot(spec)

    await delay(1000)
    await parser.validate(spec)
  })
}
