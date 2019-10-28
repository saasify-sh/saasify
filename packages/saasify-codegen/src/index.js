// TODO: python and ruby example params seem off
// TODO: add token if given for python and ruby
// TODO: add support for GET vs POST requests
// TODO: update result format to match format of redoc's x-code-samples

import indent from 'indent-string'
import mustache from 'mustache'
import stringifyObject from 'stringify-object'
import qs from 'qs'

import raw from 'raw.macro'

const languages = [
  {
    language: 'bash',
    label: 'cURL',
    templateGET: raw('./templates/GET/curl.mustache'),
    templatePOST: raw('./templates/POST/curl.mustache')
  },
  {
    language: 'javascript',
    label: 'Node.js',
    templateGET: raw('./templates/GET/node.mustache'),
    templatePOST: raw('./templates/POST/node.mustache')
  },
  {
    language: 'python',
    label: 'Python',
    templatePOST: raw('./templates/POST/python.mustache')
  },
  {
    language: 'go',
    label: 'Go',
    templatePOST: raw('./templates/POST/go.mustache')
  },
  {
    language: 'ruby',
    label: 'Ruby',
    templatePOST: raw('./templates/POST/ruby.mustache')
  }
]

export default (service, token, opts = { }) => {
  const {
    method = 'POST',
    example = service.examples[0]
  } = opts

  console.log('codegen', method)

  if (method !== 'POST' && method !== 'GET') {
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
  data.exampleQuery = qs.stringify(example.input)

  // TODO: curl isHttp "> out.png" is hardcoded...
  // need to differentiate between http output content types
  data.hasOutput = (service.definition && service.definition.returns.http && typeof example.output === 'string')
  data.output = example.output

  // --------------------------------------------------------------
  // WARNING: mustache templates do NOT work with live reload.
  // Restart the dev server each time you make a change.
  // --------------------------------------------------------------

  return languages.map((l) => {
    const template = l[`template${method}`]

    if (template) {
      const code = mustache.render(template, data).trim()
      const { language, label } = l

      return { code, language, label }
    }
  }).filter(Boolean)
}
