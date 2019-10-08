'use strict'

const { ZipFile } = require('yazl')

const fs = require('fs-extra')
const globby = require('globby')
const path = require('path')

const streamToBuffer = require('./stream-to-buffer')

module.exports = async (program, deployment, zipEnv = false) => {
  const files = await globby('**/*', {
    cwd: deployment.root,
    gitignore: true
  })

  const envFiles = zipEnv
    ? await globby('.env', {
        cwd: deployment.root,
        gitignore: false
      })
    : []

  const allFiles = [
    ...files,
    ...envFiles
  ]

  const mtime = new Date(1540000000000)
  const zipFile = new ZipFile()

  const zipBuffer = await new Promise((resolve, reject) => {
    allFiles
      .sort()
      .forEach((file) => {
        const filePath = path.join(deployment.root, file)
        const stream = fs.createReadStream(filePath)
        const stat = fs.statSync(filePath)
        stream.on('error', reject)
        zipFile.addReadStream(stream, file, { mode: stat.mode, mtime })
      })

    zipFile.end()
    streamToBuffer(zipFile.outputStream)
      .then(resolve)
      .catch(reject)
  })

  return zipBuffer
}
