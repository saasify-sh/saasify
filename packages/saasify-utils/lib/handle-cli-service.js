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
  let command = `npx --no-install ${commandTemplate}`

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

module.exports = async (run, params, required, optional) => {
  const requiredParams = required.reduce(
    (acc, paramName, index) => ({ ...acc, [paramName]: params[index] }),
    {}
  )

  const namedOptionalParams = optional.reduce(
    (acc, paramName, index) => ({
      ...acc,
      [paramName]: params[index + required.length]
    }),
    {}
  )

  const unnamedOptionalParams = reducePairs(
    params.slice(required.length + optional.length)
  )

  const optionalParams = {
    ...namedOptionalParams,
    ...unnamedOptionalParams
  }

  const outputPath = tempy.file()

  if (requiredParams.input) {
    requiredParams.input = await tempWrite(requiredParams.input) // TODO support direct input
  }

  requiredParams.output = outputPath

  const { command, matchedKeys } = buildCommand(
    run,
    requiredParams,
    optionalParams
  )

  console.log(`Executing "${command}"`)

  // If inline output, implicitly return stdout
  // Maximum buffer size is 256MB
  const { stdout, stderr } = await exec(command, { maxBuffer: 1024 * 256000 })

  if (stderr) {
    throw new Error(stderr)
  }

  let body

  if (matchedKeys.indexOf('output') > -1) {
    body = fs.readFileSync(outputPath)
  } else {
    const buffer = Buffer.from(stdout)
    if (fileType(stdout)) {
      body = buffer
    } else {
      body = stdout
    }
  }

  return {
    headers: {
      'Content-Type': (fileType(body) || { mime: 'application/json' }).mime
    },
    statusCode: 200,
    body
  }
}
