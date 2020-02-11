import React, { Component } from 'react'

import { Section, theme } from 'react-saasify'

import styles from './styles.module.css'

export class ExamplesSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='examples'
        title='Examples'
        className={theme(styles, 'examples', className)}
        {...rest}
      >
        TODO
      </Section>
    )
  }
}
