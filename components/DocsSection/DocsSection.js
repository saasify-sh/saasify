import React, { Component } from 'react'

import { FinContext } from '../FinContext'

import styles from './styles.module.css'

export class DocsSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <section className={styles.container}>
            <div className={styles.content}>
              <h1 className={styles.title}>
                API Docs
              </h1>

              <div className={styles.subtitle}>
                Simple && Straightforward.
              </div>
            </div>
          </section>
        )}
      </FinContext.Consumer>
    )
  }
}
