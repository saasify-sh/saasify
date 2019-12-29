const tempWrite = require('temp-write')
const tempy = require('tempy')
const util = require('util')
const fs = require('fs')
const exec = util.promisify(require('child_process').exec)
const fileType = require('file-type')

const reducePairs = (pairs) =>
  pairs.reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})

const buildCommand = (commandTemplate, required, optional) => {
  // TODO remove npx once using global installs of deps via deployment.install
  let command = `npx ${commandTemplate}`

  const optionsString = Object.keys(optional).reduce((acc, item) => {
    let option = ''
    const prefix = item.length === 1 ? '-' : '--' // Allows us to test with single letter params

    if (typeof optional[item] === 'boolean') {
      if (optional[item]) {
        option = ` ${prefix}${item}`
      }
    } else {
      option = ` ${prefix}${item} ${JSON.stringify(optional[item])}`
    }

    return `${acc}${option}`
  }, '')

  command = command.replace(' [options]', optionsString)

  const matchedKeys = []

  for (const key in required) {
    const val = required[key]
    const pattern = new RegExp(`\\[${key}\\]`)

    if (command.match(pattern)) {
      matchedKeys.push(key)
      command.replace(pattern, val)

      command = command.replace(pattern, val)
    }
  }

  return { command, matchedKeys }
}

module.exports = async (run, input, optionPairs) => {
  const options = reducePairs(optionPairs)

  const outputPath = tempy.file()

  const { command, matchedKeys } = buildCommand(
    run,
    {
      input: await tempWrite(input),
      output: outputPath
    },
    options
  )

  console.log(command)

  // If inline output, implicitly return stdout
  const { stdout } = await exec(command)

  let body

  if (matchedKeys.indexOf('output') > -1) {
    body = fs.readFileSync(outputPath)
  } else {
    body = stdout
  }

  return {
    headers: {
      'Content-Type': fileType(body).mime
    },
    statusCode: 200,
    body
  }
}
