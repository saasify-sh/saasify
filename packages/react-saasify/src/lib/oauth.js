import qs from 'qs'
import env from './env'
import API from './api'

export const githubConfig = {
  client_id: env.providerGitHubClientId,
  redirect_uri: env.githubRedirectUri
}

export const googleConfig = {
  redirectUrl: env.googleRedirectUri
}

export function authGitHub({ location }) {
  const scope = 'read:user user:email'
  const opts = qs.stringify({
    ...githubConfig,
    scope,
    state: location.pathname
  })

  window.location = `https://github.com/login/oauth/authorize?${opts}`
}

export async function authGoogle({ location }) {
  const opts = {
    ...googleConfig,
    state: location.pathname
  }

  const url = await API.getGoogleAuthUrl(opts)

  window.location = url
}
