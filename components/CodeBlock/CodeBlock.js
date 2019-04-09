import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import theme from 'react-syntax-highlighter/styles/prism/prism'

import styles from './styles.module.css'

export class CodeBlock extends Component {
  static propTypes = {
    language: PropTypes.string,
    value: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  render () {
    const {
      language,
      value,
      className
    } = this.props

    return (
      <SyntaxHighlighter
        className={cs(className, styles.container)}
        language={language}
        style={theme}
      >
        {value}
      </SyntaxHighlighter>
    )
  }
}
