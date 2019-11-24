'use strict'

const handleError = require('../handle-error')

module.exports = (program, client) => {
  program
    .command('whoami')
    .description('Prints information about the current user')
    .action(async (arg, opts) => {
      program.requireAuthentication()

      try {
        program.appendOutput(
          JSON.stringify({ user: client.user, team: client.teamSlug }, null, 2)
        )
      } catch (err) {
        handleError(program, err)
      }
    })
}
