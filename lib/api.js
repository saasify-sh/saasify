import SaasifyClient from 'saasify-client'

export default new SaasifyClient({
  baseUrl: process.env.REACT_APP_FIN_API_BASE_URL
})
