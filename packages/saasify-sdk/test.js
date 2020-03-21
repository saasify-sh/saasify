'use strict'

const test = require('ava')

const SaasifySDK = require('.')

test('basic', async (t) => {
  const sdk = new SaasifySDK({
    defaults: {
      project: 'foo',
      deployment: 'bar',
      consumer: {
        token: 'test-token'
      }
    }
  })

  await sdk.ready

  t.is(sdk.project, 'foo')
  t.is(sdk.deployment, 'bar')
  t.is(sdk.consumer.token, 'test-token')
  t.is(sdk.api.token, 'test-token')
})
