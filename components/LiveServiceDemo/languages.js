import indent from 'indent-string'

// TODO: python and ruby example params seem off
// TODO: add token if given

export const languages = [
  {
    language: 'bash',
    label: 'cURL',
    code: (params) => `
curl --request POST \\
  --url ${params.url} \\
  --header 'content-type: application/json' \\${params.token && `
  --header 'authorization: ${params.token}' \\`}
  --data '${params.exampleJSON}'`
  },
  {
    language: 'javascript',
    label: 'Node.js',
    code: (params) => `
const request = require('request')

const options = {
  method: 'POST',
  url: '${params.url}',
  headers: {
    'content-type': 'application/json'
  },
  body: ${indent(params.example, 1, { indent: '  ' }).slice(2)},
  json: true
}

request(options, (error, response, body) => {
  if (error) throw new Error(error)

  console.log(body)
})`
  },
  {
    language: 'python',
    label: 'Python',
    code: (params) => `
import requests

url = "${params.url}"
payload = "${params.example}"
response = requests.request("POST", url, data=payload)

print(response.text)
`
  },
  {
    language: 'ruby',
    label: 'Ruby',
    code: (params) => `
require 'uri'
require 'net/http'

url = URI("${params.url}")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request.body = "${params.example}"

response = http.request(request)
puts response.read_body
`
  }
]
