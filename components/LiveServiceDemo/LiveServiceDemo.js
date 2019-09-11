import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'
import mem from 'mem'
import copyTextToClipboard from 'copy-text-to-clipboard'
import stringifyObject from 'stringify-object'

import { observer, inject } from 'mobx-react'
import { Button, Tooltip } from 'lib/antd'

import { CodeBlock } from '../CodeBlock'

import getServiceExamples from 'lib/get-service-examples'

import styles from './styles.module.css'

@inject('auth')
@observer
export class LiveServiceDemo extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    deployment: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  }

  state = {
    selected: 'cURL',
    copiedTextToClipboard: false
  }

  _examples = getServiceExamples(this.props.service, this.props.auth.consumer && this.props.auth.consumer.token)

  _onClickTabMem = mem((i) => () => this._onClickTab(this._examples[i]))

  componentWillUnmount() {
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
  }

  render() {
    const {
      selected,
      copiedTextToClipboard
    } = this.state

    return (
      <div className={theme(styles, 'container')}>
        <div className={theme(styles, 'tabs')}>
          {this._examples.map((l, i) => (
            <div
              className={theme(styles, 'tab', selected === l.label && theme(styles, 'selectedTab'))}
              key={i}
              onClick={this._onClickTabMem(i)}
            >
              {l.label}
            </div>
          ))}
        </div>

        <div className={theme(styles, 'content')}>
          {this._examples.map((l, i) => (
            <div
              className={theme(styles, 'tabPane', selected === l.label && theme(styles, 'selectedTabPane'))}
              key={i}
            >
              <CodeBlock
                className={theme(styles, 'code')}
                language={l.language}
                value={l.code}
              />
            </div>
          ))}

          <Tooltip
            placement='top'
            title={copiedTextToClipboard ? 'Copied!' : 'Copy to clipboard'}
          >
            <Button
              icon='copy'
              type='primary'
              className={theme(styles, 'copy')}
              onClick={this._onClickCopy}
            />
          </Tooltip>
        </div>
      </div>
    )
  }

  _getParams () {
    const {
      project,
      deployment,
      service,
      auth
    } = this.props

    return {
      project,
      deployment,
      service,
      url: service.url,
      token: auth.consumer && auth.consumer.token,
      exampleJSON: JSON.stringify(service.example || ''),
      example: stringifyObject(service.example || '', {
        indent: '  '
      })
    }
  }

  _onClickTab = (language) => {
    this.setState({
      selected: language.label
    })
  }

  _onClickCopy = () => {
    const {
      selected
    } = this.state

    const example = this._examples.find((l) => l.label === selected)

    copyTextToClipboard(example.code)

    this.setState({ copiedTextToClipboard: true })
    this._clearCopyTimeout()
    this._copyTimeout = setTimeout(this._onCopyTimeout, 3000)
  }

  _onCopyTimeout = () => {
    this._clearCopyTimeout()
    this.setState({ copiedTextToClipboard: false })
  }

  _clearCopyTimeout = () => {
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
  }
}
