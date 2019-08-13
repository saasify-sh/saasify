import React, { Component } from 'react'

import AuthManager from 'store/AuthManager'

import {
  NavHeader,
  NavFooter,
  DocsSection,
  ReadmeSection,
  DemoSection,
  BlankSection,
  CTASection,
  SectionDivider
} from 'components'

import styles from './styles.module.css'

export class DocsPage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <NavHeader />

        <DocsSection inverted />

        <SectionDivider />

        <ReadmeSection />

        <SectionDivider inverted />

        {AuthManager.isAuthenticated ? (
          <BlankSection inverted />
        ) : (
          <CTASection inverted />
        )}

        <SectionDivider />

        <DemoSection />

        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
