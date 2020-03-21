'use strict'

const SaasifyFaasSDK = require('saasify-faas-sdk')

module.exports = class SaasifySDK {
  constructor(opts = {}) {
    const {
      projectId,
      defaults,
      timeout = 10000,
      target = window && window.parent,
      log = console.log.bind(console)
    } = opts

    this._log = log

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

            log('iframe message event', event)

            try {
              const message = JSON.parse(event.data)
              log('iframe message data', message)

              if (message.type !== 'saasify-sdk:init') {
                return
              }

              clearTimeout(initTimeout)
              this._init(message.data, resolve, reject)
            } catch (err) {
              log.warn('iframe message error', err)
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
        this._log('SaasifySDK no iframe found - using defaults')

        if (!defaults) {
          throw new Error(
            'SaasifySDK error: no iframe found - missing required parameter "defaults"'
          )
        }

        this._init(defaults, resolve, reject)
      }
    })
  }

  _init(data, resolve, reject) {
    if (!data.project) {
      return reject(new Error('SaasifySDK error: missing "project"'))
    }

    if (!data.deployment) {
      return reject(new Error('SaasifySDK error: missing "deployment"'))
    }

    if (!data.consumer) {
      return reject(new Error('SaasifySDK error: missing "consumer"'))
    }

    this._project = data.project
    this._deployment = data.deployment
    this._consumer = data.consumer

    resolve({
      project: this._project,
      deployment: this._deployment,
      consumer: this._consumer
    })
  }

  get ready() {
    return this._ready
  }

  get sdk() {
    return this.ready.then(() => {
      if (!this._sdk) {
        this._sdk = new SaasifyFaasSDK({
          token: this._consumer.token,
          deployment: this._deployment.id
        })
      }

      return this._sdk
    })
  }

  get project() {
    return this.ready.then(() => this._project)
  }

  get deployment() {
    return this.ready.then(() => this._deployment)
  }

  get consumer() {
    return this.ready.then(() => this._consumer)
  }
}
