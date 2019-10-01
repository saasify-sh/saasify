import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { CTAButton } from '../CTAButton'
import { Section } from '../Section'

export class CTASection extends Component {
  render() {
    return (
      <Section {...this.props}>
        <Link to='/signup'>
          <CTAButton>
            Get Started For Free!
          </CTAButton>
        </Link>
      </Section>
    )
  }
}
