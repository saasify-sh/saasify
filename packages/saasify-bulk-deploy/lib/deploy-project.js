'use strict'

const execa = require('execa')
const fs = require('fs-extra')
const path = require('path')
const pRetry = require('p-retry')

const deploy = require('./saasify/deploy')
const spinner = require('./spinner')

module.exports = async function deployProject(
  { projectDir, config },
  opts = {}
) {
  const { noYarn = false } = opts
  const packageJsonPath = path.join(projectDir, 'package.json')
  console.log()

  if (!noYarn && fs.existsSync(packageJsonPath)) {
    await spinner(
      execa('yarn', { cwd: projectDir, shell: true }),
      `Initializing project "${config.name}"`
    )
  }
  console.log(`Deploying project "${config.name}"`)
  console.log(projectDir)
  console.log()

  return pRetry(async () => deploy(projectDir, opts), {
    retries: 1
  })
}
