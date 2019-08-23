import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import codeTheme from 'react-syntax-highlighter/styles/prism/prism'

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
        className={theme(styles, 'code-block', className)}
        language={language}
        style={codeTheme}
      >
        {value}
      </SyntaxHighlighter>
    )
  }
}
