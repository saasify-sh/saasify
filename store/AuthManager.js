import { autorun, computed, observable } from 'mobx'
import debug from 'lib/debug'

import API from 'lib/api'
import LocalStore from 'store/LocalStore'

import { config as githubConfig } from 'lib/auth-github'

const AUTH_STORE_KEY = 'FinAuth'

class AuthManager {
  @observable
  auth = null

  @computed get user() {
    return this.auth && this.auth.user
  }

  @observable
  isBootstrapping = true

  @computed get isAuthenticated() {
    return !!this.auth
  }

  constructor() {
    LocalStore.get(AUTH_STORE_KEY)
      .then((auth) => {
        this.auth = auth
        this.isBootstrapping = false
      }, () => {
        this.isBootstrapping = false
      })
  }

  async signin(opts) {
    debug(`AuthManager.signin "${opts.username}"`)

    const auth = await API.signin(opts)

    if (opts.remember !== false) {
      await LocalStore.set(AUTH_STORE_KEY, auth)
    }

    this.auth = auth
  }

  async signup(opts) {
    debug(`AuthManager.signup "${opts.email}" "${opts.username}"`)

    const auth = await API.signup(opts)
    await LocalStore.set(AUTH_STORE_KEY, auth)
    this.auth = auth
  }

  async signout() {
    debug(`AuthManager.signout`)

    API.signout()
    await LocalStore.remove(AUTH_STORE_KEY)

    this.auth = null
  }

  async authWithGitHub(opts) {
    debug(`AuthManager.authWithGitHub`)
    const auth = await API.authWithGitHub({
      ...githubConfig,
      ...opts
    })

    await LocalStore.set(AUTH_STORE_KEY, auth)
    this.auth = auth
  }

  async authWithFacebook(opts) {
    debug(`AuthManager.authWithFacebook`)
    const auth = await API.authWithFacebook(opts)

    await LocalStore.set(AUTH_STORE_KEY, auth)
    this.auth = auth
  }
}

const authManager = observable(new AuthManager())

autorun(() => {
  API.user = authManager.auth && authManager.auth.user
  API.token = authManager.auth && authManager.auth.token
})

export default authManager
