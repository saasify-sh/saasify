import qs from 'qs'
import env from './env'

export const config = {
  client_id: env.providerGitHubClientId,
  redirect_uri: env.githubRedirectUri
}

export default ({ location }) => {
  const scope = 'read:user user:email'
  const opts = qs.stringify({
    ...config,
    scope,
    state: location.pathname
  })

  window.location = `https://github.com/login/oauth/authorize?${opts}`
}
