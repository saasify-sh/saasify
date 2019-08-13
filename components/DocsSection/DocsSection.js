import React, { Component } from 'react'

import { FinContext } from '../FinContext'
import { Section } from '../Section'

export class DocsSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <Section
            title='API Docs'
            subtitle='Simple && Straightforward.'
            {...this.props}
          />
        )}
      </FinContext.Consumer>
    )
  }
}
