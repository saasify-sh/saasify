import React, { Component } from 'react'
import { theme } from 'react-saasify'

import { NavHeader, NavFooter, NotFoundSection } from 'components'

import styles from './styles.module.css'

export class NotFoundPage extends Component {
  render() {
    return (
      <div className={theme(styles, 'not-found-page')}>
        <NavHeader />

        <NotFoundSection />

        <NavFooter />
      </div>
    )
  }
}
