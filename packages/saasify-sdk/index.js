'use strict'

const SaasifyFaasSDK = require('saasify-faas-sdk')
// require('iframe-resize/js/iframeResizer.contentWindow.js')

const isBrowser = typeof window !== 'undefined'
const isProd = process.env.NODE_ENV === 'production'

module.exports = class SaasifySDK {
  constructor(opts = {}) {
    const {
      projectId,
      deploymentId,
      baseUrl,
      developmentToken,
      developmentTargetUrl,
      timeout = 10000,
      target = isBrowser && window.parent !== window && window.parent,
      log = console.log.bind(console)
    } = opts

    this._baseUrl = baseUrl
    this._log = log

    this._projectId = projectId
    this._deploymentId = deploymentId
    this._developmentTargetUrl = developmentTargetUrl

    this._project = null
    this._deployment = null
    this._consumer = null
    this._token = null
    this._api = null

    this._ready = new Promise((resolve, reject) => {
      if (target) {
        this._log('SaasifySDK initializing iframe')

        if (!projectId) {
          throw new Error(
            'SaasifySDK error: missing required parameter "projectId"'
          )
        }

        const initTimeout = setTimeout(() => {
          reject(new Error('SaasifySDK error: timeout initializing iframe'))
        }, timeout)

        window.addEventListener(
          'message',
          (event) => {
            if (event.source !== target) {
              return
            }

            try {
              const message = JSON.parse(event.data)
              log('iframe message data', message)

              if (message.type !== 'saasify-sdk:init') {
                return
              }

              clearTimeout(initTimeout)
              this._init(message.data, resolve, reject)
            } catch (err) {
              // ignore errors
            }
          },
          false
        )

        const message = JSON.stringify({
          type: 'saasify-sdk:init',
          data: {
            projectId
          }
        })

        target.postMessage(message, '*')
      } else {
        if (!developmentToken) {
          throw new Error(
            'SaasifySDK error: no iframe context found - missing required parameter "developmentToken"'
          )
        }

        this._log(
          'SaasifySDK no iframe context found - using development token'
        )
        this._init(
          {
            token: developmentToken
          },
          resolve,
          reject
        )
      }
    })
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

    resolve({
      project: this._project,
      deployment: this._deployment,
      consumer: this._consumer,
      token: this._token
    })
  }

  get ready() {
    return this._ready
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
