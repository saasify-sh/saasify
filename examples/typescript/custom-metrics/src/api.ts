import SaasifyProviderSDK = require('saasify-provider-sdk')
import { Controller, Put, Route, Header, Body } from 'tsoa'

import { UsageRequestBody } from './types'

const sdk = new SaasifyProviderSDK({
  baseUrl: process.env.SAASIFY_BASE_URL,
  token: process.env.SAASIFY_PROVIDER_TOKEN
})

@Route('/test')
export class ExampleController extends Controller {
  @Put(`/usage`)
  public async testUsage(
    @Body() body: UsageRequestBody,
    @Header('x-saasify-user') userId: string
  ): Promise<any> {
    console.log('testUsage', { ...body, userId })

    const result = await sdk.reportUsage({
      ...body,
      user: userId,
      metric: 'orders'
    })

    return result
  }
}
