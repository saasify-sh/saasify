import React, { Component } from 'react'

import {
  NavHeader,
  NavFooter,
  SectionDivider,
  DashboardSection,
  ProfileSection,
  OnboardingSection,
  BillingSourcesSection,
  BillingUsageSection,
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

        <ProfileSection />

        <BillingUsageSection />

        <BillingSourcesSection />

        <InvoicingSection />

        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
