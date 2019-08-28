import React, { Component } from 'react'

import { SaasifyContext } from '../SaasifyContext'
import { Section } from '../Section'
import { Markdown } from '../Markdown'

export class ReadmeSection extends Component {
  render() {
    return (
      <SaasifyContext.Consumer>
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
      </SaasifyContext.Consumer>
    )
  }
}
