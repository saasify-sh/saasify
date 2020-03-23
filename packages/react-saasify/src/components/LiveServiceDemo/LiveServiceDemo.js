import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'
import mem from 'mem'
import isDeepEqual from 'fast-deep-equal'
import copyTextToClipboard from 'copy-text-to-clipboard'
import mediumZoom from 'medium-zoom'

import mime from 'mime-types'
import fileType from 'file-type'
import detectCsv from 'detect-csv'
import isHtml from 'is-html'
import download from 'downloadjs'

import { observer, inject } from 'mobx-react'
import { Button, Tooltip } from 'lib/antd'
import { Link } from 'react-router-dom'

import { CodeBlock } from '../CodeBlock'
import { ImageZoom } from '../ImageZoom'
import { ServiceForm } from '../ServiceForm'

import getServiceExamples from 'lib/get-service-examples'
import requestService from 'lib/request-service'
import { getUpgradeLink } from 'lib/upgrade'

import styles from './styles.module.css'

@inject('auth')
@observer
export class LiveServiceDemo extends Component {
  static propTypes = {
    deployment: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  }

  state = {
    selected: 'Playground',
    copiedTextToClipboard: false,
    running: null,
    values: {}
  }

  _zoom = mediumZoom({
    background: '#fff',
    margin: 48
  })

  _onClickPlaygroundTabMem = mem(() => () =>
    this._onClickTab({ label: 'Playground' })
  )

  _onClickTabMem = mem((i) => () => this._onClickTab(this._example.snippets[i]))

  componentWillUnmount() {
    if (this._copyTimeout) {
      clearTimeout(this._copyTimeout)
      this._copyTimeout = null
    }
  }

