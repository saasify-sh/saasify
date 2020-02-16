import React, { Component } from 'react'
import { theme } from 'react-saasify'

import { NavHeader, NavFooter, ScrollToTopOnMount, Section } from 'components'

import catImage from './cat-in-space.svg'

import styles from './styles.module.css'

export class EmailConfirmedPage extends Component {
  render() {
    return (
      <div className={theme(styles, 'email-confirmed-page')}>
        <NavHeader />

        <ScrollToTopOnMount />

        <Section id='email-confirmed' title='Email Confirmed'>
          <img
            src={catImage}
            alt='Cat in space'
            className={styles.illustration}
          />
        </Section>

        <NavFooter />
      </div>
    )
  }
}
