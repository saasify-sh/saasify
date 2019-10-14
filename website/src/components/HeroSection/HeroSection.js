import React, { Component } from 'react'

import {
  CTAButton,
  Section,
  theme
} from 'react-saasify'

export class HeroSection extends Component {
  render() {
    const {
      className,
      ...rest
    } = this.props

    return (
      <Section
        id='hero'
        title='Monetize Your OSS Projects'
        subtitle='The platform for monetizable serverless functions that empower the open source authors you love.'
        className={theme(null, 'hero', className)}
        {...rest}
      >
        <CTAButton>
          Get Started
        </CTAButton>
      </Section>
    )
  }
}
