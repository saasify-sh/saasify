import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import mem from 'mem'
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
    selected: 'cURL'
  }

  _onClickTabMem = mem((i) => () => this._onClickTab(languages[i]))

  render() {
    const {
      selected
    } = this.state

    return (
      <div className={styles.container}>
        <div className={styles.tabs}>
          {languages.map((l, i) => (
            <div
              className={cs(styles.tab, selected === l.label && styles.selectedTab)}
              key={i}
              onClick={this._onClickTabMem(i)}
            >
              {l.label}
            </div>
          ))}
        </div>

        <div className={styles.content}>
          {languages.map((l, i) => (
            <div
              className={cs(styles.tabPane, selected === l.label && styles.selectedTabPane)}
              key={i}
            >
              <CodeBlock
                className={styles.code}
                language={l.language}
                value={l.code(this.props).trim()}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  _onClickTab = (language) => {
    this.setState({
      selected: language.label
    })
  }
}
