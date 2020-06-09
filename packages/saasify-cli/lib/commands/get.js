'use strict'

const { parseFaasIdentifier } = require('saasify-utils')

const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('get <id>')
    .description('Gets details for a specific deployment')
    .action(async (arg, opts) => {
      program.requireAuthentication()

      try {
        const parsedFaas = parseFaasIdentifier(arg, {
          namespace: client.teamSlug || client.user.username
        })

        if (!parsedFaas) {
          throw new Error(`Invalid saasify identifier [${arg}]`)
        }

        const { deploymentId } = parsedFaas

        const deployment = await spinner(
          client.getDeployment(deploymentId, {
            populate: 'project'
          }),
          `Fetching deployment [${deploymentId}]`
        )

        program.writeOutput(JSON.stringify(deployment, null, 2))

        if (program.output) {
          console.error(`Output written to ${program.output}`)
        }
      } catch (err) {
        handleError(program, err)
      }
    })
}
