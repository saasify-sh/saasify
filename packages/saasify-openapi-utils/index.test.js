'use strict'

const test = require('ava')
const utils = require('.')

test('basic', async (t) => {
  for (const key of Object.keys(utils)) {
    t.is(typeof utils[key], 'function')
  }
})
