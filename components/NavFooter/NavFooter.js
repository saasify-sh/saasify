import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

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
      <footer
        className={theme(styles, 'container')}
        style={{
          background: theme['@section-fg-color']
        }}
      >
        <div className={theme(styles, 'content')}>
          <div className={theme(styles, 'detailColumn')}>
            <Link to='/'>
              <Logo className={theme(styles, 'logo')} />
            </Link>

            <div className={theme(styles, 'detail')}>
              Brooklyn, NY
            </div>
          </div>

          <div>
            <h3 className={theme(styles, 'header')}>Sitemap</h3>

            <ul>
              <li className={theme(styles, 'listItem')}>
                <Link
                  to='/'
                  className={theme(styles, 'link')}
                >
                  Home
                </Link>
              </li>

              <li className={theme(styles, 'listItem')}>
                <Link
                  to='/pricing'
                  className={theme(styles, 'link')}
                >
                  Pricing
                </Link>
              </li>

              <li className={theme(styles, 'listItem')}>
                <Link
                  to='/docs'
                  className={theme(styles, 'link')}
                >
                  Docs
                </Link>
              </li>

              <li className={theme(styles, 'listItem')}>
                {auth.isAuthenticated ? (
                  <Link
                    to='/dashboard'
                    className={theme(styles, 'link')}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to='/signup'
                    className={theme(styles, 'link')}
                  >
                    Get Started
                  </Link>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h3 className={theme(styles, 'header')}>Legal</h3>

            <ul>
              <li className={theme(styles, 'listItem')}>
                <Link
                  to='/terms'
                  className={theme(styles, 'link')}
                >
                  Terms
                </Link>
              </li>

              <li className={theme(styles, 'listItem')}>
                <Link
                  to='/privacy'
                  className={theme(styles, 'link')}
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={theme(styles, 'header')}>Support</h3>

            <ul>
              <li className={theme(styles, 'listItem')}>
                <a
                  href='mailto:support@saasify.xyz'
                  className={theme(styles, 'link')}
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
