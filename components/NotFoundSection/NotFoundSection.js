import React, { Component } from 'react'

import { Section } from '../Section'
import { UndrawSVG } from '../UndrawSVG'

import styles from './styles.module.css'

export class NotFoundSection extends Component {
  render() {
    return (
      <Section
        title='Page Not Found'
        subtitle={(
          <span>
            Uh-oh, it looks like the page you're looking for doesn't exist.
          </span>
        )}
        {...this.props}
      >
        <UndrawSVG
          name='page_not_found'
          className={styles.illustration}
        />
      </Section>
    )
  }
}
