import qs from 'qs'
import env from './env'

export const config = {
  client_id: env.providerGitHubClientId,
  redirect_uri: `${window.location.origin}/auth/github`
}

export default ({ location }) => {
  const opts = qs.stringify({
    ...config,
    state: location.pathname
  })

  window.location = `https://github.com/login/oauth/authorize?${opts}`
}
