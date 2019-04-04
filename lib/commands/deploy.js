'use strict'

const clipboard = require('clipboardy')

const handleError = require('../handle-error')
const parseDeployment = require('../parse-deployment')
const spinner = require('../spinner')
const zipDeployment = require('../zip-deployment')

module.exports = (program, client) => {
  program
    .command('deploy [path]')
    .description('Creates a new deployment')
    .option('-f, --force', 'Force the creation of a new deployment', false)
    .action(async (arg, opts) => {
      if (arg) program.config = arg
      program.requireAuthentication()

      try {
        const deployment = await parseDeployment(program)
        if (program.debug) {
          console.log(JSON.stringify(deployment, null, 2))
        }

        const zipBuffer = await zipDeployment(program, deployment)

        const result = await spinner(
          client.createDeployment({
            ...deployment,
            force: opts.force,
            data: zipBuffer.toString('base64')
          }),
          'Creating deployment'
        )

        if (program.clipboard) {
          clipboard.writeSync(result.url)
        }

        console.log(JSON.stringify(result, null, 2))
      } catch (err) {
        handleError(err)
      }
    })
}
