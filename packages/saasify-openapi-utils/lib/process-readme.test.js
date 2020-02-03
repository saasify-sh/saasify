'use strict'

const test = require('ava')
const process = require('./process-readme')

test('single h1 present - remove h1', (t) => {
  const { readme } = process('\n\n# ABC\n\n## FOO\nnala\n\n## BAR\n')
  t.truthy(readme)
  t.true(typeof readme === 'string')
  t.snapshot(readme)
})

test('multiple h1s present - indent all headers', (t) => {
  const { readme } = process('\n\n# ABC\n\n# FOO\nnala\n\n### BAR\n')
  t.truthy(readme)
  t.true(typeof readme === 'string')
  t.snapshot(readme)
})

test('multiple h1s present with h6 - indent all headers except h6', (t) => {
  const { readme } = process('\n\n# ABC\n\n# FOO\nnala\n\n###### BAR\n')
  t.truthy(readme)
  t.true(typeof readme === 'string')
  t.snapshot(readme)
})

test('h1 not present - unchanged', (t) => {
  const { readme } = process('\n\n## ABC\n\n#### FOO\nnala\n\n#### BAR\n')
  t.truthy(readme)
  t.true(typeof readme === 'string')
  t.snapshot(readme)
})

test('contains "Quick Start" header - return structured data', (t) => {
  const { quickStart } = process(
    '\n\n# ABC\n\n## Quick Start\n### Step 1\nnala\n'
  )

  t.truthy(quickStart)
  t.true(typeof quickStart === 'string')
  t.snapshot(quickStart)
})

test('contains "Quick Start" and "Supporting OSS" headers - return structured data', (t) => {
  const { quickStart, supportingOSS } = process(
    '\n\n# ABC\n\n## Quick Start\n### Step 1\nnala\n## Supporting OSS\nnala\n'
  )
  t.truthy(quickStart)
  t.true(typeof quickStart === 'string')
  t.snapshot(quickStart)

  t.truthy(supportingOSS)
  t.true(typeof supportingOSS === 'string')
  t.snapshot(supportingOSS)
})

test('does not contain structured data - return empty structured data', (t) => {
  const { quickStart } = process('\n\n# ABC\n\n## FOO\nnala\n\n## BAR\n')

  t.falsy(quickStart)
  t.true(typeof quickStart === 'string')
})
