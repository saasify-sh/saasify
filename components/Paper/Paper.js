import React, { Component } from 'react'
import cs from 'classnames'

import styles from './styles.module.css'

export class Paper extends Component {
  render() {
    const {
      className,
      ...rest
    } = this.props

    return (
      <div
        className={cs(styles.paper, className)}
        {...rest}
      />
    )
  }
}
