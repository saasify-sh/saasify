import SaasifyClient from 'saasify-client'

export const API = new SaasifyClient({
  baseUrl: process.env.REACT_APP_SAASIFY_API_BASE_URL
})

export default API
