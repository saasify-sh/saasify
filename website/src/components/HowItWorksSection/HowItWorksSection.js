import React, { Component } from 'react'

import {
  Section,
  theme
} from 'react-saasify'

import styles from './styles.module.css'

export class HowItWorksSection extends Component {
  render() {
    const {
      className,
      ...rest
    } = this.props

    return (
      <Section
        id='how-it-works'
        title='How It Works'
        className={theme(styles, 'how-it-works', className)}
        {...rest}
      >
        TODO
      </Section>
    )
  }
}
