import React, { Component } from 'react'

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
      <div className={styles.container}>
        <NavHeader />

        <NotFoundSection />

        <CTASection />

        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
