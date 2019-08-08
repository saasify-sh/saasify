import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import mem from 'mem'

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
    selected: 'cURL'
  }

  _onClickTabMem = mem((i) => () => this._onClickTab(languages[i]))

  render() {
    const {
      project,
      deployment,
      service
    } = this.props

    const {
      selected
    } = this.state

    const params = {
      project,
      deployment,
      service,
      url: `${deployment.url}${service.route}`
    }

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
