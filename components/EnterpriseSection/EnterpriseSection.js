import React, { Component } from 'react'

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

              <p>
                For questions regarding bulk pricing, dedicated support, customization, self-hosting, or other enterprise considerations, please <a href='mailto:info@functional-income.com'>contact us</a>.
              </p>
            </div>
          </section>
        )}
      </FinContext.Consumer>
    )
  }
}
