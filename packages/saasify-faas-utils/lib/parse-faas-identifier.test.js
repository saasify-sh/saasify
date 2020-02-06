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
  success(t, 'https://api.saasify.sh/1/call/username/foo-bar@01234567/foo')
  success(t, '/1/call/username/foo-bar@01234567/foo')
  success(t, '/username/foo-bar@01234567/foo')
  success(
    t,
    'https://api.saasify.sh/1/call/username/foo-bar@01234567/foo/bar/456/123'
  )
  success(t, '/1/call/username/foo-bar@01234567/foo/bar/456/123')
  success(t, '/username/foo-bar@01234567/foo/bar/456/123')
})

test('URL prefix error', (t) => {
  error(t, 'https://api.saasify.sh/2/proxy/username/foo-bar@01234567/foo')
  error(t, '/call/username/foo-bar@01234567/foo')
  error(t, '//username/foo-bar@01234567/foo')
})

test('URL suffix success', (t) => {
  success(t, 'username/foo-bar@01234567/foo/')
})

test('URL suffix error', (t) => {
  error(t, 'username/foo-bar@01234567/foo😀')
})

test('URL prefix and suffix success', (t) => {
  success(t, 'https://api.saasify.sh/1/call/username/foo-bar@01234567/foo/')
  success(
    t,
    'https://api.saasify.sh/1/call/username/foo-bar@01234567/foo/bar/123'
  )
})

test('namespace success', (t) => {
  success(t, 'https://api.saasify.sh/1/call/foo-bar@01234567/foo', {
    namespace: 'username'
  })
  success(t, '/1/call/foo-bar@01234567/foo', { namespace: 'username' })
  success(t, '/foo-bar@01234567/foo', { namespace: 'username' })
  success(t, '/foo-bar@01234567/foo/', { namespace: 'username' })
  success(t, 'https://api.saasify.sh/1/call/foo-bar@01234567/foo/bar/123', {
    namespace: 'username'
  })
  success(t, '/1/call/foo-bar@01234567/foo/bar/123', { namespace: 'username' })
  success(t, '/foo-bar@01234567/foo/bar/123', { namespace: 'username' })
})

test('namespace error', (t) => {
  error(t, 'https://api.saasify.sh/1/call/foo-bar@01234567/foo')
  error(t, '/1/call/foo-bar@01234567/foo')
  error(t, '/foo-bar@01234567/foo')
  error(t, '/foo-bar@01234567/foo/')
  error(t, '/foo-bar@01234567/foo/bar/123')
})
