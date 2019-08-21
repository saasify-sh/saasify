import React, { Component } from 'react'
import cs from 'classnames'

import { Section } from '../Section'

import styles from './styles.module.css'

export class DashboardSection extends Component {
  render() {
    const {
      className,
      ...rest
    } = this.props

    return (
      <Section
        title='Dashboard'
        className={cs(styles.dashboard, className)}
        {...rest}
      />
    )
  }
}
