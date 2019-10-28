// TODO: python and ruby example params seem off
// TODO: add token if given for python and ruby
// TODO: add support for GET vs POST requests
// TODO: update result format to match format of redoc's x-code-samples

import indent from 'indent-string'
import mustache from 'mustache'
import stringifyObject from 'stringify-object'

import raw from 'raw.macro'

const curl = raw('./templates/curl.mustache')
const node = raw('./templates/node.mustache')
const python = raw('./templates/python.mustache')
const ruby = raw('./templates/ruby.mustache')

const languages = [
  {
    language: 'bash',
    label: 'cURL',
    template: curl
  },
  {
    language: 'javascript',
    label: 'Node.js',
    template: node
  },
  {
    language: 'python',
    label: 'Python',
    template: python
  },
  {
    language: 'ruby',
    label: 'Ruby',
    template: ruby
  }
]

export default (service, token, opts = { }) => {
  const {
    method = 'POST',
    example = service.examples[0]
  } = opts

  if (method !== 'POST') {
    throw new Error(`TODO: support service codegen for method "${method}"`)
  }

  if (!example) {
    console.warn(`Codegen received empty example for service "${service.name}"`)
    return []
  }

  const data = {
    service,
    token
  }

  data.exampleJSON = JSON.stringify(example.input)
  data.example = stringifyObject(example.input, { indent: '  ' })
  data.exampleNodeJSON = indent(data.example, 1, { indent: '  ' }).slice(2)

  // TODO: curl isHttp "> out.png" is hardcoded...
  // need to differentiate between http output content types
  data.hasOutput = (service.definition && service.definition.returns.http && typeof example.output === 'string')
  data.output = example.output

  // --------------------------------------------------------------
  // WARNING: mustache templates do NOT work with live reload.
  // Restart the dev server each time you make a change.
  // --------------------------------------------------------------

  return languages.map((l) => {
    const { language, label, template } = l
    const code = mustache.render(template, data).trim()

    return { code, language, label }
  })
}
