import React, { Component } from 'react'
import { theme } from 'react-saasify'

import {
  NavHeader,
  NavFooter,
  HowItWorksSection,
  FeaturesSection,
  CTASection,
  ScrollToTopOnMount
} from 'components'

import styles from './styles.module.css'

export class HowItWorksPage extends Component {
  render() {
    return (
      <div className={theme(styles, 'how-it-works-page')}>
        <NavHeader />

        <ScrollToTopOnMount />

        <HowItWorksSection />

        <FeaturesSection />

        <CTASection />

        <NavFooter />
      </div>
    )
  }
}
