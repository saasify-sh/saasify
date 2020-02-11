import React, { Component } from 'react'

import { CTAButton, Section, theme } from 'react-saasify'

import styles from './styles.module.css'

export class HeroSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='hero'
        title='Start monetizing your API today'
        subtitle={
          <>
            <div className={theme(styles, 'desc')}>
              Saasify generates a polished marketing site that handles user
              accounts, billing, subscriptions, and beautiful developer docs.
              {/*
              Quit worrying about SaaS boilerplate. We handle all the boring stuff for you.
              */}
              {/*
              We handle billing, user accounts, docs, and provide a polished landing page.
              */}
            </div>

            <div>So you can focus on what matters.</div>
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
