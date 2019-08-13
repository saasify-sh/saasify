import React, { Component } from 'react'

import { FinContext } from '../FinContext'
import { Markdown } from '../Markdown'

import styles from './styles.module.css'

export class ReadmeSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => project.deployment.readme ? (
          <section className={styles.container}>
            <div className={styles.content}>
              <h1 className={styles.title}>
                Readme
              </h1>

              <Markdown
                source={project.deployment.readme}
              />
            </div>
          </section>
        ) : (
          null
        )}
      </FinContext.Consumer>
    )
  }
}
