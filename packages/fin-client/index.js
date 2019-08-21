'use strict'

const axios = require('axios')
const qs = require('qs')

const defaultBaseUrl = 'https://api.functional-income.com'

module.exports = class FinClient {
  constructor (opts = { }) {
    const {
      baseUrl = defaultBaseUrl,
      user,
      token
    } = opts

    this._baseUrl = baseUrl
    this._user = user
    this._token = token

    if (!!user !== !!token) {
      throw new Error('user must be passed if and only if token is passed')
    }

    this._reset()
  }

  get isAuthenticated () {
    return !!this._token
  }

  get token () {
    return this._token
  }

  get user () {
    return this._user
  }

  set user (user) {
    this._user = user
    this._reset()
  }

  set token (token) {
    this._token = token
    this._reset()
  }

  get baseUrl () {
    return this._baseUrl
  }

  // --------------------------------------------------------------------------
  // Auth
  // --------------------------------------------------------------------------

  async signin ({ username, password }) {
    return this._request({
      url: `/1/auth/signin`,
      method: 'put',
      data: {
        username,
        password
      }
    }).then(res => res.data)
      .then((data) => {
        this._token = data.token
        this._user = data.user
        return data
      })
  }

  async signup (data) {
    return this._request({
      url: `/1/auth/signup`,
      method: 'post',
      data
    }).then(res => res.data)
      .then((data) => {
        this._token = data.token
        this._user = data.user
        return data
      })
  }

  async authWithGitHub (data) {
    return this._request({
      url: `/1/auth/github`,
      method: 'put',
      data
    }).then(res => res.data)
      .then((data) => {
        this._token = data.token
        this._user = data.user
        return data
      })
  }

  async authWithFacebook (data) {
    return this._request({
      url: `/1/auth/facebook`,
      method: 'put',
      data
    }).then(res => res.data)
      .then((data) => {
        this._token = data.token
        this._user = data.user
        return data
      })
  }

  async signout () {
    this._token = null
    this._user = null
  }

  // --------------------------------------------------------------------------
  // Users
  // --------------------------------------------------------------------------

  async getMe () {
    return this._request({
      url: `/1/me`
    }).then(res => res.data)
  }

  async updateMe (data) {
    return this._request({
      url: `/1/me`,
      method: 'put',
      data
    }).then(res => res.data)
  }

  // --------------------------------------------------------------------------
  // Projects
  // --------------------------------------------------------------------------

  async createProject (data) {
    return this._request({
      url: `/1/projects`,
      method: 'post',
      data
    }).then(res => res.data)
  }

  async getProject (id, opts = { }) {
    const querystring = qs.stringify(opts)

    return this._request({
      url: `/1/projects/${id}?${querystring}`
    }).then(res => res.data)
  }

  async updateProject (project) {
    return this._request({
      url: `/1/projects/${project.id}`,
      method: 'put',
      data: project
    }).then(res => res.data)
  }

  // --------------------------------------------------------------------------
  // Consumers
  // --------------------------------------------------------------------------

  async createConsumer (data) {
    return this._request({
      url: `/1/consumers`,
      method: 'post',
      data
    }).then(res => res.data)
  }

  async getConsumer (id) {
    return this._request({
      url: `/1/consumers/${id}`
    }).then(res => res.data)
  }

  async removeConsumer (consumer) {
    return this._request({
      url: `/1/consumers/${consumer.id}`,
      method: 'delete'
    }).then(res => res.data)
  }

  async updateConsumer (consumer) {
    return this._request({
      url: `/1/consumers/${consumer.id}`,
      method: 'put'
    }).then(res => res.data)
  }

  async getConsumerByProject (projectId) {
    return this._request({
      url: `/1/consumers/projects/${projectId}`
    }).then(res => res.data)
  }

  // --------------------------------------------------------------------------
  // Deployments
  // --------------------------------------------------------------------------

  async createDeployment (data) {
    return this._request({
      url: `/1/deployments`,
      method: 'post',
      data
    }).then(res => res.data)
  }

  async getDeployment (id, opts = { }) {
    const querystring = qs.stringify(opts)

    return this._request({
      url: `/1/deployments/${id}?${querystring}`
    }).then(res => res.data)
  }

  async updateDeployment (deployment) {
    return this._request({
      url: `/1/deployments/${deployment.id}`,
      method: 'put',
      data: deployment
    }).then(res => res.data)
  }

  async removeDeployment (id) {
    return this._request({
      url: `/1/deployments/${id}`,
      method: 'delete'
    }).then(res => res.data)
  }

  async listDeployments (where = { }, opts = { }) {
    const querystring = qs.stringify({ where, ...opts })

    return this._request({
      url: `/1/deployments?${querystring}`
    }).then(res => res.data)
  }

  // --------------------------------------------------------------------------
  // Logs
  // --------------------------------------------------------------------------

  async getLogs (identifier, opts) {
    return this._request({
      url: `/1/logs`,
      method: 'put',
      data: {
        ...opts,
        identifier
      }
    }).then(res => res.data)
  }

  // --------------------------------------------------------------------------
  // Billing
  // --------------------------------------------------------------------------

  async getBilling () {
    return this._request({
      url: `/1/billing`
    }).then(res => res.data)
  }

  async listBillingSources () {
    return this._request({
      url: `/1/billing/sources`
    }).then(res => res.data)
  }

  async addBillingSource (data) {
    return this._request({
      url: `/1/billing/sources`,
      method: 'post',
      data
    }).then(res => res.data)
  }

  async removeBillingSource (id) {
    return this._request({
      url: `/1/billing/sources/${id}`,
      method: 'delete'
    }).then(res => res.data)
  }

  async setDefaultBillingSource (id) {
    return this._request({
      url: `/1/billing/sources/${id}/set-default`,
      method: 'put'
    }).then(res => res.data)
  }

  async listBillingInvoices (opts = { }) {
    const querystring = qs.stringify(opts)

    return this._request({
      url: `/1/billing/invoices?${querystring}`
    }).then(res => res.data)
  }

  async listBillingInvoicesForConsumer (consumer, opts = { }) {
    const querystring = qs.stringify(opts)

    return this._request({
      url: `/1/billing/invoices/${consumer.id}?${querystring}`
    }).then(res => res.data)
  }

  async listBillingUsageForConsumer (consumer, opts = { }) {
    const querystring = qs.stringify(opts)

    return this._request({
      url: `/1/billing/usage/${consumer.id}?${querystring}`
    }).then(res => res.data)
  }

  // --------------------------------------------------------------------------
  // Checkout
  // --------------------------------------------------------------------------

  /* TODO: currently not supported for plans with usage_type=metered
  async createCheckoutSession (data) {
    return this._request({
      url: `/1/billing/checkout`,
      method: 'post',
      data
    }).then(res => res.data)
  }
  */

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  _reset () {
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
