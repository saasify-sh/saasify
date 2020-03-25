'use strict'

const semver = require('semver')
const { format } = require('date-fns')
const { Input } = require('enquirer')
const { parseFaasIdentifier } = require('saasify-utils')

const handleError = require('../handle-error')
const parseConfig = require('../parse-config')
const spinner = require('../spinner')

module.exports = (program, client) => {
  program
    .command('publish [deploymentId|deploymentUrl]')
    .description('Publishes a deployment')
    .option('--new-version <version>', 'Specify the new version to publish')
    .action(async (identifier, opts) => {
      program.requireAuthentication()

      try {
        let project
        let deploymentId
        let suffix = ''

        if (identifier) {
          const parsedFaas = parseFaasIdentifier(identifier, {
            namespace: client.teamSlug || client.user.username
          })

          if (!parsedFaas) {
            throw new Error(`Invalid project identifier [${identifier}]`)
          }

          if (parsedFaas.version !== 'dev' && !parsedFaas.deploymentHash) {
            throw new Error(
              `Invalid deployment identifier [${identifier}]. Publishing requires a full deployment identifier with version hash.`
            )
          }

          const projectId = parsedFaas.projectId

          project = await spinner(
            client.getProject(projectId),
            `Fetching project [${projectId}]`
          )

          deploymentId = parsedFaas.deploymentId
        } else {
          const config = await parseConfig(program)

          const projectId = config.name

          // default to the latest development deployment for the local project
          const deployment = await spinner(
            client.getDeployment(`${projectId}@dev`, { populate: 'project' }),
            `Fetching latest deployment for project [${projectId}]`
          )

          if (deployment.published) {
            throw new Error(
              `Latest deployment [${deployment.id}] for project [${projectId}] is already published.`
            )
          }

          project = deployment.project
          deploymentId = deployment.id

          suffix = ` (deployed ${format(
            new Date(deployment.createdAt),
            'MM/dd/yyyy HH:mm:ss OOOO'
          )})`
        }

        const lastPublishedVersion = project.lastPublishedVersion || '0.0.0'
        console.error(`Publishing ${deploymentId}${suffix}`)
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
