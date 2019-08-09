import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { FinContext } from '../FinContext'

import styles from './styles.module.css'

export class EnterpriseSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <section className={styles.container}>
            <div className={styles.content}>
              <h1 className={styles.title}>
                Enterprise
              </h1>

              TODO
            </div>
          </section>
        )}
      </FinContext.Consumer>
    )
  }
}
