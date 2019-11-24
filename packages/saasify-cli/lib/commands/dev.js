'use strict'

const tempy = require('tempy')

const handleError = require('../handle-error')
const parseProject = require('../parse-project')
const serveProjectLocal = require('../serve-project-local')

module.exports = (program, client) => {
  program
    .command('dev [path]')
    .description('Starts a local dev server for debugging your deployments')
    .option('-l, --listen <uri>', 'Specify a URI endpoint on which to listen')
    .action(async (arg, opts) => {
      if (arg) program.config = arg

      try {
        const tempDir = tempy.directory()
        const project = await parseProject(program, {
          serveProjectLocal: false,
          tempDir
        })

        if (program.debug) {
          program.appendOutput(JSON.stringify(project, null, 2))
        }

        const serve = await serveProjectLocal(program, project, {
          ...opts,
          tempDir
        })

        await serve()
      } catch (err) {
        handleError(program, err)
      }
    })
}
