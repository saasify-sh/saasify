import React, { Component } from 'react'

import { Section, theme } from 'react-saasify'

import styles from './styles.module.css'

export class AboutSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='about'
        title='Saasify'
        className={theme(styles, 'about', className)}
        {...rest}
      >
        TODO
      </Section>
    )
  }
}
