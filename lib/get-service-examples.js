// TODO: python and ruby example params seem off
// TODO: add token if given

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

export default (service, token) => {
  const data = {
    service,
    token,
    exampleJSON: JSON.stringify(service.example || ''),
    example: stringifyObject(service.example || '', {
      indent: '  '
    })
  }

  data.exampleNodeJSON = indent(data.example, 1, { indent: '  ' }).slice(2)

  return languages.map((l) => {
    const { language, label, template } = l
    const code = mustache.render(template, data).trim()

    return { code, language, label }
  })
}
