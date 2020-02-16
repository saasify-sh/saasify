import React, { Component } from 'react'
import { theme } from 'react-saasify'

import {
  NavHeader,
  NavFooter,
  HeroSection,
  BenefitsSection,
  ExamplesSection,
  SocialProofSection,
  CTASection,
  ScrollToTopOnMount
} from 'components'

import styles from './styles.module.css'

export class HomePage extends Component {
  render() {
    return (
      <div className={theme(styles, 'home-page')}>
        <NavHeader />

        <ScrollToTopOnMount />

        <HeroSection />

        <BenefitsSection />

        <ExamplesSection />

        <SocialProofSection />

        <CTASection />

        <NavFooter />
      </div>
    )
  }
}
