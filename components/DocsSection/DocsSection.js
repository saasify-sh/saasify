import React, { Component } from 'react'

import { Section } from '../Section'

export class DocsSection extends Component {
  render() {
    return (
      <Section
        id='docs'
        title='API Docs'
        subtitle='Simple && Straightforward.'
        {...this.props}
      />
    )
  }
}
