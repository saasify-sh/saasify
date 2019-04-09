import React, { Component } from 'react'

import {
  NavHeader,
  NavFooter,
  HeroSection,
  IntroSection
} from 'components'

import styles from './styles.module.css'

export class HomePage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <NavHeader />

        <HeroSection />

        <IntroSection />

        <NavFooter />
      </div>
    )
  }
}
