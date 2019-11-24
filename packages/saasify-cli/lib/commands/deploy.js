'use strict'

const clipboard = require('clipboardy')

const handleError = require('../handle-error')
const parseProject = require('../parse-project')
const spinner = require('../spinner')
const zipProject = require('../zip-project')

module.exports = (program, client) => {
  program
    .command('deploy [path]')
    .description('Creates a new deployment')
    .option('-f, --force', 'Force the creation of a new deployment', false)
    .action(async (arg, opts) => {
      if (arg) program.config = arg
      program.requireAuthentication()

      try {
        const project = await parseProject(program)
        if (program.debug) {
          console.error(JSON.stringify(project, null, 2))
        }

        const zipBuffer = await zipProject(program, project)

        const result = await spinner(
          client.createDeployment({
            ...project,
            force: opts.force,
            debug: !!program.debug,
            data: zipBuffer.toString('base64')
          }),
          'Creating deployment'
        )

        if (program.clipboard) {
          clipboard.writeSync(result.url)
        }

        program.appendOutput(JSON.stringify(result, null, 2))
      } catch (err) {
        handleError(program, err)
      }
    })
}
