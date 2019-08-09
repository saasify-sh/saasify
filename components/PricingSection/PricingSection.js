import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { FinContext } from '../FinContext'

import styles from './styles.module.css'

export class PricingSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <section className={styles.container}>
            <div className={styles.content}>
              <h1 className={styles.title}>
                Pricing
              </h1>

              <p className={styles.desc}>
                Feel free to experiment with the the API for <b>FREE</b>! Once you're sure that it fits your use case, <Link to='/signup'>sign up</Link> for a subcription to remove the public rate limit.
              </p>
            </div>
          </section>
        )}
      </FinContext.Consumer>
    )
  }
}
