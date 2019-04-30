'use strict'

const { createHttpClient } = require('fts-http-client')
const fs = require('fs')

const spinner = require('../spinner')
const handleError = require('../handle-error')

module.exports = (program, client) => {
  program
    .command('call <service> [args...]')
    .description('Invokes a given service')
    .action(async (service, args) => {
      console.log(args)

      const nonParams = args
        .filter((a) => !/[=@]/.test(a))

      if (nonParams.length > 0) {
        console.error('Error invalid arguments')
        process.exit(1)
      }

      const params = args
        .filter((a) => /=/.test(a))
        .reduce((acc, a) => {
          const v = a.split('=')

          if (v.length !== 2 || !v[0].length || !v[1].length) {
            console.error(`Error no invalid argument "${a}"`)
            process.exit(1)
          }

          acc[v[0]] = v[1]
          return acc
        }, { })

      const files = args
        .filter((a) => /@/.test(a))
        .reduce((acc, a) => {
          const v = a.split('@')

          if (v.length !== 2 || !v[0].length || !v[1].length) {
            console.error(`Error no invalid argument "${a}"`)
            process.exit(1)
          }

          acc[v[0]] = fs.readFileSync(v[1])
          return acc
        }, { })

      console.log({ params, files })
      try {
        const deployments = await spinner(
          client.resolveDeployments([ service ]),
          `Resolving deployment`
        )

        if (!deployments.length) {
          console.error(`Error no deployment found matching input "${service}"`)
          process.exit(1)
        }

        const deployment = deployments[0]

        // TODO: support multiple services
        const s = deployment.services[0]
        const httpClient = createHttpClient(s.definition, `${deployment.url}${s.route}`)

        const result = await httpClient({
          ...params,
          ...files
        })

        console.log(JSON.stringify(result, null, 2))
      } catch (err) {
        handleError(err)
      }
    })
}
