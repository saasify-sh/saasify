'use strict'

const fs = require('fs-extra')
const { createHttpClient } = require('fts-http-client')
const { parseFaasIdentifier } = require('fin-utils')

const handleError = require('../handle-error')

module.exports = (program, client) => {
  program
    .command('call <service> [args...]')
    .description('Invokes a given service')
    .option('-o, --output <file>', 'Save output to file instead of stdout.')
    .action(async (identifier, args, opts) => {
      const nonParams = args
        .filter((a) => !/[=@]/.test(a))

      if (nonParams.length > 0) {
        console.error('Error invalid arguments')
        process.exit(1)
      }

      // TODO: support all httpie param syntax types

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

      try {
        const parsedFaas = parseFaasIdentifier(identifier, {
          namespace: client.user.username
        })

        if (!parsedFaas) {
          console.error(`Error no deployment found matching input "${identifier}"`)
          process.exit(1)
        }

        const deployment = await client.getDeployment(parsedFaas.deployment)
        let service

        if (parsedFaas.serviceName) {
          service = deployment.services
            .find((service) => service.name === parsedFaas.serviceName)
        } else if (deployment.services.length === 1) {
          service = deployment.services[0]
        }

        if (!service) {
          console.error(`Error invalid service`)
          process.exit(1)
        }

        const httpClient = createHttpClient(service.definition, `${deployment.url}${service.route}`)

        const result = await httpClient({
          ...params,
          ...files
        })

        if (opts.output) {
          await fs.writeFile(opts.output, result, 'binary')
        } else {
          console.log(result)
        }
      } catch (err) {
        handleError(err)
      }
    })
}
