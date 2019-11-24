'use strict'

const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('secrets <command> [name] [value]')
    .description(' Manages your secret environment variables')
    .action(async (cmd, name, value) => {
      program.requireAuthentication()

      try {
        switch (cmd) {
          case 'ls': {
            const secrets = await spinner(
              client.listSecrets(),
              'Getting secrets'
            )

            program.appendOutput(JSON.stringify(secrets, null, 2))
            break
          }

          case 'add': {
            const secret = await spinner(
              client.addSecret(name, value),
              'Creating secret'
            )
            program.appendOutput(JSON.stringify(secret, null, 2))
            break
          }

          case 'rm': {
            if (!name) {
              console.error(
                'error: you must specify the name of an existing secret to remove'
              )
              process.exit(1)
            }

            const secret = await spinner(
              client.removeSecret(name),
              'Removing secret'
            )
            program.appendOutput(JSON.stringify(secret, null, 2))
            break
          }

          case 'rename': {
            if (!name) {
              console.error(
                'error: you must specify the name of an existing secret to rename'
              )
              process.exit(1)
            }

            const secret = await spinner(
              client.renameSecret(name, value),
              'Renaming secret'
            )
            program.appendOutput(JSON.stringify(secret, null, 2))
            break
          }

          default: {
            if (!cmd) {
              console.error(
                'error: must specify a command (ls, add, rm, or rename)'
              )
            } else {
              console.error(
                `error: invalid command [${cmd}] (ls, add, rm, or rename)`
              )
            }

            process.exit(1)
          }
        }
      } catch (err) {
        handleError(program, err)
      }
    })
}
