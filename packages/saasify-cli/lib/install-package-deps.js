'use strict'

const execa = require('execa')
const fs = require('fs-extra')
const path = require('path')

module.exports = async (program, rootPath, args = [], opts = {}) => {
  const packageLockJsonPath = path.join(rootPath, 'package-lock.json')
  const hasPackageLockJson = await fs.pathExists(packageLockJsonPath)

  let child

  if (hasPackageLockJson) {
    args = args.filter((a) => a !== '--prefer-offline')

    child = execa('npm', args.concat(['install', '--unsafe-perm']), {
      cwd: rootPath,
      shell: true,
      ...opts
    })
  } else {
    child = execa('yarn', args.concat(['--ignore-engines']), {
      cwd: rootPath,
      shell: true,
      ...opts
    })
  }

  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)

  return child
}
