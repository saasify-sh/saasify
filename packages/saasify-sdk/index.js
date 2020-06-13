'use strict'

const SaasifyFaasSDK = require('saasify-faas-sdk')

const isProd = process.env.NODE_ENV === 'production'

module.exports = class SaasifySDK {
  constructor(opts = {}) {
    const {
      projectId,
      deploymentId,
      baseUrl,
      developmentTargetUrl,
      log = console.log.bind(console)
    } = opts

    if (!projectId) {
      throw new Error(
        'SaasifySDK error: missing required parameter "projectId"'
      )
    }

    this._baseUrl = baseUrl
    this._log = log

    this._projectId = projectId
    this._deploymentId = deploymentId || `${projectId}@dev`
    this._developmentTargetUrl = developmentTargetUrl

    this._project = null
    this._deployment = null
    this._consumer = null
    this._token = null
    this._api = null
  }

  _init(data, resolve, reject) {
    this._project = data.project
    this._deployment = data.deployment
    this._consumer = data.consumer

    if (this._consumer) {
      this._token = this._consumer.token
    } else {
      this._token = data.token
    }

    if (!this._token) {
      return reject(new Error('SaasifySDK error: missing valid auth "token"'))
    }

    this._api = new SaasifyFaasSDK({
      baseUrl: this._baseUrl,
      token: this._token,
      targetUrl: isProd ? undefined : this._developmentTargetUrl,
      deploymentId: this._deployment ? this._deployment.id : this._deploymentId,
      projectId: this._project ? this._project.id : this._projectId
    })
  }

  get api() {
    return this._api
  }

  get project() {
    return this._project
  }

  get deployment() {
    return this._deployment
  }

  get consumer() {
    return this._consumer
  }

  get token() {
    return this._token
  }
}
