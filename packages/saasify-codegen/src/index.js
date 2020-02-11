// TODO: add token if given for python and ruby
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
  }
  // TODO: fix ruby template
  /*
  {
    language: 'ruby',
    label: 'Ruby',
    templatePOST: raw('./templates/POST/ruby.mustache')
  }
  */
]

export default (service, token, opts = {}) => {
  const { method = 'POST', example = service.examples[0] } = opts

  if (method !== 'POST' && method !== 'GET') {
    throw new Error(`Service codegen is not supported for method "${method}"`)
  }

  if (!example) {
    console.warn(`Codegen received empty example for service "${service.name}"`)
    return
  }

  const data = {
    service,
    token
  }

  data.exampleQuery = qs.stringify(example.input)
  data.exampleJSON = JSON.stringify(example.input)
  data.exampleJSONPretty = JSON.stringify(example.input, null, 2)

  // stringifyObject returns the JSON without all the extra quotes around keys
  // and using single quotes for string values
  data.exampleJSONBare = stringifyObject(example.input, { indent: '  ' })
  data.exampleJSONBareIndented = indent(data.exampleJSONBare, 1, {
    indent: '  '
  }).slice(2)

  data.hasFileOutput = !!example.outputUrl
  data.output = example.output

  // --------------------------------------------------------------
  // WARNING: mustache templates do NOT work with live reload.
  // Restart the dev server each time you make a change.
  // --------------------------------------------------------------

  let snippets =
    example.snippet && example.snippet.exclusive
      ? [example.snippet]
      : languages
          .map((l) => {
            const template = l[`template${method}`]

            if (template) {
              const code = mustache.render(template, data).trim()
              const { language, label } = l

              return { code, language, label }
            }
          })
          .filter(Boolean)

  if (example.snippet && !example.snippet.exclusive) {
    snippets = [example.snippet, ...snippets]
  }

  return {
    ...example,
    hasFileOutput: data.hasFileOutput,
    snippets
  }
}
