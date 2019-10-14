import React, { Component } from 'react'
import { theme } from 'react-saasify'

import {
  NavHeader,
  NavFooter,
  HeroSection,
  HowItWorksSection,
  UseCasesSection,
  CoreMissionSection,
  SocialProofSection,
  FeaturesSection,
  CTASection
} from 'components'

import styles from './styles.module.css'

export class HomePage extends Component {
  render() {
    return (
      <div className={theme(styles, 'home-page')}>
        <NavHeader />

        <HeroSection />

        <HowItWorksSection />

        <UseCasesSection inverted />

        <CoreMissionSection />

        <SocialProofSection inverted />

        <FeaturesSection />

        <CTASection />

        <NavFooter />
      </div>
    )
  }
}
