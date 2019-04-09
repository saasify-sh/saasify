import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'

import { CodeBlock } from '../CodeBlock'
import styles from './styles.module.css'

export class Markdown extends Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
    renderers: PropTypes.object
  }

  static defaultProps = {
    renderers: { }
  }

  render () {
    const {
      source,
      renderers,
      ...rest
    } = this.props

    return (
      <ReactMarkdown
        className={styles.markdown}
        source={source}
        renderers={{
          code: CodeBlock,
          ...renderers
        }}
        {...rest}
      />
    )
  }
}
