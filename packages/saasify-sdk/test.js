'use strict'

const test = require('ava')

const SaasifySDK = require('.')

// Using underlying now service URL directly to avoid rate limiting.
// In the future, we should support admin auth tokens that disable rate limiting.
const nowUrl = 'https://dev-hello-world-4e4f8q7iy.now.sh'
// const saasifyUrl = 'https://api.saasify.sh/1/call/dev/hello-world'

test('GET hello-world', async (t) => {
  const sdk = new SaasifySDK()
  const res = await sdk.get(nowUrl, { data: { name: 'nala' } })
  t.truthy(res)

  const { response, ...rest } = res
  t.snapshot(rest)
})

test('POST hello-world', async (t) => {
  const sdk = new SaasifySDK()
  const res = await sdk.post(nowUrl, { data: { name: 'chris villa' } })
  t.truthy(res)

  const { response, ...rest } = res
  t.snapshot(rest)
})

test('call POST hello-world', async (t) => {
  const sdk = new SaasifySDK()
  const res = await sdk.call(nowUrl, {
    data: { name: 'chris villa' },
    method: 'post'
  })
  t.truthy(res)

  const { response, ...rest } = res
  t.snapshot(rest)
})
