import React, { Component } from 'react'

import { FinContext } from '../FinContext'
import { Section } from '../Section'
import { Markdown } from '../Markdown'

export class ReadmeSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {deployment => deployment.readme ? (
          <Section
            id='readme'
            title='Readme'
            {...this.props}
          >
            <Markdown
              source={atob(deployment.readme)}
            />
          </Section>
        ) : (
          null
        )}
      </FinContext.Consumer>
    )
  }
}
