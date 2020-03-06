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
    route: location.pathname
  })

  window.location = `https://github.com/login/oauth/authorize?${opts}`
}

export async function authGoogle({ location }, params) {
  const { url } = await API.getGoogleAuthUrl(params)
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

export function authStripe({ location, auth }) {
  const stateRaw = JSON.stringify({
    uri: env.stripeRedirectUri,
    route: location.pathname
  })
  const state = btoa(stateRaw)

  const scope = 'read_write'
  const params = {
    response_type: 'code',
    client_id: env.providerStripeClientId,
    scope,
    state
  }

  if (auth) {
    params['stripe_user[email]'] = auth.user?.email
  }

  const opts = qs.stringify(params)

  // https://connect.stripe.com/express/oauth/authorize
  // scope result will be 'express' if it is an express acount
  // need to remove scope from request if using express account

  window.location = `https://connect.stripe.com/oauth/authorize?${opts}`
}

export function authSpotify({ location, scope = '' }) {
  const stateRaw = JSON.stringify({
    uri: env.spotifyRedirectUri,
    route: location.pathname
  })
  const state = btoa(stateRaw)

  const params = {
    response_type: 'code',
    client_id: env.providerSpotifyClientId,
    redirect_uri: 'https://auth.saasify.sh',
    scope,
    state
  }

  const opts = qs.stringify(params)
  window.location = `https://accounts.spotify.com/authorize?${opts}`
}
