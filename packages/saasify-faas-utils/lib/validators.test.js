'use strict'

const test = require('ava')
const validators = require('./validators')

test('email success', (t) => {
  t.truthy(validators.email('t@t.com'))
  t.truthy(validators.email('abc@gmail.com'))
  t.truthy(validators.email('abc@foo.io'))
})

test('email failure', (t) => {
  t.falsy(validators.email('t@t'))
  t.falsy(validators.email('abc'))
  t.falsy(validators.email('@'))
})

test('username success', (t) => {
  t.truthy(validators.username('z'))
  t.truthy(validators.username('abc'))
  t.truthy(validators.username('abc-123'))
  t.truthy(validators.username('Foo123'))
  t.truthy(validators.username('asldfkjasldkfjlaksdfjlkas'))
})

test('username failure (invalid)', (t) => {
  t.falsy(validators.username('ab%'))
  t.falsy(validators.username('.'))
  t.falsy(validators.username('$'))
  t.falsy(validators.username('abc_123'))
  t.falsy(validators.username('a'.repeat(65)))
})

test('password success', (t) => {
  t.truthy(validators.password('abc'))
  t.truthy(validators.password('password'))
  t.truthy(validators.password('asldfkjasldkfjlaksdfjlkas'))
})

test('password failure', (t) => {
  t.falsy(validators.password('aa'))
  t.falsy(validators.password('.'))
  t.falsy(validators.password('a'.repeat(1025)))
})

test('projectName success', (t) => {
  t.truthy(validators.projectName('aaa'))
  t.truthy(validators.projectName('hello-world'))
  t.truthy(validators.projectName('123-abc'))
})

test('projectName failure', (t) => {
  t.falsy(validators.projectName('aa'))
  t.falsy(validators.projectName('hello_world'))
  t.falsy(validators.projectName('a_bc'))
  t.falsy(validators.projectName('abc.'))
  t.falsy(validators.projectName('abc_123'))
  t.falsy(validators.projectName('ah^23'))
  t.falsy(validators.projectName('f'.repeat(100)))
})

test('deploymentHash success', (t) => {
  t.truthy(validators.deploymentHash('abcdefgh'))
  t.truthy(validators.deploymentHash('01234567'))
  t.truthy(validators.deploymentHash('k2l3n6l2'))
})

test('deploymentHash failure', (t) => {
  t.falsy(validators.deploymentHash('aa'))
  t.falsy(validators.deploymentHash(''))
  t.falsy(validators.deploymentHash('Abcdefgh'))
  t.falsy(validators.deploymentHash('012345678'))
})

test('project success', (t) => {
  t.truthy(validators.project('username/project-name'))
  t.truthy(validators.project('a/123'))
})

test('project failure', (t) => {
  t.falsy(validators.project('aaa//0123'))
  t.falsy(validators.project('foo@bar'))
  t.falsy(validators.project('abc/1.23'))
  t.falsy(validators.project('012345678/123@latest'))
  t.falsy(validators.project('_/___'))
})

test('deployment success', (t) => {
  t.truthy(validators.deployment('username/project-name@01234567'))
  t.truthy(validators.deployment('a/123@01234567'))
})

test('deployment failure', (t) => {
  t.falsy(validators.deployment('username/project-name@012345678'))
  t.falsy(validators.deployment('a/123@0123A567'))
  t.falsy(validators.deployment('_/___@012.4567'))
  t.falsy(validators.deployment('_/___@01234567'))
  t.falsy(validators.deployment('aaa//0123@01234567'))
  t.falsy(validators.deployment('foo@bar@01234567'))
  t.falsy(validators.deployment('abc/1.23@01234567'))
  t.falsy(validators.deployment('012345678/123@latest'))
  t.falsy(validators.deployment('012345678/123@1.0.1'))
})

test('serviceName success', (t) => {
  t.truthy(validators.serviceName('serviceName'))
  t.truthy(validators.serviceName('_identIFIER0123'))
  t.truthy(validators.serviceName('abc_123_foo'))
})

test('serviceName failure', (t) => {
  t.falsy(validators.serviceName('ab1.2'))
  t.falsy(validators.serviceName('foo-bar'))
  t.falsy(validators.serviceName('abc/123'))
})

test('servicePath success', (t) => {
  t.truthy(validators.servicePath('/foo'))
  t.truthy(validators.servicePath('/'))
  t.truthy(validators.servicePath('/foo/bar/123%20-_abc'))
  t.truthy(validators.servicePath('/foo/BAR/..'))
  t.truthy(validators.servicePath('/api/iconsets/v3/categories'))
})

test('servicePath failure', (t) => {
  t.falsy(validators.servicePath(''))
  t.falsy(validators.servicePath('foo/bar'))
  t.falsy(validators.servicePath('/foo/bar\\'))
  t.falsy(validators.servicePath('/foo/bar@'))
  t.falsy(validators.servicePath('/foo/bar@abc'))
})
