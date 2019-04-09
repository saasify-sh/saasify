import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

import { SectionDivider } from '../SectionDivider'
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
                <Link to='/login'>
                  <Button type='primary' className={styles.signupButton}>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            <SectionDivider />
          </section>
        )}
      </FinContext.Consumer>
    )
  }
}
