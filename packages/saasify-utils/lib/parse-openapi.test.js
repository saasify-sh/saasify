'use strict'

const test = require('ava')
const validate = require('./parse-openapi')

const fixtureSuccess0 = require('../fixtures/openapi-success-0.json')
const fixtureError0 = require('../fixtures/openapi-error-0.json')
const fixtureError1 = require('../fixtures/openapi-error-1.json')

const success = async (t, value) => {
  const result = await validate(value)
  t.truthy(result)
  t.snapshot(result)
}

const error = async (t, value) => {
  await t.throwsAsync(() => validate(value))
}

test('openapi-success-0.json', async (t) => {
  await success(t, fixtureSuccess0)
})

test('openapi-error-0.json', async (t) => {
  await error(t, fixtureError0)
})

test('openapi-error-1.json', async (t) => {
  await error(t, fixtureError1)
})
