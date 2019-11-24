'use strict'

const auth = require('../auth')
const authWithGitHub = require('../auth-github')
const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('login')
    .alias('signin')
    .description('Logs into your account')
    .option('-e, --email <email>', 'account email')
    .option('-u, --username <username>', 'account username')
    .option('-p, --password <password>', 'account password')
    .action(async (opts) => {
      try {
        let result

        if (!opts.username) {
          opts.username = opts.email
        }

        if (!opts.username) {
          result = await spinner(
            authWithGitHub(client),
            'Authenticating with GitHub'
          )
        } else {
          result = await module.exports.signin(opts, client)
        }

        const { user, token } = result
        auth.signin({ user, token })

        program.appendOutput(JSON.stringify(user, null, 2))
      } catch (err) {
        handleError(program, err)
      }
    })
}

module.exports.signin = async (opts, client) => {
  const { username, password } = opts

  // TODO: validate username and password
  return client.signin({ username, password })
}
