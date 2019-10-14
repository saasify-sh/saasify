'use strict'

const handleError = require('../handle-error')

module.exports = (program, client) => {
  program
    .command('whoami')
    .description('Prints information about the current user')
    .action(async (arg, opts) => {
      program.requireAuthentication()

      try {
        console.log(client.user)
      } catch (err) {
        handleError(program, err)
      }
    })
}
