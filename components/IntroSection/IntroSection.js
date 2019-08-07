import React, { Component } from 'react'

import { SectionDivider } from '../SectionDivider'
import { FinContext } from '../FinContext'
import { Markdown } from '../Markdown'

import styles from './styles.module.css'

export class IntroSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <section className={styles.container}>
            <div className={styles.content}>
              <Markdown
                source={project.lastPublishedDeployment.readme}
              />
            </div>

            <SectionDivider inverted />
          </section>
        )}
      </FinContext.Consumer>
    )
  }
}
