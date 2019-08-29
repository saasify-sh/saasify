'use strict'

const test = require('ava')
const parse = require('./parse-faas-identifier')

const success = (t, ...args) => {
  const result = parse(...args)
  t.truthy(result)
  t.truthy(result.projectId)
  t.truthy(result.version || result.deploymentHash)
  t.snapshot(result)
}

const error = (t, ...args) => {
  const result = parse(...args)
  t.is(result, undefined)
}

test('URL prefix success', (t) => {
  success(t, 'https://api.saasify.xyz/1/call/username/foo-bar.foo@01234567')
  success(t, '/1/call/username/foo-bar.foo@01234567')
  success(t, '/username/foo-bar.foo@01234567')
})

test('URL prefix error', (t) => {
  error(t, 'https://api.saasify.xyz/2/proxy/username/foo-bar.foo@01234567')
  error(t, '/call/username/foo-bar.foo@01234567')
  error(t, '//username/foo-bar.foo@01234567')
})

test('URL suffix success', (t) => {
  success(t, 'username/foo-bar.foo@01234567/')
})

test('URL suffix error', (t) => {
  error(t, 'username/foo-bar.foo@01234567/abc')
})

test('URL prefix and suffix success', (t) => {
  success(t, 'https://api.saasify.xyz/1/call/username/foo-bar.foo@01234567/')
})

test('namespace success', (t) => {
  success(t, 'https://api.saasify.xyz/1/call/foo-bar.foo@01234567', { namespace: 'username' })
  success(t, '/1/call/foo-bar.foo@01234567', { namespace: 'username' })
  success(t, '/foo-bar.foo@01234567', { namespace: 'username' })
  success(t, '/foo-bar.foo@01234567/', { namespace: 'username' })
})

test('namespace error', (t) => {
  error(t, 'https://api.saasify.xyz/1/call/foo-bar.foo@01234567')
  error(t, '/1/call/foo-bar.foo@01234567')
  error(t, '/foo-bar.foo@01234567')
  error(t, '/foo-bar.foo@01234567/')
})
