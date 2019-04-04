'use strict'

const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('logs <url|deploymentid>')
    .description('Prints the logs for the given deployment')
    .option('-a, --all', 'Include access logs', false)
    .option('-n, --number <number>', 'Number of logs', 100, (s) => parseInt(s))
    .option('-q, --query <query>', 'Search query')
    .option('--since <date>', 'Only return logs after date (ISO 8601)')
    .option('--until <date>', 'Only return logs before date (ISO 8601)')
    .action(async (arg, opts) => {
      program.requireAuthentication()

      try {
        const logs = await spinner(
          client.getLogs(arg, {
            all: opts.all,
            number: opts.number,
            query: opts.query,
            since: opts.since,
            until: opts.until
          }),
          `Fetching logs for deployment [${arg}]`
        )

        console.log(logs)
      } catch (err) {
        handleError(err)
      }
    })
}
