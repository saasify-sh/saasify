import React, { Component } from 'react'
import { theme } from 'react-saasify'

import {
  NavHeader,
  NavFooter,
  HeroSection,
  BenefitsSection,
  ExamplesSection,
  SocialProofSection,
  HowItWorksSection,
  FeaturesSection,
  CTASection,
  ScrollToTopOnMount
} from 'components'

import styles from './styles.module.css'

export class HomePage extends Component {
  render() {
    return (
      <div className={theme(styles, 'home-page')}>
        <NavHeader className={styles.header} />

        <ScrollToTopOnMount />

        <HeroSection />

        <BenefitsSection className={theme(styles, 'preClean')} />

        <HowItWorksSection className={theme(styles, 'clean')} />

        <ExamplesSection />

        <SocialProofSection className={theme(styles, 'preClean')} />

        <FeaturesSection className={theme(styles, 'clean')} />

        <CTASection />

        <NavFooter />
      </div>
    )
  }
}
