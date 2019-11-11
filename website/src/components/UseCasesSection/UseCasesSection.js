import React, { Component } from 'react'

import { Section, theme } from 'react-saasify'

import styles from './styles.module.css'

export class UseCasesSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='use-cases'
        title='Use Cases'
        className={theme(styles, 'use-cases', className)}
        {...rest}
      >
        TODO
      </Section>
    )
  }
}
