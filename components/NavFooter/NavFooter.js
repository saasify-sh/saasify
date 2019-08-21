import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

import { Logo } from '../Logo'

import styles from './styles.module.css'

@inject('auth')
@observer
export class NavFooter extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    const { auth } = this.props

    return (
      <footer className={styles.container}>
        <div className={styles.content}>
          <div className={styles.detailColumn}>
            <Link to='/'>
              <Logo className={styles.logo} />
            </Link>

            <div className={styles.detail}>
              Brooklyn, NY
            </div>
          </div>

          <div>
            <h3 className={styles.header}>Sitemap</h3>

            <ul>
              <li className={styles.listItem}>
                <Link
                  to='/'
                  className={styles.link}
                >
                  Home
                </Link>
              </li>

              <li className={styles.listItem}>
                <Link
                  to='/pricing'
                  className={styles.link}
                >
                  Pricing
                </Link>
              </li>

              <li className={styles.listItem}>
                <Link
                  to='/docs'
                  className={styles.link}
                >
                  Docs
                </Link>
              </li>

              <li className={styles.listItem}>
                {auth.isAuthenticated ? (
                  <Link
                    to='/dashboard'
                    className={styles.link}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to='/signup'
                    className={styles.link}
                  >
                    Get Started
                  </Link>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h3 className={styles.header}>Legal</h3>

            <ul>
              <li className={styles.listItem}>
                <Link
                  to='/terms'
                  className={styles.link}
                >
                  Terms
                </Link>
              </li>

              <li className={styles.listItem}>
                <Link
                  to='/privacy'
                  className={styles.link}
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={styles.header}>Support</h3>

            <ul>
              <li className={styles.listItem}>
                <a
                  href='mailto:support@functional-income.com'
                  className={styles.link}
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    )
  }
}
