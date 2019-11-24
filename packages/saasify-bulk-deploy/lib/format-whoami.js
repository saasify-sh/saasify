'use strict'

module.exports = function formatWhoami({ user, team }) {
  if (team) {
    return `team "${team}"`
  } else {
    return `user "${user.username}"`
  }
}
