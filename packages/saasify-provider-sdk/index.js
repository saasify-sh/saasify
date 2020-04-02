'use strict'

const axios = require('axios')

const defaultBaseUrl = 'https://api.saasify.sh'

module.exports = class SaasifyProviderSDK {
  constructor(opts = {}) {
    const { baseUrl = defaultBaseUrl, token } = opts

    if (!token) {
      throw new Error('Provider auth "token" is required')
    }

    this._baseUrl = baseUrl
    this._token = token
    this._reset()
  }

  get token() {
    return this._token
  }

  get baseUrl() {
    return this._baseUrl
  }

  // --------------------------------------------------------------------------
  // Metered billing usage
  // --------------------------------------------------------------------------

  async reportUsage(opts) {
    const { user, metric, quantity, ...rest } = opts

    if (!user) {
      throw new Error(
        'reportUsage missing required parameter "user" (string id)'
      )
    }

    if (!metric) {
      throw new Error(
        'reportUsage missing required parameter "metric" (string slug)'
      )
    }

    if (!quantity) {
      throw new Error(
        'reportUsage missing required parameter "quantity" (number)'
      )
    }

    return this._request({
      url: `/1/provider/users/${user}/metrics/${metric}/usage_records`,
      method: 'post',
      data: {
        quantity,
        ...rest
      }
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Licensed billing usage
  // --------------------------------------------------------------------------

  async updateQuantity(opts) {
    const { user, metric, quantity, ...rest } = opts

    if (!user) {
      throw new Error(
        'updateQuantity missing required parameter "user" (string id)'
      )
    }

    if (!metric) {
      throw new Error(
        'updateQuantity missing required parameter "metric" (string slug)'
      )
    }

    if (!quantity) {
      throw new Error(
        'updateQuantity missing required parameter "quantity" (number)'
      )
    }

    return this._request({
      url: `/1/provider/users/${user}/metrics/${metric}`,
      method: 'put',
      data: {
        quantity,
        ...rest
      }
    }).then((res) => res.data)
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  _reset() {
    const headers = {}

    if (this._token) {
      headers.authorization = `Bearer ${this._token}`
    }

    this._request = axios.create({
      baseURL: this._baseUrl,
      responseType: 'json',
      headers
    })
  }
}
