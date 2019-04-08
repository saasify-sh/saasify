import FinClient from 'fin-client'

export default new FinClient({
  baseUrl: process.env.REACT_APP_FIN_API_BASE_URL
})
