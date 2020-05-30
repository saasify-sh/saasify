import { autorun, computed, observable } from 'mobx'
import debug from 'lib/debug'

import API from 'lib/api'
import LocalStore from 'store/LocalStore'

import { githubConfig } from 'lib/oauth'

const AUTH_STORE_KEY = 'SaasifyAuth'

class AuthManagerClass {
  @observable
  auth = null

  @observable
  consumer = null

  @observable
  context = null

  @computed get user() {
    return this.auth && this.auth.user
  }

  @observable
  isBootstrapping = true

  @computed get isAuthenticated() {
    return !!this.auth
  }

  constructor() {
    this._bootstrappingP = new Promise((resolve) => {
      LocalStore.get(AUTH_STORE_KEY).then(
        (auth) => {
          this.auth = auth
          this.isBootstrapping = false
          setTimeout(resolve)
        },
        () => {
          this.isBootstrapping = false
          setTimeout(resolve)
        }
      )
    })
  }

  get bootstrappingP() {
    return this._bootstrappingP
  }

  async signin(opts) {
    debug(`AuthManager.signin [${opts.username}]`)

    const auth = await API.signin({ ...this.context, ...opts })

    if (opts.remember !== false) {
      await LocalStore.set(AUTH_STORE_KEY, auth)
    }

    this.auth = auth
  }

  async signup(opts) {
    debug(`AuthManager.signup [${opts.email}] [${opts.username}]`)

    const auth = await API.signup({ ...this.context, ...opts })
    await LocalStore.set(AUTH_STORE_KEY, auth)
    this.auth = auth
  }

  async signupForBeta(opts) {
    debug(`AuthManager.signupForBeta [${opts.email}] [${opts.name}]`)

    return API.signupForBeta({ ...this.context, ...opts })
  }

  async signout() {
    debug('AuthManager.signout')

    API.signout()
    await LocalStore.remove(AUTH_STORE_KEY)

    this.auth = null
  }

  async authWithGitHub(opts) {
    debug('AuthManager.authWithGitHub')
    await this._bootstrappingP

    const auth = await API.authWithGitHub({
      ...this.context,
      ...githubConfig,
      ...opts
    })

    await LocalStore.set(AUTH_STORE_KEY, auth)
    this.auth = auth
  }

  async authWithGoogle(opts) {
    debug('AuthManager.authWithGoogle')
    await this._bootstrappingP

    const auth = await API.authWithGoogle({
      ...this.context,
      ...opts
    })

    await LocalStore.set(AUTH_STORE_KEY, auth)
    this.auth = auth
  }

  async authWithSpotify(opts) {
    debug('AuthManager.authWithSpotify')
    await this._bootstrappingP

    const auth = await API.authWithSpotify({
      ...this.context,
      ...opts
    })

    await LocalStore.set(AUTH_STORE_KEY, auth)
    this.auth = auth
  }

  async authWithLinkedIn(opts) {
    debug('AuthManager.authWithLinkedIn')
    await this._bootstrappingP

    const auth = await API.authWithLinkedIn({
      ...this.context,
      ...opts
    })

    await LocalStore.set(AUTH_STORE_KEY, auth)
    this.auth = auth
  }

  async authWithTwitter(opts) {
    debug('AuthManager.authWithTwitter')
    await this._bootstrappingP

    const auth = await API.authWithTwitter({
      ...this.context,
      ...opts
    })

    await LocalStore.set(AUTH_STORE_KEY, auth)
    this.auth = auth
  }

  async authWithStripe(opts) {
    debug('AuthManager.authWithStripe')
    await this._bootstrappingP

    const auth = await API.authWithStripe({
      ...this.context,
      ...opts
    })

    await LocalStore.set(AUTH_STORE_KEY, auth)
    this.auth = auth
  }
}

export const AuthManager = observable(new AuthManagerClass())

// keep API authentication in sync with AuthManager state
autorun(() => {
  API.user = AuthManager.auth && AuthManager.auth.user
  API.token = AuthManager.auth && AuthManager.auth.token
})

export default AuthManager
