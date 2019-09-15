const isProd = (process.env.NODE_ENV === 'production')
const suffix = (isProd ? 'PRD' : 'DEV')

export default {
  providerGitHubClientId: process.env[`REACT_APP_PROVIDER_GITHUB_CLIENT_ID_${suffix}`],
  stripePublicKey: isProd
    ? process.env.REACT_APP_STRIPE_PUBLIC_KEY_LIVE
    : process.env.REACT_APP_STRIPE_PUBLIC_KEY_TEST,
  authUri: isProd
    ? 'https://auth.saasify.sh'
    : 'http://auth.localhost:3000'
}
