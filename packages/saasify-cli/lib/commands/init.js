'use strict'

const handleError = require('../handle-error')

const getDefaultTemplateParams = require('../template/get-default-params')
const promptTemplateParams = require('../template/prompt-params')
const initTemplate = require('../template/init')

module.exports = async (program, client) => {
  const defaults = await getDefaultTemplateParams()

  program
    .command('init [project-name]')
    .description('Creates a new project based on a template')
    .option(
      '-t, --template <string>',
      'Select which template to use',
      defaults.template
    )
    .option('-d, --desc <string>', 'Package description')
    .option('-a, --author <string>', "Author's github handle", defaults.author)
    .option('-l, --license <string>', 'Package license', defaults.license)
    .option('-r, --repo <string>', 'Package repo path')
    .option('-f, --force', 'Overwrite destination directory if exists', false)
    .option('-g, --no-git', 'Generate without git init')
    .option(
      '-s, --skip-prompts',
      'Skip all prompts (must provide project-name via cli)'
    )

    .action(async (name, opts) => {
      try {
        const params = {
          description: opts.desc,
          author: opts.author,
          license: opts.license,
          repo: opts.repo,
          skipPrompts: opts.skipPrompts,
          template: opts.template,
          force: opts.force,
          git: opts.git,
          name
        }

        Object.keys(params).forEach((key) => {
          if (!params[key] && defaults[key]) {
            params[key] = defaults[key]
          }
        })

        const info = await promptTemplateParams(params)
        const dest = await initTemplate(info)

        console.log()
        console.log(dest)
      } catch (err) {
        handleError(program, err)
      }
    })
}
