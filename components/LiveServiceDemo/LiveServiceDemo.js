import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import mem from 'mem'
import copyTextToClipboard from 'copy-text-to-clipboard'
import { Button, Tooltip } from 'antd'

import { CodeBlock } from '../CodeBlock'
import { languages } from './languages'

import styles from './styles.module.css'

export class LiveServiceDemo extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    deployment: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired
  }

  state = {
    selected: 'cURL',
    copiedTextToClipboard: false
  }

  _onClickTabMem = mem((i) => () => this._onClickTab(languages[i]))

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

    const params = this._getParams()

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
                value={l.code(params).trim()}
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
              className={styles.copy}
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
      service
    } = this.props

    return {
      project,
      deployment,
      service,
      url: `${deployment.url}${service.route}`
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

    const params = this._getParams()
    const language = languages.find((l) => l.label === selected)

    copyTextToClipboard(language.code(params).trim())

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
