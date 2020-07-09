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
  // Customers
  // --------------------------------------------------------------------------

  async getUser(userId, params = {}) {
    if (!userId) {
      throw new Error(
        'getCustomer missing required parameter "userId" (string id)'
      )
    }

    return this._request({
      url: `/1/provider/users/${userId}`,
      method: 'get',
      params
    }).then((res) => res.data)
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

    if (quantity === undefined) {
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

  async updateUsage(opts) {
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

    if (quantity === undefined) {
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
