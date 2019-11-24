'use strict'

const semver = require('semver')
const { Input } = require('enquirer')
const { parseFaasIdentifier } = require('saasify-utils')

const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('publish <deploymentId|deploymentUrl>')
    .description('Publishes a deployment')
    .option('--new-version <version>', 'Specify the new version to publish')
    .action(async (identifier, opts) => {
      program.requireAuthentication()

      try {
        const parsedFaas = parseFaasIdentifier(identifier, {
          namespace: client.user.username
        })

        if (!parsedFaas) {
          throw new Error(`Invalid project identifier [${identifier}]`)
        }

        if (!parsedFaas.deploymentHash) {
          throw new Error(
            `Invalid deployment identifier [${identifier}]. Publishing requires a full deployment identifier with version hash.`
          )
        }

        const { projectId, deploymentId } = parsedFaas

        const project = await spinner(
          client.getProject(projectId),
          `Fetching project [${projectId}]`
        )

        const lastPublishedVersion = project.lastPublishedVersion || '0.0.0'
        console.error(`Current version ${lastPublishedVersion}`)
        let version = opts.newVersion

        const validate = (value) =>
          semver.valid(value) && semver.gt(value, lastPublishedVersion)

        if (version) {
          if (!semver.valid(version)) {
            console.error(`Invalid semver "${version}"`)
            process.exit(1)
          } else if (!validate(version)) {
            console.error(
              `Invalid semver version "${version}" must be greater than current version "${lastPublishedVersion}"`
            )
            process.exit(1)
          }
        } else {
          const prompt = new Input({
            message: 'Enter semver version to publish.',
            validate,
            result: (value) => {
              return semver.clean(value)
            }
          })

          version = await prompt.run()
        }

        const deployment = await spinner(
          client.publishDeployment(deploymentId, { version }),
          `Publishing deployment [${deploymentId}] as version "${version}"`
        )

        program.appendOutput(
          deployment.project.aliasUrl || deployment.project.saasUrl
        )
      } catch (err) {
        handleError(program, err)
      }
    })
}
