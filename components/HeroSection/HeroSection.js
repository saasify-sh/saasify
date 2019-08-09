import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { CTAButton } from '../CTAButton'
import { FinContext } from '../FinContext'

import styles from './styles.module.css'

export class HeroSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <section className={styles.container}>
            <div className={styles.content}>
              <h1>
                {project.saas.heading}
              </h1>

              <p className={styles.subtitle}>
                {project.saas.subheading}
              </p>

              <div className={styles.cta}>
                <Link to='/signup'>
                  <CTAButton>
                    Get Started
                  </CTAButton>
                </Link>
              </div>
            </div>
          </section>
        )}
      </FinContext.Consumer>
    )
  }
}
