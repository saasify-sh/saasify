import React, { Component } from 'react'
import theme from 'lib/theme'

import { Link } from 'react-router-dom'

import AuthManager from 'store/AuthManager'

import {
  NavHeader,
  NavFooter,
  DocsSection,
  ReadmeSection,
  DemoSection,
  BlankSection,
  CTAButton,
  CTASection,
  SectionDivider
} from 'components'

import styles from './styles.module.css'

export class DocsPage extends Component {
  render() {
    return (
      <div className={theme(styles, 'docs-page')}>
        <NavHeader />

        <DocsSection inverted />

        <SectionDivider />

        <ReadmeSection />

        <SectionDivider inverted />

        {AuthManager.isAuthenticated ? (
          <BlankSection inverted>
            <Link to='/docs/api'>
              <CTAButton>
                View API Reference
              </CTAButton>
            </Link>
          </BlankSection>
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
