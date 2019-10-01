import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { SaasifyContext } from '../SaasifyContext'
import { Section } from '../Section'
import { CTAButton } from '../CTAButton'

export class HeroSection extends Component {
  render() {
    return (
      <SaasifyContext.Consumer>
        {deployment => (
          <Section
            id='hero'
            title={deployment.saas.heading}
            subtitle={deployment.saas.subheading}
            {...this.props}
          >
            <Link to='/signup'>
              <CTAButton>
                Get Started
              </CTAButton>
            </Link>
          </Section>
        )}
      </SaasifyContext.Consumer>
    )
  }
}
