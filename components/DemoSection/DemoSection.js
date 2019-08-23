import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { FinContext } from '../FinContext'
import { Section } from '../Section'
import { LiveServiceDemo } from '../LiveServiceDemo'

// TODO: make service selectable

export class DemoSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {deployment => (
          <Section
            id='demo'
            title='Live Demo'
            desc={(
              <span>
                Feel free to experiment with the the API for <b>FREE</b>! Once you're sure that it fits your use case, <Link to='/signup'>sign up</Link> for a subcription to remove the public rate limit.
              </span>
            )}
            {...this.props}
          >
            <LiveServiceDemo
              project={deployment.project}
              deployment={deployment}
              service={deployment.services[0]}
            />
          </Section>
        )}
      </FinContext.Consumer>
    )
  }
}
