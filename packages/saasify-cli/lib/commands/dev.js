'use strict'

const { prepareDeployment } = require('saasify-utils')
const tempy = require('tempy')

const handleError = require('../handle-error')
const parseProject = require('../parse-project')
const spinner = require('../spinner')
const zipProject = require('../zip-project')
const serveProjectLocal = require('../serve-project-local')
const now = require('../services/now')

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
          tempDir
        })
        if (program.debug) {
          console.log(JSON.stringify(project, null, 2))
        }

        await serveProjectLocal(program, project, {
          ...opts,
          tempDir
        })
      } catch (err) {
        handleError(program, err)
      }
    })
}
