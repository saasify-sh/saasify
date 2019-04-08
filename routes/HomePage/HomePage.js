import React, { Component } from 'react'
import { Link } from 'react-router-dom'

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

        <Link to='/login'>Login</Link>

        <IntroSection />

        <NavFooter />
      </div>
    )
  }
}
