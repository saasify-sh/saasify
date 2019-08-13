const suffix = (process.env.NODE_ENV === 'production' ? 'PRD' : 'DEV')

export default {
  providerGitHubClientId: process.env[`REACT_APP_PROVIDER_GITHUB_CLIENT_ID_${suffix}`],
  facebookAppId: process.env[`REACT_APP_PROVIDER_FACEBOOK_CLIENT_ID_${suffix}`],
  stripePublicKey: (process.env.NODE_ENV === 'production')
    ? process.env.REACT_APP_STRIPE_PUBLIC_KEY_LIVE
    : process.env.REACT_APP_STRIPE_PUBLIC_KEY_TEST
}
