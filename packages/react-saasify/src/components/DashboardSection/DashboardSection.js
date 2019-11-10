import React, { Component } from 'react'
import theme from 'lib/theme'

import { Section } from '../Section'

import styles from './styles.module.css'

export class DashboardSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='dashboard'
        title='Dashboard'
        className={theme(styles, 'dashboard', className)}
        {...rest}
      />
    )
  }
}
