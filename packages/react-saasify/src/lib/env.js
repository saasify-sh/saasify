import qs from 'qs'

const isProd = process.env.NODE_ENV === 'production'
const suffix = isProd ? 'PRD' : 'DEV'

const githubRedirectUri = `${window.location.origin}/auth/github`
const googleRedirectUri = `${window.location.origin}/auth/google`
const stripeRedirectUri = `${window.location.origin}/auth/stripe`
const spotifyRedirectUri = `${window.location.origin}/auth/spotify`
const twitterRedirectUri = `${window.location.origin}/auth/twitter`

const githubRedirectQuery = qs.stringify({ uri: githubRedirectUri })

export default {
  isProd,

  // github
  githubRedirectUri: `https://auth.saasify.sh?${githubRedirectQuery}`,
  providerGitHubClientId:
    process.env[`REACT_APP_PROVIDER_GITHUB_CLIENT_ID_${suffix}`],

  // google
  googleRedirectUri,

  // stripe
  stripeRedirectUri,
  providerStripeClientId:
    process.env[`REACT_APP_PROVIDER_STRIPE_CLIENT_ID_${suffix}`],
  stripePublicKey: isProd
    ? process.env.REACT_APP_STRIPE_PUBLIC_KEY_LIVE
    : process.env.REACT_APP_STRIPE_PUBLIC_KEY_TEST,

  // spotify
  spotifyRedirectUri,
  providerSpotifyClientId:
    process.env[`REACT_APP_PROVIDER_SPOTIFY_CLIENT_ID_${suffix}`],

  // twitter
  twitterRedirectUri
}
