import React, { Component } from 'react'

import {
  NavHeader,
  NavFooter,
  SectionDivider,
  DashboardSection,
  OnboardingSection
} from 'components'

import styles from './styles.module.css'

export class DashboardPage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <NavHeader fixed />

        <DashboardSection />
        <OnboardingSection />

        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
