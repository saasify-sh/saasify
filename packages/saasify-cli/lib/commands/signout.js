'use strict'

const auth = require('../auth')
const handleError = require('../handle-error')

module.exports = (program, client) => {
  program
    .command('logout')
    .alias('signout')
    .description('Logs out of your account')
    .action(async () => {
      try {
        auth.signout()
      } catch (err) {
        handleError(program, err)
      }
    })
}
