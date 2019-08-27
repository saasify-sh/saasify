import React, { Component } from 'react'

import { Section } from '../Section'

export class DocsSection extends Component {
  render() {
    return (
      <Section
        id='docs'
        title='Documentation'
        {...this.props}
      />
    )
  }
}
