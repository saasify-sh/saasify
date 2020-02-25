/* global btoa */

import qs from 'qs'
import env from './env'
import API from './api'

export const githubConfig = {
  client_id: env.providerGitHubClientId,
  redirect_uri: env.githubRedirectUri
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
  const { url } = await API.getGoogleAuthUrl()
  const authUrl = new URL(url)
  const state = JSON.stringify({
    uri: env.googleRedirectUri,
    route: location.pathname
  })
  const state64 = btoa(state)
  authUrl.searchParams.set('state', state64)
  const finalUrl = authUrl.toString()
  console.log('authenticating with google', { url, finalUrl })

  window.location = finalUrl
}
