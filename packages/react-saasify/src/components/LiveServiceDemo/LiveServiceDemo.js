import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'
import mem from 'mem'
import copyTextToClipboard from 'copy-text-to-clipboard'

import { observer, inject } from 'mobx-react'
import { Button, Divider, Tooltip } from 'lib/antd'

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
    copiedTextToClipboard: false,
    running: null
  }

  _onClickTabMem = mem((i) => () => this._onClickTab(this._example.snippets[i]))

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
      copiedTextToClipboard,
      running,
      output,
      outputContentType
    } = this.state

    this._example = getServiceExamples(service, auth.consumer && auth.consumer.token, {
      method: service.POST ? 'POST' : 'GET'
    })

    let renderedOutput = output

    if (output) {
      if (outputContentType === 'application/json') {
        renderedOutput = (
          <CodeBlock
            className={theme(styles, 'code')}
            language='json'
            value={JSON.stringify(output, null, 2)}
          />
        )
      } else if (outputContentType.startsWith('image')) {
        renderedOutput = (
          <img
            alt={this._example.name || 'Example output'}
            src={output}
          />
        )
      }
    }

    return (
      <div className={theme(styles, 'live-service-demo')}>
        <div className={theme(styles, 'tabs')}>
          {this._example.snippets.map((l, i) => (
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
          {this._example.snippets.map((l, i) => (
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

          {output && (
            <Fragment>
              <Divider />

              <div
                className={theme(styles, 'output')}
              >
                {renderedOutput}
              </div>
            </Fragment>
          )}

          {this._example.output && !this._example.hasFileOutput && (
            <Tooltip
              placement='top'
              title={output ? 'Clear output' : (running ? 'Running...' : 'Run Demo')}
            >
              <Button
                icon={output ? 'close' : (running ? 'loading' : 'caret-right')}
                type='primary'
                className={theme(styles, 'run')}
                onClick={this._onClickRun}
              />
            </Tooltip>
          )}

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

    const snippet = this._example.snippets.find((l) => l.label === selected)

    copyTextToClipboard(snippet.code)

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

  _onClickRun = () => {
    if (this.state.output) {
      this.setState({
        output: null,
        outputContentType: null
      })
    } else {
      this.setState({
        running: true,
        output: null,
        outputContentType: null
      })
      this._clearRunTimeout()
      this._runTimeout = setTimeout(this._onRunTimeout, 1000)
    }
  }

  _onRunTimeout = () => {
    this._clearRunTimeout()
    this.setState({
      running: false,
      output: this._example.output,
      outputContentType: this._example.outputContentType
    })
  }

  _clearRunTimeout = () => {
    if (this._runTimeout) {
      clearTimeout(this._runTimeout)
      this._runTimeout = null
    }
  }
}
