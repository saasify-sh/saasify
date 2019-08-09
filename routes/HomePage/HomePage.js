import React, { Component } from 'react'

import {
  NavHeader,
  NavFooter,
  HeroSection,
  FeaturesSection,
  CTASection,
  IntroSection,
  SectionDivider
} from 'components'

import styles from './styles.module.css'

export class HomePage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <NavHeader />

        <HeroSection />

        <SectionDivider />

        <IntroSection />

        <SectionDivider inverted />

        <FeaturesSection />

        <SectionDivider />

        <CTASection />

        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
