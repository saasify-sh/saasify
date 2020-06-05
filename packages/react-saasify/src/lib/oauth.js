/* global btoa */

import qs from 'qs'
import env from './env'
import API from './api'
import { LocalStore } from '../store/LocalStore'

const storeKey = 'auth:location'

export const githubConfig = {
  client_id: env.providerGitHubClientId,
  redirect_uri: env.githubRedirectUri
}

async function storeState() {
  return LocalStore.set(storeKey, window.location.href)
}

export async function authGitHub() {
  const scope = 'read:user user:email'
  const opts = qs.stringify({
    ...githubConfig,
    scope
  })

  await storeState()
  window.location = `https://github.com/login/oauth/authorize?${opts}`
}

export async function authLinkedIn() {
  const scope = 'r_liteprofile r_emailaddress'
  const stateRaw = JSON.stringify({
    uri: env.linkedinRedirectUri,
    route: window.location.pathname
  })
  const state = btoa(stateRaw)

  const opts = qs.stringify({
    client_id: env.providerLinkedInClientId,
    redirect_uri: env.redirectUri,
    response_type: 'code',
    scope,
    state
  })

  await storeState()
  window.location = `https://www.linkedin.com/oauth/v2/authorization?${opts}`
}

export async function authGoogle(params) {
  const { url } = await API.getGoogleAuthUrl(params)
  const authUrl = new URL(url)
  const state = JSON.stringify({
    uri: env.googleRedirectUri,
    route: window.location.pathname
  })
  const state64 = btoa(state)
  authUrl.searchParams.set('state', state64)
  const finalUrl = authUrl.toString()
  console.log('authenticating with google', { url, finalUrl })

  await storeState()
  window.location = finalUrl
}

export async function authStripe({ auth, express = false }) {
  const stateRaw = JSON.stringify({
    uri: env.stripeRedirectUri,
    route: window.location.pathname
  })
  const state = btoa(stateRaw)

  const scope = express ? undefined : 'read_write'
  const params = {
    response_type: 'code',
    client_id: env.providerStripeClientId,
    scope,
    state
  }

  if (auth) {
    params['stripe_user[email]'] = auth.user?.email
  }

  // TODO: allow for additional params customization

  const opts = qs.stringify(params)

  await storeState()

  if (express) {
    window.location = `https://connect.stripe.com/express/oauth/authorize?${opts}`
  } else {
    window.location = `https://connect.stripe.com/oauth/authorize?${opts}`
  }
}

export async function authSpotify({ scope = '' }) {
  const stateRaw = JSON.stringify({
    uri: env.spotifyRedirectUri,
    route: window.location.pathname
  })
  const state = btoa(stateRaw)

  const params = {
    response_type: 'code',
    client_id: env.providerSpotifyClientId,
    redirect_uri: env.redirectUri,
    scope,
    state
  }

  const opts = qs.stringify(params)

  await storeState()
  window.location = `https://accounts.spotify.com/authorize?${opts}`
}

export async function authTwitter() {
  const stateRaw = JSON.stringify({
    uri: env.twitterRedirectUri,
    route: window.location.pathname
  })
  const state = btoa(stateRaw)

  const params = {
    state
  }

  const opts = qs.stringify(params)
  const redirectUri = `${env.redirectUri}?${opts}`

  const { url: authUrl } = await API.getTwitterAuthUrl({ redirectUri })
  console.log({ redirectUri, authUrl })

  await storeState()
  window.location = authUrl
}
