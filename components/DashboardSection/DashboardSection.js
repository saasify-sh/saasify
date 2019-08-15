import React, { Component } from 'react'

import { FinContext } from '../FinContext'
import { Section } from '../Section'

export class DashboardSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <Section
            title='Dashboard'
            {...this.props}
          />
        )}
      </FinContext.Consumer>
    )
  }
}
