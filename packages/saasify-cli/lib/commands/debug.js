'use strict'

const handleError = require('../handle-error')
const parseProject = require('../parse-project')

module.exports = (program, client) => {
  program
    .command('debug [path]')
    .description('Prints information about a local project')
    .action(async (arg) => {
      if (arg) program.config = arg

      try {
        const project = await parseProject(program)

        console.log(JSON.stringify(project, null, 2))
      } catch (err) {
        handleError(err)
      }
    })
}
