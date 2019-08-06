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
  t.truthy(validators.username('Foo123'))
  t.truthy(validators.username('asldfkjasldkfjlaksdfjlkas'))
})

test('username failure (invalid)', (t) => {
  t.falsy(validators.username('ab%'))
  t.falsy(validators.username('.'))
  t.falsy(validators.username('$'))
  t.falsy(validators.username('a'.repeat(65)))
})

test('username failure (blacklist)', (t) => {
  t.falsy(validators.username('fuck'))
  t.falsy(validators.username('username'))
  t.falsy(validators.username('undefined'))
  t.falsy(validators.username('null'))
  t.falsy(validators.username('404'))
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
  t.truthy(validators.projectName('_123-abc_'))
})

test('projectName failure', (t) => {
  t.falsy(validators.projectName('aa'))
  t.falsy(validators.projectName('abc.'))
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
  t.truthy(validators.project('_/___'))
})

test('project failure', (t) => {
  t.falsy(validators.project('aaa//0123'))
  t.falsy(validators.project('foo@bar'))
  t.falsy(validators.project('abc/1.23'))
  t.falsy(validators.project('012345678/123@latest'))
})

test('deployment success', (t) => {
  t.truthy(validators.deployment('username/project-name@01234567'))
  t.truthy(validators.deployment('a/123@01234567'))
  t.truthy(validators.deployment('_/___@01234567'))
})

test('deployment failure', (t) => {
  t.falsy(validators.deployment('username/project-name@012345678'))
  t.falsy(validators.deployment('a/123@0123A567'))
  t.falsy(validators.deployment('_/___@012.4567'))
  t.falsy(validators.deployment('aaa//0123@01234567'))
  t.falsy(validators.deployment('foo@bar@01234567'))
  t.falsy(validators.deployment('abc/1.23@01234567'))
  t.falsy(validators.deployment('012345678/123@latest'))
  t.falsy(validators.deployment('012345678/123@1.0.1'))
})

test('service success', (t) => {
  t.truthy(validators.service('serviceName'))
  t.truthy(validators.service('_identIFIER0123'))
  t.truthy(validators.service('abc_123_foo'))
})

test('service failure', (t) => {
  t.falsy(validators.service('ab1.2'))
  t.falsy(validators.service('foo-bar'))
  t.falsy(validators.service('abc/123'))
})
