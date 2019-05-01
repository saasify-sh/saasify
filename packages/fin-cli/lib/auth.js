'use strict'

const Conf = require('conf')
const conf = new Conf({
  projectName: 'fin'
})

const keyToken = 'token'
const keyUser = 'user'

exports.isAuthenticated = () => {
  return conf.has(keyToken)
}

exports.assertIsAuthenticated = () => {
  if (!exports.isAuthenticated()) {
    throw new Error('Operation requires authentication')
  }
}

exports.get = () => {
  if (exports.isAuthenticated()) {
    return {
      token: conf.get(keyToken),
      user: conf.get(keyUser)
    }
  } else {
    return { }
  }
}

exports.signin = ({ token, user }) => {
  conf.set(keyToken, token)
  conf.set(keyUser, user)
}

exports.signout = () => {
  conf.delete(keyToken)
  conf.delete(keyUser)
}
