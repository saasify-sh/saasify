'use strict'

const handleError = require('../handle-error')
const spinner = require('../spinner')
const validators = require('../validators')

module.exports = (program, client) => {
  program
    .command('unsubscribe <project>')
    .description('Unsubscribes from a project')
    .action(async (project, opts) => {
      program.requireAuthentication()

      try {
        if (!validators.project(project)) {
          throw new Error(`Invalid project name [${project}] (regex ${validators.projectRe})`)
        }

        const [ consumer ] = await spinner(
          client.resolveConsumers([ project ]),
          `Resolving subscription for [${project}]`
        )

        // TODO: prompt for confirmation

        await spinner(
          client.removeConsumer(consumer),
          `Cancelling subscription to project [${consumer.project}]`
        )

        console.log(`Successfully unsubscribed from project [${project}]`)
      } catch (err) {
        handleError(err)
      }
    })
}
