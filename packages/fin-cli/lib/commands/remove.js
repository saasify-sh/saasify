'use strict'

const { Confirm } = require('enquirer')
const pluralize = require('pluralize')
const pMap = require('p-map')

const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('rm [deploymentId|deploymentUrl...]')
    .alias('remove')
    .description('Removes deployments')
    .option('-y, --yes', 'Skip confirmation')
    .option('-s, --safe', 'Skip deployments with an active alias')
    .action(async (args, opts) => {
      program.requireAuthentication()

      try {
        const deploymentsLabel = pluralize('deployment', args.length)
        const deployments = await spinner(
          client.resolveDeployments(args),
          `Resolving ${deploymentsLabel}`
        )

        if (!deployments.length) {
          console.log(`Error no ${deploymentsLabel} found matching input`)
          process.exit(1)
        }

        if (!opts.yes) {
          console.log(`${deploymentsLabel}:`, deployments.map((d) => d.id).join(', '))

          const prompt = new Confirm({
            message: `Are you sure you want to delete these ${deployments.length} ${deploymentsLabel}?`,
            initial: true
          })

          const answer = await prompt.run()
          if (!answer) {
            process.exit(1)
          }
        }

        await spinner(
          pMap(deployments, (deployment) => {
            return client.removeDeployment(deployment.id, {
              safe: opts.safe
            })
          }, {
            concurrency: 1
          }),
          `Removing ${deployments.length} ${deploymentsLabel}`
        )

        console.log(`Deleted ${deployments.length} ${deploymentsLabel}`)
      } catch (err) {
        handleError(err)
      }
    })
}
