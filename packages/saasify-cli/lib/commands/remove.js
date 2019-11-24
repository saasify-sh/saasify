'use strict'

const { Confirm } = require('enquirer')
const pluralize = require('pluralize')
const pMap = require('p-map')
const { parseFaasIdentifier } = require('saasify-utils')

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
        const parsedArgs = args.map((identifier) =>
          parseFaasIdentifier(identifier, {
            namespace: client.user.username
          })
        )

        const invalid = args.filter((_, index) => !parsedArgs[index])

        if (invalid.length) {
          const invalidLabel = pluralize('deployment', invalid.length)
          console.error(`Error invalid ${invalidLabel} [${invalid.join(', ')}]`)
          process.exit(1)
        }

        // TODO: if any projects are specified without deployment version info, then
        // expand them out to include all deployments in those projects

        // TODO: currently if you specify a project, it'll do project@latest...

        const deployments = parsedArgs.map(({ deploymentId }) => deploymentId)

        if (!opts.yes) {
          console.error(`${deploymentsLabel}:`, deployments.join(', '))

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
          pMap(
            deployments,
            (deploymentId) => {
              return client.removeDeployment(deploymentId, {
                safe: opts.safe
              })
            },
            {
              concurrency: 1
            }
          ),
          `Removing ${deployments.length} ${deploymentsLabel}`
        )

        program.appendOutput(
          `Deleted ${deployments.length} ${deploymentsLabel}`
        )
      } catch (err) {
        handleError(program, err)
      }
    })
}
