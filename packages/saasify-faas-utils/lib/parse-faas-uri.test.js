'use strict'

const test = require('ava')
const parse = require('./parse-faas-uri')

const success = (t, value) => {
  const result = parse(value)
  t.truthy(result)
  t.truthy(result.projectId)
  t.truthy(result.version || result.deploymentHash)
  t.snapshot(result)
}

const error = (t, value) => {
  const result = parse(value)
  t.is(result, undefined)
}

test('username/projectName@deployment/servicePath success', (t) => {
  success(t, 'username/foo-bar@01234567/foo')
  success(t, 'username/foo-bar@abc123lz/foo')
  success(t, 'username/fooBar123-yo@01234567/foo_bar_BAR_901')
  success(t, 'username/fooBar@01234567/foo/bar/123/456')
})

test('username/projectName@deployment/servicePath error', (t) => {
  error(t, 'foo-bar@01234567/foo')
  error(t, '%/foo-bar@01234567/foo')
  error(t, 'user/foo^bar@01234567/foo')
  error(t, 'user@foo^bar@01234567/foo')
})

test('username/projectName@version/servicePath success', (t) => {
  success(t, 'username/foo-bar@latest/foo')
  success(t, 'username/foo-bar@1.0.0/foo')
  success(t, 'username/fooBar123-yo@0.0.1/foo_bar_BAR_901')
  success(t, 'username/fooBar123-yo@0.0.1/foo/bar/123-456')
})

test('username/projectName@version/servicePath error', (t) => {
  error(t, 'foo_bar@latest/foo')
  error(t, 'username/foo-bar@1.0.0/foo@')
  error(t, 'username/foo-bar@/foo')
  error(t, 'username/foo-bar@/foo/')
})

test('username/projectName/servicePath success', (t) => {
  success(t, 'u/foo-bar/foo')
  success(t, 'a/foo-bar/foo_123')
  success(t, 'foo/fooBar123-yo/foo_bar_BAR_901')
  success(t, 'foo/fooBar123-yo/foo/bar/123/456')
})

test('username/projectName/servicePath error', (t) => {
  error(t, '@/foo_bar/foo')
  error(t, 'foo-bar/foo\\/')
  error(t, 'user/_/foo')
  error(t, 'user/a 1/foo')
})

test('username/projectName@deployment success', (t) => {
  success(t, 'abc/hello-world@3d2e0fd5')
  success(t, 'a16z/foo-bar@f673db32c')
  success(t, 'foodoo/foo-bar@f673db32c')
  success(t, 'u/fooBar123-yo@673db32c')
  success(t, 'username/foo-bar@01234567/')
})

test('username/projectName@deployment error', (t) => {
  error(t, '/hello-world@3d2e0fd5')
  error(t, 'foo-bar@f673db32c')
  error(t, 'foodoo/foo@bar@f673db32c')
  error(t, 'u/fooBar123-yo@/673db32c')
})

test('username/projectName@version success', (t) => {
  success(t, 'abc/hello-world@1.0.3')
  success(t, 'a16z/foo-bar@latest')
  success(t, 'foodoo/foo-bar@1.0.1')
  success(t, 'u/fooBar123-yo@3.2.2234')
  success(t, 'username/foo-bar@1.0.3/')
})

test('username/projectName@version error', (t) => {
  error(t, '/hello-world@3d2e0fd5')
  error(t, 'foo-bar@f673db32c')
  error(t, 'foodoo/foo@bar@f673db32c@')
  error(t, 'u/fooBar123-yo@/673db32c/')
})

test('username/projectName success', (t) => {
  success(t, 'abc/hello-world')
  success(t, 'a16z/foo-bar')
  success(t, 'foodoo/foo-bar')
  success(t, 'u/fooBar123-yo')
  success(t, 'abc/hello-world/')
})

test('username/projectName error', (t) => {
  error(t, '/hello-world')
  error(t, 'foo-barc')
  error(t, 'foodoo/foo@bar@')
  error(t, 'u/fooBar123-yo@/')
})
