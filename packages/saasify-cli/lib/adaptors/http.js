'use strict'

module.exports = async (opts) => {
  const { config } = opts

  const backendUrl = process.env.SAASIFY_BACKEND_URL || config.backendUrl
  if (backendUrl) {
    config.backendUrl = backendUrl
  } else {
    throw new Error(
      'For HTTP backends that are not using OpenAPI, you must specify your backend API\'s production URL using either "backendUrl" in your config or via the "SAASIFY_BACKEND_URL" environment variable'
    )
  }

  const backendDevUrl =
    process.env.SAASIFY_BACKEND_DEV_URL || config.backendDevUrl
  if (backendUrl) {
    config.backendDevUrl = backendDevUrl
  }

  return config
}
