'use strict'

const globby = require('globby')
const path = require('path')
const test = require('ava')

const parseConfig = require('./parse-config')

const fixtures = globby.sync('./fixtures/*.json')

for (const fixture of fixtures) {
  const { name } = path.parse(fixture)

  test(name, async (t) => {
    const config = await parseConfig({ config: fixture })
    delete config.root

    console.log(JSON.stringify(config, null, 2))
    t.snapshot(config)
  })
}
