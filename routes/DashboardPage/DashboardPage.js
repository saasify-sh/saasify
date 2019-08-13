import React, { Component } from 'react'

import {
  NavHeader,
  NavFooter,
  SectionDivider,
  BlankSection
} from 'components'

import styles from './styles.module.css'

export class DashboardPage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <NavHeader />

        <BlankSection inverted />
        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
