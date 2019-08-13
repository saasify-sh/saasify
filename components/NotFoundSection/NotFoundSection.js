import React, { Component } from 'react'

import { UndrawSVG } from '../UndrawSVG'

import styles from './styles.module.css'

export class NotFoundSection extends Component {
  render() {
    return (
      <section className={styles.container}>
        <div className={styles.content}>
          <h1>
            Page Not Found
          </h1>

          <p className={styles.subtitle}>
            Uh-oh, it looks like the page you're looking for doesn't exist.
          </p>

          <UndrawSVG
            name='page_not_found'
            className={styles.illustration}
          />
        </div>
      </section>
    )
  }
}
