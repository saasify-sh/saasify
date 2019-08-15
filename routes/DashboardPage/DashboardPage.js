import React, { Component } from 'react'

import {
  NavHeader,
  NavFooter,
  SectionDivider,
  DashboardSection,
  OnboardingSection,
  BillingSourcesSection,
  InvoicingSection
} from 'components'

import styles from './styles.module.css'

export class DashboardPage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <NavHeader fixed />

        <DashboardSection />

        <OnboardingSection />

        <BillingSourcesSection />

        <InvoicingSection />

        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
