'use strict'

const axios = require('axios')
const { parse: parseContentType } = require('content-type')
const qs = require('qs')

const defaultContentType = 'application/octet-stream'

const httpMethodsWithBodies = new Set([
  'put',
  'post',
  'delete',
  'trace',
  'patch'
])

const env =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'dev'
    : 'prod'
const faasBaseUrl = env === 'prod' ? 'https://ssfy.sh' : 'http://localhost:5100'

module.exports = class SaasifyFaasSDK {
  constructor(opts = {}) {
    if (typeof opts === 'string') {
      this._token = opts
    } else {
      const { token, baseUrl, targetUrl, deploymentId, projectId } = opts

      this._token = token
      this._targetUrl = targetUrl

      if (targetUrl && process.env.NODE_ENV === 'production') {
        console.warn('SaasifyFaasSDK ignoring "targetUrl" in production')
        this._targetUrl = undefined
      }

      if (baseUrl) {
        this._baseUrl = baseUrl
      } else if (deploymentId) {
        this._baseUrl = `${faasBaseUrl}/${deploymentId}`
      } else if (projectId) {
        this._baseUrl = `${faasBaseUrl}/${projectId}`
      } else {
        this._baseUrl = faasBaseUrl
      }
    }
  }

  get isAuthenticated() {
    return !!this._token
  }

  get token() {
    return this._token
  }

  set token(token) {
    this._token = token
  }

  // --------------------------------------------------------------------------
  // Call
  // --------------------------------------------------------------------------

  get(url, opts = {}) {
    return this.call(url, { ...opts, method: 'GET' })
  }

  put(url, opts = {}) {
    return this.call(url, { ...opts, method: 'PUT' })
  }

  post(url, opts = {}) {
    return this.call(url, { ...opts, method: 'POST' })
  }

  delete(url, opts = {}) {
    return this.call(url, { ...opts, method: 'DELETE' })
  }

  head(url, opts = {}) {
    return this.call(url, { ...opts, method: 'HEAD' })
  }

  patch(url, opts = {}) {
    return this.call(url, { ...opts, method: 'PATCH' })
  }

  trace(url, opts = {}) {
    return this.call(url, { ...opts, method: 'TRACE' })
  }

  async call(url, { data, method = 'POST', headers = {}, ...rest }) {
    if (rest.url) {
      throw new Error(
        'saasify-faas-sdk found invalid use of "url": suggest using the second parameter { data: { url } }'
      )
    }

    const hasBody = httpMethodsWithBodies.has(method.toLowerCase())
    const authHeaders = {}
    const payload = {}

    if (this._token) {
      authHeaders.authorization = this._token
    }

    if (data !== undefined) {
      if (hasBody) {
        payload.data = data
      } else {
        payload.params = data
      }
    }

    if (this._targetUrl) {
      headers['x-saasify-target'] = this._targetUrl
    }

    const options = {
      baseURL: this._baseUrl,
      url,
      method,
      headers: {
        'content-type': 'application/json',
        ...authHeaders,
        ...headers
      },
      responseType: 'arraybuffer',
      validateStatus: (status) => true,
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
      ...payload,
      ...rest
    }

    const res = await axios.request(options)

    if (res.status === 429) {
      return { hitRateLimit: true, response: res }
    }

    const contentType = res.headers['content-type'] || defaultContentType
    const contentTypeParsed = parseContentType(contentType)

    let body = Buffer.from(res.data, 'binary')

    // TODO: switch to use type-is package here
    if (contentType.startsWith('text/')) {
      body = body.toString()
    } else if (contentType.startsWith('application/json')) {
      body = JSON.parse(body.toString())
    } else if (contentType.startsWith('image/')) {
      // return raw binary buffer as-is
    } else {
      // TODO: gracefully handle other content-types
    }

    if (res.status >= 200 && res.status < 300) {
      return {
        body,
        contentType,
        contentTypeParsed,
        response: res
      }
    } else {
      const message =
        typeof body === 'string'
          ? body
          : `Request failed with status code ${res.status}`
      const err = new Error(message)
      err.response = res
      throw err
    }
  }
}
