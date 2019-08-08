export const languages = [
  {
    language: 'bash',
    label: 'cURL',
    code: (params) => `
curl --request POST \\
  --url ${params.url} \\
  --header 'content-type: application/json' \\
  --data '{"name": "Nala"}'`
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
  body: { name: 'Nala'},
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
payload = "{ name: 'Nala' }"
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
request.body = "{ name: 'Nala' }"

response = http.request(request)
puts response.read_body
`
  }
]
