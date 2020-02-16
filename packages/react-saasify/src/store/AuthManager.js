import { autorun, computed, observable } from 'mobx'
import debug from 'lib/debug'

import API from 'lib/api'
import LocalStore from 'store/LocalStore'

import { config as githubConfig } from 'lib/auth-github'

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
    LocalStore.get(AUTH_STORE_KEY).then(
      (auth) => {
        this.auth = auth
        this.isBootstrapping = false
      },
      () => {
        this.isBootstrapping = false
      }
    )
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
    const auth = await API.authWithGitHub({
      ...this.context,
      ...githubConfig,
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
