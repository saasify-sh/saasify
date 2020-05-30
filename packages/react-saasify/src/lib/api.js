import SaasifyClient from 'saasify-client'
import env from './env'

export const API = new SaasifyClient({
  baseUrl: env.apiBaseUrl
})

export default API
