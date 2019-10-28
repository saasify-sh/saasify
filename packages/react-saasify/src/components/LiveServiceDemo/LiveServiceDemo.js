import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'
import mem from 'mem'
import copyTextToClipboard from 'copy-text-to-clipboard'

import { observer, inject } from 'mobx-react'
import { Button, Tooltip } from 'lib/antd'

import { CodeBlock } from '../CodeBlock'

import getServiceExamples from 'lib/get-service-examples'

import styles from './styles.module.css'

@inject('auth')
@observer
export class LiveServiceDemo extends Component {
  static propTypes = {
    service: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  }

  state = {
    selected: 'cURL',
    copiedTextToClipboard: false
  }

  _onClickTabMem = mem((i) => () => this._onClickTab(this._examples[i]))

  componentWillUnmount() {
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
  }

  render() {
    const {
      service,
      auth
    } = this.props

    const {
      selected,
      copiedTextToClipboard
    } = this.state

    this._examples = getServiceExamples(service, auth.consumer && auth.consumer.token, {
      method: service.POST ? 'POST' : 'GET'
    })

    return (
      <div className={theme(styles, 'live-service-demo')}>
        <div className={theme(styles, 'tabs')}>
          {this._examples.map((l, i) => (
            <div
              className={theme(styles, 'tab', selected === l.label && theme(styles, 'selected-tab'))}
              key={i}
              onClick={this._onClickTabMem(i)}
            >
              {l.label}
            </div>
          ))}
        </div>

        <div className={theme(styles, 'tab-content')}>
          {this._examples.map((l, i) => (
            <div
              className={theme(styles, 'tab-pane', selected === l.label && theme(styles, 'selected-tab-pane'))}
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
