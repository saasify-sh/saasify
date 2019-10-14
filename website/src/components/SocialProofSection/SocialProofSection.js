import React, { Component } from 'react'

import {
  Section,
  theme
} from 'react-saasify'

import styles from './styles.module.css'

export class SocialProofSection extends Component {
  render() {
    const {
      className,
      ...rest
    } = this.props

    return (
      <Section
        id='social'
        title='We ❤️ Developers'
        className={theme(styles, 'social', className)}
        {...rest}
      >
        TODO
      </Section>
    )
  }
}
