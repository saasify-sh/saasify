import React, { Component } from 'react'

import {
  NavHeader,
  NavFooter,
  PricingSection,
  EnterpriseSection,
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

        <SectionDivider />

        <EnterpriseSection />

        <CTASection />

        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
