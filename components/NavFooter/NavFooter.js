import React, { Component } from 'react'
import { Icon } from 'antd'
import { Link } from 'react-router-dom'

import { FinContext } from '../FinContext'
import { Logo } from '../Logo'

import styles from './styles.module.css'

export class NavFooter extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
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
                    <a
                      href='/login'
                      className={styles.link}
                    >
                      Login
                    </a>
                  </li>

                  <li className={styles.listItem}>
                    <a
                      href='/create'
                      className={styles.link}
                    >
                      Signup
                    </a>
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
                      href='https://support.functional-income.com'
                      className={styles.link}
                    >
                      Support
                    </a>
                  </li>
                  <li className={styles.listItem}>
                    <div
                      className={styles.link}
                      onTouchTap={this._onTapSupport}
                    >
                      Live Chat
                    </div>
                  </li>

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
        )}
      </FinContext.Consumer>
    )
  }
}
