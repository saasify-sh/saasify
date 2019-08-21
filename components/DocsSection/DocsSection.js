import React, { Component } from 'react'

import { Section } from '../Section'

export class DocsSection extends Component {
  render() {
    return (
      <Section
        title='API Docs'
        subtitle='Simple && Straightforward.'
        {...this.props}
      />
    )
  }
}
