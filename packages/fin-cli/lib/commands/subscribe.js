'use strict'

const clipboard = require('clipboardy')

const handleError = require('../handle-error')
const spinner = require('../spinner')
const validators = require('../validators')

module.exports = (program, client) => {
  program
    .command('subscribe <project>')
    .description('Subscribes to a project (requires a valid billing source)')
    .action(async (project, opts) => {
      program.requireAuthentication()

      try {
        // TODO: call client.resolveDeployments

        if (!validators.project(project)) {
          throw new Error(`Invalid project name [${project}] (regex ${validators.projectRe})`)
        }

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
