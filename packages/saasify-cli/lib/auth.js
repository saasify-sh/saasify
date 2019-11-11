'use strict'

const conf = require('./config')

const keyTeamId = 'teamId'
const keyTeamSlug = 'teamSlug'
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
      user: conf.get(keyUser),
      teamId: conf.get(keyTeamId),
      teamSlug: conf.get(keyTeamSlug)
    }
  } else {
    return {}
  }
}

exports.signin = ({ token, user }) => {
  conf.set(keyToken, token)
  conf.set(keyUser, user)
  conf.delete(keyTeamId)
  conf.delete(keyTeamSlug)
}

exports.signout = () => {
  conf.delete(keyToken)
  conf.delete(keyUser)
  conf.delete(keyTeamId)
  conf.delete(keyTeamSlug)
}

exports.switchTeam = (team) => {
  if (team && team.id) {
    conf.set(keyTeamId, team.id)
    conf.set(keyTeamSlug, team.slug)
  } else {
    conf.delete(keyTeamId)
    conf.delete(keyTeamSlug)
  }
}
