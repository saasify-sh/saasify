'use strict'

const axios = require('axios')
const contentType = require('content-type')
const qs = require('qs')

const defaultContentType = 'application/octet-stream'

module.exports = class SaasifySDK {
  constructor(opts = {}) {
    if (typeof opts === 'string') {
      this._token = token
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

  post(url, opts = {}) {
    return this.call(url, { ...opts, method: 'POST' })
  }

  get(url, opts = {}) {
    return this.call(url, { ...opts, method: 'GET' })
  }

  async call(url, { data, method = 'POST', headers = {}, ...rest }) {
    const isPost = method === 'POST' || method === 'post'
    const authHeaders = {}
    const payload = {}

    if (this._token) {
      authHeaders.authorization = this._token
    }

    if (isPost) {
      payload.data = data
    } else {
      payload.params = data
    }

    const options = {
      method: isPost ? 'POST' : 'GET',
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

    try {
      const res = await axios.request(options)

      if (res.status === 429) {
        return { hitRateLimit: true, response: res }
      }

      const contentTypeHeader =
        res.headers['content-type'] || defaultContentType
      const parsedContentType = contentType.parse(contentTypeHeader)
      const outputContentType = parsedContentType
        ? parsedContentType.type
        : defaultContentType

      let output = Buffer.from(res.data, 'binary')

      if (outputContentType.startsWith('text/')) {
        output = output.toString()
      } else if (outputContentType.startsWith('application/json')) {
        output = JSON.parse(output.toString())
      } else if (outputContentType.startsWith('image/')) {
        // return raw binary buffer as-is
      } else {
        // TODO: gracefully handle other content-types
      }

      return {
        output,
        outputContentType,
        response: res
      }
    } catch (e) {
      return { outputError: e.message }
    }
  }
}
