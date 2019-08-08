import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd'

import { CodeBlock } from '../CodeBlock'

import styles from './styles.module.css'

const { TabPane } = Tabs

const languages = [
  {
    language: 'bash',
    label: 'cURL',
    code: (props) => `
curl --request POST \\
  --url https://hoot.at/api/hoot \\
  --user readme: \\
  --header 'content-type: application/json' \\
  --data '{"post": "Hello world!"}'`
  },
  {
    language: 'javascript',
    label: 'Node.js',
    code: (props) => `
const request = require('request')

const options = {
  method: 'POST',
  url: 'https://hoot.at/api/hoot',
  headers: {
    authorization: 'Basic cmVhZG1lOg=='
    'content-type': 'application/json'
  },
  body: { post: 'Hello World!'},
  json: true
}

request(options, (error, response, body) => {
  if (error) throw new Error(error)

  console.log(body)
})`
  }
]

export class LiveServiceDemo extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    deployment: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired
  }

  state = {
    selected: 'curl'
  }

  render() {
    return (
      <div className={styles.container}>
        <Tabs type='card'>
          {languages.map((l, i) => (
            <TabPane
              tab={l.label}
              key={i}
            >
              <CodeBlock
                language={l.language}
                value={l.code(this.props).trim()}
              />
            </TabPane>
          ))}
        </Tabs>
      </div>
    )
  }
}
