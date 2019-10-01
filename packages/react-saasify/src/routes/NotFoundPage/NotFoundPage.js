import React, { Component } from 'react'
import theme from 'lib/theme'

import {
  NavHeader,
  NavFooter,
  NotFoundSection,
  CTASection,
  SectionDivider
} from 'components'

import styles from './styles.module.css'

export class NotFoundPage extends Component {
  render() {
    return (
      <div className={theme(styles, 'not-found-page')}>
        <NavHeader />

        <NotFoundSection />

        <CTASection />

        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
