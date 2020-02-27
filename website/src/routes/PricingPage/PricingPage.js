import React, { Component } from 'react'
import { theme } from 'react-saasify'

import {
  NavHeader,
  NavFooter,
  PricingSection,
  FAQSection,
  CTASection,
  ScrollToTopOnMount
} from 'components'

import styles from './styles.module.css'

export class PricingPage extends Component {
  render() {
    return (
      <div className={theme(styles, 'pricing-page')}>
        <NavHeader />

        <ScrollToTopOnMount />

        <PricingSection className={theme(styles, 'preClean')} />

        <FAQSection className={theme(styles, 'clean')} />

        <CTASection />

        <NavFooter />
      </div>
    )
  }
}
