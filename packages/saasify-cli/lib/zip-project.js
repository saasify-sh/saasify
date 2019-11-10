'use strict'

const { ZipFile } = require('yazl')

const fs = require('fs-extra')
const globby = require('globby')
const ignore = require('ignore')
const path = require('path')

const streamToBuffer = require('./stream-to-buffer')

module.exports = async (program, deployment, zipEnv = false) => {
  const files = await globby('**/*', {
    cwd: deployment.root,
    gitignore: true,
    mark: true
  })

  const envFiles = zipEnv
    ? await globby('.env', {
        cwd: deployment.root,
        gitignore: false
      })
    : []

  const ignoredFiles = await getIgnoredFiles(program, deployment)

  const allFilesFiltered = ignoredFiles.filter(files).concat(envFiles)

  const mtime = new Date(1540000000000)
  const zipFile = new ZipFile()

  const zipBuffer = await new Promise((resolve, reject) => {
    allFilesFiltered.sort().forEach((file) => {
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

async function getIgnoredFiles(program, deployment) {
  const ignores = [
    '.hg',
    '.git',
    '.gitmodules',
    '.svn',
    '.cache',
    '.next',
    '.now',
    '.npmignore',
    '.dockerignore',
    '.gitignore',
    '.*.swp',
    '.DS_Store',
    '.wafpicke-*',
    '.lock-wscript',
    '.env',
    '.env.build',
    '.venv',
    'npm-debug.log',
    'config.gypi',
    'node_modules',
    '__pycache__/',
    'venv/',
    'CVS'
  ]

  const saasifyIgnore = await globby('.saasifyignore', {
    cwd: deployment.root,
    gitignore: false
  })

  const ig = ignore()
  ig.add(ignores.join('\n'))

  if (saasifyIgnore.length) {
    const saasifyIgnoreFile = await fs.readFile(saasifyIgnore[0], 'utf8')
    ig.add(saasifyIgnoreFile)
  }

  return ig
}
