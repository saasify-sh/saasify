'use strict'

const { Confirm } = require('enquirer')
const handleError = require('../handle-error')
const spinner = require('../spinner')
const validators = require('../validators')

module.exports = (program, client) => {
  program
    .command('unsubscribe <project>')
    .description('Unsubscribes from a project')
    .option('-y, --yes', 'Skip confirmation')
    .action(async (project, opts) => {
      program.requireAuthentication()

      try {
        // TODO: call client.resolveDeployments or use fin-utils

        if (!validators.project(project)) {
          throw new Error(`Invalid project name [${project}] (regex ${validators.projectRe})`)
        }

        const [ consumer ] = await spinner(
          client.resolveConsumers([ project ]),
          `Resolving subscription for [${project}]`
        )

        if (!opts.yes) {
          const prompt = new Confirm({
            message: `Are you sure you want to unsubscribe from project [${consumer.project}]?`,
            initial: true
          })

          const answer = await prompt.run()
          if (!answer) {
            process.exit(1)
          }
        }

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
