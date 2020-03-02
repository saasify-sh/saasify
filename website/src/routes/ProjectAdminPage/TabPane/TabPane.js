import React, { Component } from 'react'

import styles from './styles.module.css'

export class TabPane extends Component {
  render() {
    const { children } = this.props

    return <div className={styles.tabPane}>{children}</div>
  }
}
