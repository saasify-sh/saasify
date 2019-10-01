import React, { Component } from 'react'
import theme from 'lib/theme'

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
      <div className={theme(styles, 'home-page')}>
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
