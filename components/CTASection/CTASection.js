import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { FinContext } from '../FinContext'
import { CTAButton } from '../CTAButton'

import styles from './styles.module.css'

export class CTASection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <section className={styles.container}>
            <div className={styles.content}>
              <Link to='/signup'>
                <CTAButton>
                  Get Started
                </CTAButton>
              </Link>
            </div>
          </section>
        )}
      </FinContext.Consumer>
    )
  }
}
