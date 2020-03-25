'use strict'

const test = require('ava')

const SaasifySDK = require('.')

test('basic', async (t) => {
  const sdk = new SaasifySDK({
    developmentToken: 'test-token'
  })

  await sdk.ready

  t.is(sdk.token, 'test-token')
  t.is(sdk.api.token, 'test-token')
})
