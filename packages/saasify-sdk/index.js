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

module.exports = class SaasifySDK {
  constructor(opts = {}) {
    if (typeof opts === 'string') {
      this._token = opts
    } else {
      const { token } = opts
      this._token = token
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

    const options = {
      method,
      url,
      headers: {
        'content-type': 'application/json',
        ...authHeaders,
        ...headers
      },
      responseType: 'arraybuffer',
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 429,
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

    return {
      body,
      contentType,
      contentTypeParsed,
      response: res
    }
  }
}
