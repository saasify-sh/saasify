import React, { Component } from 'react'
import cs from 'classnames'

import styles from './styles.module.css'

export class TabPane extends Component {
  render() {
    const { className, children, ...rest } = this.props

    return (
      <div className={cs(styles.tabPane, className)} {...rest}>
        {children}
      </div>
    )
  }
}
