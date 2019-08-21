import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { FinContext } from '../FinContext'
import { Section } from '../Section'
import { CTAButton } from '../CTAButton'

export class HeroSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {deployment => (
          <Section
            title={deployment.project.saas.heading}
            subtitle={deployment.project.saas.subheading}
            {...this.props}
          >
            <Link to='/signup'>
              <CTAButton>
                Get Started
              </CTAButton>
            </Link>
          </Section>
        )}
      </FinContext.Consumer>
    )
  }
}
