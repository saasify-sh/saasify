import React, { Component } from 'react'

import { Button } from 'antd'
import { SectionDivider } from '../SectionDivider'

import styles from './styles.module.css'

export class HeroSection extends Component {
  render() {
    return (
      <section className={styles.container}>
        <div className={styles.content}>
          <h1>
            NEVER BUILD AUTH AGAIN
          </h1>

          <p className={styles.subtitle}>
            Okta adds authentication, authorization, and user management to your web or mobile app within minutes.
          </p>

          <div className={styles.cta}>
            <Button type='primary' className={styles.signupButton}>
              Get Started
            </Button>
          </div>
        </div>

        <SectionDivider />
      </section>
    )
  }
}
