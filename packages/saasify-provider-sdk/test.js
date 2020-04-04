'use strict'

const test = require('ava')
const nock = require('nock')

const SaasifyProviderSDK = require('.')

test('reportUsage', async (t) => {
  nock('https://api.saasify.sh', {
    reqheaders: {
      authorization: 'Bearer test-token'
    }
  })
    .intercept(
      '/1/provider/users/test-user/metrics/test-metric/usage_records',
      'POST'
    )
    .reply(200, {
      status: 'ok'
    })

  const sdk = new SaasifyProviderSDK({ token: 'test-token' })
  const res = await sdk.reportUsage({
    user: 'test-user',
    metric: 'test-metric',
    quantity: 10
  })
  t.deepEqual(res, { status: 'ok' })
})
