import SaasifySDK from 'saasify-sdk'

const sdk = new SaasifySDK()

export default async ({ auth, service, data }) => {
  sdk.token = auth.consumer && auth.consumer.token

  const result = await sdk.call(service.url, {
    method: service.POST ? 'POST' : 'GET',
    data
  })

  if (result.output && result.outputContentType) {
    if (result.outputContentType.startsWith('image/')) {
      result.output = result.output.toString('base64')
    }
  }

  return result
}
