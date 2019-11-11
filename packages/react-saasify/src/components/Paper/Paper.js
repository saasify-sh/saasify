import React, { Component } from 'react'
import theme from 'lib/theme'

import styles from './styles.module.css'

export class Paper extends Component {
  render() {
    const { className, ...rest } = this.props

    return <div className={theme(styles, 'paper', className)} {...rest} />
  }
}
