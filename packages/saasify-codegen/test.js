'use strict'

const globby = require('globby')
const path = require('path')
const test = require('ava')

const codegen = require('.')

const fixtures = globby.sync('./fixtures/*.json')

for (const fixture of fixtures) {
  const { name } = path.parse(fixture)
  const deployment = require(fixture)

  for (const service of deployment.services) {
    const testName = `${name} / ${service.name}`

    test.serial(testName, async (t) => {
      const code = codegen(service)

      console.log(code)
      t.snapshot(code)
    })
  }
}
