'use strict'

const test = require('ava')
const proxy = require('.')

// TODO: actual unit tests
test('basic', async (t) => {
  t.is(typeof proxy, 'function')
  t.is(typeof proxy(), 'function')
})
