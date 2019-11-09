import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'
import mem from 'mem'
import copyTextToClipboard from 'copy-text-to-clipboard'

import { observer, inject } from 'mobx-react'
import { Button, Tooltip } from 'lib/antd'

import { CodeBlock } from '../CodeBlock'
import { ServiceForm } from '../ServiceForm'

import getServiceExamples from 'lib/get-service-examples'

import styles from './styles.module.css'

// Using import seems to cause circular dependency
const request = require('request')

@inject('auth')
@observer
export class LiveServiceDemo extends Component {
  static propTypes = {
    service: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  }

  state = {
    selected: 'Playground',
    copiedTextToClipboard: false,
    running: null,
    values: {}
  }

  _onClickPlaygroundTabMem = mem(() => () => this._onClickTab({ label: 'Playground' }))
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
        const dataUrl = 'data:' + outputContentType + ';base64,' + Buffer.from(output).toString('base64')

        renderedOutput = (
          <img
            alt={this._example.name || 'Example output'}
            src={dataUrl}
          />
        )
      }
    }

    return (
      <div className={theme(styles, 'live-service-demo')}>
        <div className={theme(styles, 'tabs')}>
          <div
            className={theme(styles, 'tab', selected === 'Playground' && theme(styles, 'selected-tab'))}
            onClick={this._onClickPlaygroundTabMem()}
          >
              Playground
          </div>
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
          <div
            className={theme(styles, 'tab-pane', selected === 'Playground' && theme(styles, 'selected-tab-pane'))}
          >
            <div className={theme(styles, 'api-playground')}>
              <ServiceForm
                onChange={this._handlePlaygroundChange}
                restrictToFirstExample
                service={service}
              />
            </div>
          </div>
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
        </div>

        <div className={theme(styles, 'footer')}>

          <div className={theme(styles, 'footer__service')}>
            {this._example.description && (
              <div className={theme(styles, 'footer__service__example-description')}>
                Example - {this._example.description}
              </div>
            )}

            <div className={theme(styles, 'footer__service__path')}>
              <div
                className={theme(
                  styles,
                  'footer__service__badge',
                  theme(
                    styles,
                    `footer__service__badge--${service.POST ? 'POST' : 'GET'}`
                  )
                )}
              >
                {service.POST ? 'POST' : 'GET'}
              </div>

              /
              <div className={theme(styles, 'footer__service__name')}>
                {service.name}
              </div>
            </div>
          </div>

          <div className={theme(styles, 'footer__actions')}>
            {selected !== 'Playground' && (
              <div className={theme(styles, 'footer__action')}>
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
            )}
            <div className={theme(styles, 'footer__action')}>
              <Button onClick={this._onClickRun} type='primary' loading={running}>
                Run example
              </Button>
            </div>
          </div>
        </div>

        {output && (
          <div
            className={theme(styles, 'output')}
          >
            {renderedOutput}
          </div>
        )}
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
    const { auth, service } = this.props

    const authHeaders = {}

    if (auth.consumer) {
      authHeaders.authorization = auth.consumer.token
    };

    const data = {
      ...this._example.input,
      ...this.state.values
    }

    const payload = {}

    if (service.POST) {
      payload.body = data
    } else {
      payload.qs = data
    }

    const options = {
      method: service.POST ? 'POST' : 'GET',
      url: service.url,
      headers: {
        'content-type': 'application/json',
        ...authHeaders
      },
      ...payload,
      json: true,
      encoding: null
    }

    this.setState({
      running: true
    })

    request(options, (error, response, body) => {
      if (error) throw new Error(error)

      this.setState({
        running: false,
        output: body,
        outputContentType: response.headers['content-type']
      })
    })
  }

  _handlePlaygroundChange = (values) => {
    this.setState({ values })
  }
}
