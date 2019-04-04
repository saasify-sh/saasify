'use strict'

const handleError = require('../handle-error')
const parseDeployment = require('../parse-deployment')

module.exports = (program, client) => {
  program
    .command('debug [path]')
    .description('Prints information about a local deployment')
    .action(async (arg) => {
      if (arg) program.config = arg

      try {
        const deployment = await parseDeployment(program)

        console.log(JSON.stringify(deployment, null, 2))
      } catch (err) {
        handleError(err)
      }
    })
}