  render() {
    const { service, auth, deployment } = this.props
    const { codeBlockOutputFlush } = deployment.saas.theme

    const {
      selected,
      copiedTextToClipboard,
      running,
      output,
      outputUrl,
      outputContentType,
      outputError,
      downloaded,
      hitRateLimit
    } = this.state

    try {
      this._example = getServiceExamples(
        service,
        auth.consumer && auth.consumer.token,
        {
          method: service.httpMethod.toUpperCase()
        }
      )
    } catch (err) {
      console.warn('error generating service examples', service, err)
      return null
    }

    if (!this._example) {
      return null
    }

    let renderedOutput = null

    if (outputError) {
      renderedOutput = (
        <div className={theme(styles, 'error')}>{outputError}</div>
      )
    } else if (hitRateLimit) {
      renderedOutput = (
        <div className={theme(styles, 'output__cta')}>
          <div className={theme(styles, 'output__cta__message')}>
            You've hit our public rate limit. To keep using the API, please
            upgrade or try again later.
          </div>

          <div className={theme(styles, 'output__cta__button')}>
            <Link to={getUpgradeLink({ auth, deployment })}>
              <Button type='primary'>Upgrade</Button>
            </Link>
          </div>
        </div>
      )
    } else if (outputContentType) {
      if (downloaded) {
        // TODO: gracefully handle other content-types
        renderedOutput = (
          <div className={theme(styles, 'message')}>
            The resulting "{outputContentType}" file was downloaded.
          </div>
        )
      } else if (outputUrl) {
        if (outputContentType.startsWith('image/')) {
          renderedOutput = (
            <div className={theme(styles, 'img-wrapper')}>
              <ImageZoom
                src={outputUrl}
                alt={this._example.name || 'Example output'}
                zoom={this._zoom}
              />
            </div>
          )
        }
      } else if (output) {
        // TODO: switch to use type-is package here
        if (outputContentType.startsWith('text/')) {
          renderedOutput = (
            <CodeBlock
              className={theme(styles, 'code')}
              language={outputContentType.slice('text/'.length)}
              value={output}
            />
          )
        } else if (outputContentType.startsWith('application/json')) {
          let language
          let value

          if (typeof output === 'string') {
            language = 'text'
            value = output
          } else {
            language = 'json'
            value = JSON.stringify(output, null, 2)
          }

          renderedOutput = (
            <CodeBlock
              className={theme(styles, 'code')}
              language={language}
              value={value}
            />
          )
        } else if (outputContentType.startsWith('image/')) {
          const dataUrl = 'data:' + outputContentType + ';base64,' + output

          renderedOutput = (
            <div className={theme(styles, 'img-wrapper')}>
              <ImageZoom
                src={dataUrl}
                alt={this._example.name || 'Example output'}
                zoom={this._zoom}
              />
            </div>
          )
        } else {
          // TODO: gracefully handle other content-types
          renderedOutput = (
            <div className={theme(styles, 'message')}>
              The resulting "{outputContentType}" file preview is not supported.
            </div>
          )
        }
      }
    }

    return (
      <div className={theme(styles, 'live-service-demo')}>
        <div className={theme(styles, 'tabs')}>
          <div
            className={theme(
              styles,
              'tab',
              selected === 'Playground' && theme(styles, 'selected-tab')
            )}
            onClick={this._onClickPlaygroundTabMem()}
          >
            Playground
          </div>

          {this._example.snippets.map((l, i) => (
            <div
              className={theme(
                styles,
                'tab',
                selected === l.label && theme(styles, 'selected-tab')
              )}
              key={i}
              onClick={this._onClickTabMem(i)}
            >
              {l.label}
            </div>
          ))}
        </div>

        <div className={theme(styles, 'tab-content')}>
          <div
            className={theme(
              styles,
              'tab-pane',
              selected === 'Playground' && theme(styles, 'selected-tab-pane')
            )}
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
              className={theme(
                styles,
                'tab-pane',
                selected === l.label && theme(styles, 'selected-tab-pane')
              )}
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
              <div
                className={theme(
                  styles,
                  'footer__service__example-description'
                )}
              >
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
                    `footer__service__badge--${service.httpMethod.toUpperCase()}`
                  )
                )}
              >
                {service.httpMethod.toUpperCase()}
              </div>
              /
              <div className={theme(styles, 'footer__service__name')}>
                {service.path.slice(1)}
              </div>
            </div>
          </div>

          <div className={theme(styles, 'footer__actions')}>
            {selected !== 'Playground' && (
              <div className={theme(styles, 'footer__action')}>
                <Tooltip
                  placement='top'
                  title={
                    copiedTextToClipboard ? 'Copied!' : 'Copy to clipboard'
                  }
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
              <Button
                onClick={this._onClickRun}
                type='secondary'
                loading={running}
              >
                Run example
              </Button>
            </div>
          </div>
        </div>

        {renderedOutput && (
          <div
            className={theme(
              styles,
              'output',
              hitRateLimit && theme(styles, 'output--hit-rate-limit'),
              codeBlockOutputFlush && theme(styles, 'output--flush')
            )}
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
    const { selected } = this.state

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

  _onClickRun = async () => {
    const { auth, service } = this.props

    this.setState({
      running: true,
      output: null,
      outputUrl: null,
      outputContentType: null,
      outputError: null,
      downloaded: false,
      hitRateLimit: null
    })

    const data = {
      ...this._example.input,
      ...this.state.values
    }

    const builtInExample = service.examples.find(
      (e) =>
        isDeepEqual(e.input, data) &&
        e.outputContentType &&
        (e.outputUrl || e.output)
    )
    let result

    console.log({ data, builtInExample })

    if (builtInExample) {
      result = {
        output: builtInExample.output,
        outputUrl: builtInExample.outputUrl,
        outputContentType: builtInExample.outputContentType
      }

      await new Promise((resolve) => {
        if (!result.outputContentType.startsWith('image/')) {
          // window.open(result.outputUrl)
          const ext = mime.extension(result.outputContentType)
          const filename = ext ? `example.${ext}` : `example`
          result.downloaded = true
          download(result.outputUrl, filename, result.outputContentType)
        }

        setTimeout(resolve, 750)
      })
    } else {
      result = await requestService({
        auth,
        service,
        data
      })

      if (!result.hitRateLimit && result.outputContentType) {
        if (result.outputUrl) {
          if (result.outputContentType.startsWith('image/')) {
            // TODO: clean this up
          } else {
            window.open(result.outputUrl)
          }
        } else {
          if (result.outputContentType.startsWith('application/octet-stream')) {
            const overrides = await getContentTypeForBuffer(result.output)

            if (overrides) {
              // TODO: clean this up
              result.origOutput = result.output
              result = {
                ...result,
                ...overrides
              }
            }
          }

          if (
            result.outputContentType.startsWith('text/') &&
            !result.outputContentType.startsWith('text/html') &&
            !result.outputContentType.startsWith('text/csv')
          ) {
            // TODO: clean this up
          } else if (result.outputContentType.startsWith('image/')) {
            // TODO: clean this up
          } else {
            const blob = new window.Blob([result.origOutput || result.output], {
              type: result.outputContentType
            })
            const ext = mime.extension(result.outputContentType)
            const filename = ext ? `example.${ext}` : `example`
            result.downloaded = true
            download(blob, filename, result.outputContentType)
          }
        }
      }
    }

    this.setState({
      ...result,
      running: false
    })
  }

  _handlePlaygroundChange = (values) => {
    this.setState({ values })
  }
}

async function getContentTypeForBuffer(buffer) {
  try {
    const ft = await fileType.fromBuffer(buffer)

    if (ft) {
      return {
        outputContentType: ft.mime
      }
    }

    const str = buffer.toString('utf8')

    if (isHtml(str)) {
      return {
        outputContentType: 'text/html',
        output: str
      }
    }

    try {
      const json = JSON.parse(str)
      return {
        outputContentType: 'application/json',
        output: json
      }
    } catch (err) {
      // purposefully ignore
    }

    // TODO: this CSV parser is way too lenient
    const csv = detectCsv(str)
    if (csv) {
      return {
        outputContentType: 'text/csv',
        output: str
      }
    }
  } catch (err) {
    console.warn('getContentTypeForBuffer error', err)
  }
}
