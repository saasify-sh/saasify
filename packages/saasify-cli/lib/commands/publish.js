'use strict'

const semver = require('semver')
const { Input } = require('enquirer')
const { parseFaasIdentifier } = require('saasify-utils')

const handleError = require('../handle-error')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('publish <deploymentId|deploymentUrl>')
    .description(
      'Creates a subscription to a project (requires a valid billing source)'
    )
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
            `Invalid project identifier [${identifier}]. Publishing requires a full deployment identifier with version hash.`
          )
        }

        const { projectId, deploymentId } = parsedFaas

        const project = await spinner(
          client.getProject(projectId),
          `Fetching project [${projectId}]`
        )

        const lastPublishedVersion = project.lastPublishedVersion || '0.0.0'
        console.log(`Current version ${lastPublishedVersion}`)

        const prompt = new Input({
          message: 'Enter semver version to publish.',
          validate: (value) => {
            return semver.valid(value) && semver.gt(value, lastPublishedVersion)
          },
          result: (value) => {
            return semver.clean(value)
          }
        })

        const version = await prompt.run()

        const deployment = await spinner(
          client.publishDeployment(deploymentId, { version }),
          `Publishing deployment [${deploymentId}] as version "${version}"`
        )

        console.log(deployment.project.aliasUrl || deployment.project.saasUrl)
      } catch (err) {
        handleError(program, err)
      }
    })
}
