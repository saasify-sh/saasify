import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from 'react-saasify'

import styles from './styles.module.css'

const iconStyle = {
  marginRight: '0.5em'
}

export class TabBar extends Component {
  render() {
    const { tabs } = this.props

    return (
      <div className={styles.tabBar}>
        {tabs.map((tab) => (
          <NavLink
            exact
            to={tab.to}
            key={tab.key}
            className={styles.tab}
            activeClassName={styles.activeTab}
          >
            {tab.icon && (
              <Icon theme='outlined' style={iconStyle} {...tab.icon} />
            )}

            {tab.label}
          </NavLink>
        ))}
      </div>
    )
  }
}
