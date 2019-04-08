import FinClient from 'fin-client'
import AuthManager from 'store/AuthManager'
import { autorun } from 'mobx'

const api = new FinClient({
  baseUrl: process.env.REACT_APP_API_BASE_URL
})

autorun(() => {
  api.user = AuthManager.auth && AuthManager.auth.user
  api.token = AuthManager.auth && AuthManager.auth.token
})

export default api
