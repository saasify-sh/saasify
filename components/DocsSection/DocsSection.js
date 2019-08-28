import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { CTAButton } from '../CTAButton'
import { Section } from '../Section'

export class DocsSection extends Component {
  render() {
    return (
      <Section
        id='docs'
        title='Documentation'
        {...this.props}
      >
        <Link to='/docs/api'>
          <CTAButton>
            View API Reference
          </CTAButton>
        </Link>
      </Section>
    )
  }
}
