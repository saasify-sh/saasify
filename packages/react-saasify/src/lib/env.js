import qs from 'qs'

const isProd = process.env.NODE_ENV === 'production'
const suffix = isProd ? 'PRD' : 'DEV'

const githubRedirectUri = `${window.location.origin}/auth/github`
const githubRedirectQuery = qs.stringify({ uri: githubRedirectUri })

const googleRedirectUri = `${window.location.origin}/auth/google`
const googleRedirectQuery = qs.stringify({ uri: googleRedirectUri })

export default {
  providerGitHubClientId:
    process.env[`REACT_APP_PROVIDER_GITHUB_CLIENT_ID_${suffix}`],
  githubRedirectUri: `https://auth.saasify.sh?${githubRedirectQuery}`,
  googleRedirectUri: `https://auth.saasify.sh?${googleRedirectQuery}`,
  stripePublicKey: isProd
    ? process.env.REACT_APP_STRIPE_PUBLIC_KEY_LIVE
    : process.env.REACT_APP_STRIPE_PUBLIC_KEY_TEST
}
