'use strict'

const auth = require('../auth')
const handleError = require('../handle-error')

module.exports = (program, client) => {
  program
    .command('login')
    .description('Logs into your account')
    .option('-e, --email <email>', 'account email')
    .option('-u, --username <username>', 'account username')
    .option('-p, --password <password>', 'account password')
    .action(async (opts) => {
      try {
        if (!opts.username) {
          opts.username = opts.email
        }

        const { user, token } = await module.exports.signin(opts, client)
        auth.signin({ user, token })

        console.log(JSON.stringify(user, null, 2))
      } catch (err) {
        handleError(err)
      }
    })
}

module.exports.signin = async (opts, client) => {
  const { username, password } = opts

  // TODO: validate username and password
  return client.signin({ username, password })
}
