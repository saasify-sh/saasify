import React, { Component } from 'react'

import { FinContext } from '../FinContext'
import { Section } from '../Section'
import { Markdown } from '../Markdown'

export class ReadmeSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => project.deployment.readme ? (
          <Section
            title='Readme'
            {...this.props}
          >
            <Markdown
              source={project.deployment.readme}
            />
          </Section>
        ) : (
          null
        )}
      </FinContext.Consumer>
    )
  }
}
