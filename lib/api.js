import SaasifyClient from 'saasify-client'

export default new SaasifyClient({
  baseUrl: process.env.REACT_APP_SAASIFY_API_BASE_URL
})
