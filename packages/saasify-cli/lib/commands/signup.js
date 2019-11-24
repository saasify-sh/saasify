'use strict'

const auth = require('../auth')
const authWithGitHub = require('../auth-github')
const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('signup')
    .description('Creates a new account')
    .option('-e, --email <email>', 'account email')
    .option('-u, --username <username>', 'account username')
    .option('-p, --password <password>', 'account password')
    .action(async (opts) => {
      try {
        let result

        if (!opts.email && !opts.username) {
          result = await spinner(
            authWithGitHub(client),
            'Authenticating with GitHub'
          )
        } else {
          result = await module.exports.signup(opts, client)
        }

        const { user, token } = result
        auth.signin({ user, token })
        program.appendOutput(JSON.stringify(user, null, 2))
      } catch (err) {
        handleError(program, err)
      }
    })
}

module.exports.signup = async (opts, client) => {
  const { email, username, password } = opts

  // TODO: validate email, username and password
  return client.signup({ email, username, password })
}
