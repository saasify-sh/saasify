import React, { Component } from 'react'

import { CTAButton, Section, theme } from 'react-saasify'

import styles from './styles.module.css'

export class HeroSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='hero'
        title='Launch your SaaS API today.'
        subtitle={
          <>
            <div className={theme(styles, 'desc')}>
              We handle billing, user accounts, docs, and a polished landing
              page.
            </div>
            <div>So you can focus on your product.</div>
          </>
        }
        className={theme(styles, 'hero', className)}
        {...rest}
      >
        <CTAButton>Get started</CTAButton>
      </Section>
    )
  }
}
