'use strict'

const clipboard = require('clipboardy')
const { parseFaasIdentifier } = require('fin-utils')

const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('subscribe <project>')
    .description('Subscribes to a project (requires a valid billing source)')
    .action(async (identifier, opts) => {
      program.requireAuthentication()

      try {
        const parsedFaas = parseFaasIdentifier(identifier, {
          namespace: client.user.username
        })

        if (!parsedFaas) {
          throw new Error(`Invalid project identifier [${identifier}]`)
        }

        const { projectId: project } = parsedFaas

        const consumer = await spinner(
          client.createConsumer({ project }),
          `Creating subscription to project [${project}]`
        )

        if (program.clipboard) {
          clipboard.writeSync(consumer.token)
        }

        console.log(JSON.stringify(consumer, null, 2))
      } catch (err) {
        handleError(err)
      }
    })
}
