import React, { Component } from 'react'

import {
  NavHeader,
  NavFooter,
  PricingSection,
  CTASection,
  SectionDivider
} from 'components'

import styles from './styles.module.css'

export class PricingPage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <NavHeader />

        <PricingSection />

        <CTASection />

        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
