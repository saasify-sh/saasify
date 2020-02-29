import React, { Component } from 'react'
import { theme } from 'react-saasify'
import { withTracker } from 'lib/with-tracker'
import { observer, inject } from 'mobx-react'

import { NavHeader, NavFooter, ScrollToTopOnMount, Section } from 'components'

import styles from './styles.module.css'

@inject('auth')
@withTracker
@observer
export class DashboardPage extends Component {
  render() {
    return (
      <div className={theme(styles, 'dashboard-page')}>
        <NavHeader fixed />

        <ScrollToTopOnMount />

        <Section
          id='dashboard'
          title='Dashboard'
          className={theme(styles, 'dashboard')}
        />

        <NavFooter />
      </div>
    )
  }
}
