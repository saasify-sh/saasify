'use strict'

const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('logs <url|deployment>')
    .description('Prints the logs for a given deployment')
    .option('-a, --all', 'Include access logs', false)
    .option('-n, --number <number>', 'Number of logs', 100, (s) => parseInt(s))
    .option('-q, --query <query>', 'Search query')
    .option('--since <date>', 'Only return logs after date (ISO 8601)')
    .option('--until <date>', 'Only return logs before date (ISO 8601)')
    .action(async (identifier, opts) => {
      program.requireAuthentication()

      try {
        const logs = await spinner(
          client.getLogs(identifier, {
            all: opts.all,
            number: opts.number,
            query: opts.query,
            since: opts.since,
            until: opts.until
          }),
          `Fetching logs for deployment [${identifier}]`
        )

        program.appendOutput(logs)
      } catch (err) {
        handleError(program, err)
      }
    })
}
