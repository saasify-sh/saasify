import React, { Component } from 'react'
import { theme } from 'react-saasify'

import {
  NavHeader,
  NavFooter,
  TeamSection,
  MissionSection,
  CTASection,
  ScrollToTopOnMount
} from 'components'

import styles from './styles.module.css'

export class AboutPage extends Component {
  render() {
    return (
      <div className={theme(styles, 'about-page')}>
        <NavHeader />

        <ScrollToTopOnMount />

        <TeamSection />

        <MissionSection />

        <CTASection cta='Join us in our mission today!' />

        <NavFooter />
      </div>
    )
  }
}
