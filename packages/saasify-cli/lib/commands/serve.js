'use strict'

const ftsHttp = require('fts-http')
const path = require('path')
const tempy = require('tempy')

const handleError = require('../handle-error')
const parseProject = require('../parse-project')

module.exports = (program, client) => {
  program
    .command('serve [path]')
    .description('Serves a project via a local http server')
    .option('-p, --port <port>', 'Port to listen on', 4000, (s) => parseInt(s))
    .action(async (arg, opts) => {
      if (arg) program.config = arg

      try {
        const outDir = tempy.directory()
        const project = await parseProject(program, {
          compilerOptions: {
            outDir
          },
          emit: true
        })

        console.log(JSON.stringify(project, null, 2))

        // TODO: support multiple services
        const service = project.services[0]
        const { name } = path.parse(service.src)
        const jsFilePath = path.join(outDir, `${name}.js`)
        const handler = ftsHttp.createHttpHandler(service.definition, jsFilePath)

        await ftsHttp.createHttpServer(handler, opts.port)
      } catch (err) {
        handleError(err)
      }
    })
}
