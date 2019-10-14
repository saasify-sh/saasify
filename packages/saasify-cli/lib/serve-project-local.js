'use strict'

const { prepareDeployment } = require('saasify-utils')
const tempy = require('tempy')

const spinner = require('./spinner')
const zipProject = require('./zip-project')

const now = require('./services/now')

module.exports = async (program, project, opts = { }) => {
  const {
    tempDir = tempy.directory(),
    listen,
    ...rest
  } = opts

  const zipBuffer = await zipProject(program, project, true)

  await spinner(
    prepareDeployment({
      ...project,
      project: `localhost/${project.name}`
    }, zipBuffer, {
      tempDir
    }),
    'Preparing deployment'
  )

  const hasListen = (listen !== undefined)
  const args = [
    program.debug && '--debug',
    hasListen && '--listen',
    hasListen && listen,
    tempDir
  ]

  // TODO: ZEIT now includes caching between successive runs which we lose
  // by always creating a fresh tempDir
  return () => now('dev', args, { cwd: tempDir, ...rest })
}
