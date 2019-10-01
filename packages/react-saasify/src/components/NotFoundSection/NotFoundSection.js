import React, { Component } from 'react'
import theme from 'lib/theme'

import { Section } from '../Section'
import { UndrawSVG } from '../UndrawSVG'

import styles from './styles.module.css'

export class NotFoundSection extends Component {
  render() {
    return (
      <Section
        id='not-found'
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
          className={theme(styles, 'illustration')}
        />
      </Section>
    )
  }
}
