import qs from 'qs'
import env from './env'

const redirectUrl = `${window.location.origin}/auth/github`

export const config = {
  client_id: env.providerGitHubClientId,
  redirect_uri: `${env.authUri}?${qs.stringify({ url: redirectUrl })}`
}

export default ({ location }) => {
  const opts = qs.stringify({
    ...config,
    state: location.pathname
  })

  window.location = `https://github.com/login/oauth/authorize?${opts}`
}
