import React, { Component } from 'react'

import {
  NavHeader,
  NavFooter,
  DocsSection,
  ReadmeSection,
  DemoSection,
  BlankSection,
  SectionDivider
} from 'components'

import styles from './styles.module.css'

export class DocsPage extends Component {
  render() {
    return (
      <div className={styles.container}>
        <NavHeader />

        <DocsSection />

        <SectionDivider />

        <ReadmeSection />

        <SectionDivider inverted />
        <BlankSection />
        <SectionDivider />

        <DemoSection />

        <SectionDivider inverted />

        <NavFooter />
      </div>
    )
  }
}
