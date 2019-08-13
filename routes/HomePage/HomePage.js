import React, { Component } from 'react'

import {
  NavHeader,
  NavFooter,
  HeroSection,
  FeaturesSection,
  CTASection,
  DemoSection,
  SectionDivider
} from 'components'

import styles from './styles.module.css'

export class HomePage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <NavHeader />

        <HeroSection inverted />

        <SectionDivider />

        <DemoSection />

        <SectionDivider inverted />

        <FeaturesSection inverted />

        <SectionDivider />

        <CTASection />

        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
