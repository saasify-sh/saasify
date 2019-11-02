'use strict'

const test = require('ava')
const process = require('./process-readme')

test('single h1 present - remove h1', (t) => {
  const result = process('\n\n# ABC\n\n## FOO\nnala\n\n## BAR\n')
  t.truthy(result)
  t.true(typeof result === 'string')
  t.snapshot(result)
})

test('multiple h1s present - indent all headers', (t) => {
  const result = process('\n\n# ABC\n\n# FOO\nnala\n\n### BAR\n')
  t.truthy(result)
  t.true(typeof result === 'string')
  t.snapshot(result)
})

test('multiple h1s present with h6 - indent all headers except h6', (t) => {
  const result = process('\n\n# ABC\n\n# FOO\nnala\n\n###### BAR\n')
  t.truthy(result)
  t.true(typeof result === 'string')
  t.snapshot(result)
})

test('h1 not present - unchanged', (t) => {
  const result = process('\n\n## ABC\n\n#### FOO\nnala\n\n#### BAR\n')
  t.truthy(result)
  t.true(typeof result === 'string')
  t.snapshot(result)
})
