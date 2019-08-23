import React, { Component } from 'react'
import theme from 'lib/theme'

import {
  NavHeader,
  NavFooter,
  PricingSection,
  EnterpriseSection,
  CTASection,
  SectionDivider
} from 'components'

import styles from './styles.module.css'

export class PricingPage extends Component {
  render() {
    return (
      <div className={theme(styles, 'pricing-page')}>
        <NavHeader />

        <PricingSection inverted />

        <SectionDivider />

        <EnterpriseSection />

        <CTASection />

        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
