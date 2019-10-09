'use strict'

const { prepareDeployment } = require('saasify-utils')

const handleError = require('../handle-error')
const parseProject = require('../parse-project')
const spinner = require('../spinner')
const zipProject = require('../zip-project')

const now = require('../services/now')

module.exports = (program, client) => {
  program
    .command('dev [path]')
    .description('Starts a local dev server for debugging your deployments')
    .option('-l, --listen <uri>', 'Specify a URI endpoint on which to listen')
    .action(async (arg, opts) => {
      if (arg) program.config = arg

      try {
        const project = await parseProject(program)
        if (program.debug) {
          console.log(JSON.stringify(project, null, 2))
        }

        const zipBuffer = await zipProject(program, project, true)

        const tempDir = await spinner(
          prepareDeployment({
            ...project,
            project: `localhost/${project.name}`
          }, zipBuffer),
          'Preparing deployment'
        )

        const hasListen = (opts.listen !== undefined)
        const args = [
          program.debug && '--debug',
          hasListen && '--listen',
          hasListen && opts.listen,
          tempDir
        ]

        // TODO: ZEIT now includes caching between successive runs which we lose
        // by always creating a fresh tempDir
        await now('dev', args, { cwd: tempDir })
      } catch (err) {
        handleError(err)
      }
    })
}
