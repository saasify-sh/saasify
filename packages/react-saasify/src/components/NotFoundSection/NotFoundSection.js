import React, { Component } from 'react'
import theme from 'lib/theme'

import { Section } from '../Section'
import { UndrawSVG } from '../UndrawSVG'

import styles from './styles.module.css'

export class NotFoundSection extends Component {
  render() {
    const subtitle = (
      <span>
        Uh-oh, it looks like the page you're looking for doesn't exist.
      </span>
    )

    return (
      <Section
        id='not-found'
        title='Page Not Found'
        subtitle={subtitle}
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
