import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'
import raf from 'raf'

import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

import { CTAButton } from '../CTAButton'
import { Logo } from '../Logo'

import styles from './styles.module.css'

const isServer = (typeof window === 'undefined')

@inject('auth')
@observer
export class NavHeader extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    fixed: PropTypes.bool
  }

  static defaultProps = {
    fixed: false
  }

  state = {
    attached: (isServer || window.scrollY > 0)
  }

  componentDidMount() {
    if (!isServer) {
      window.addEventListener('scroll', this._onScroll)
      this._onScrollAF()
    }
  }

  componentWillUnmount() {
    if (!isServer) {
      window.removeEventListener('scroll', this._onScroll)
    }

    if (this._scrollRaf) {
      raf.cancel(this._scrollRaf)
      this._scrollRaf = null
    }
  }

  render() {
    const { auth, fixed } = this.props
    const { attached } = this.state

    return (
      <header
        className={theme(styles, 'container', attached || fixed ? theme(styles, 'attached') : null)}
      >
        <div className={theme(styles, 'content')}>
          <div className={theme(styles, 'links')}>
            <Link
              to='/'
            >
              <Logo className={theme(styles, 'logo')} />
            </Link>

            <Link
              to='/'
              className={theme(styles, 'link')}
            >
              Home
            </Link>

            <Link
              to='/pricing'
              className={theme(styles, 'link')}
            >
              Pricing
            </Link>

            <Link
              to='/docs'
              className={theme(styles, 'link')}
            >
              Docs
            </Link>

            <a
              href='mailto:support@functional-income.com'
              className={theme(styles, 'link')}
            >
              Support
            </a>
          </div>

          {auth.isAuthenticated ? (
            <div>
              <Link to='/logout' className={theme(styles, 'login')}>
                <CTAButton type='secondary' inline>
                  LOGOUT
                </CTAButton>
              </Link>

              <Link to='/dashboard'>
                <CTAButton type='primary' inline>
                  DASHBOARD
                </CTAButton>
              </Link>
            </div>
          ) : (
            <div>
              <Link to='/login' className={theme(styles, 'login')}>
                <CTAButton type='secondary' inline>
                  LOGIN
                </CTAButton>
              </Link>

              <Link to='/signup'>
                <CTAButton type='primary' inline>
                  SIGNUP
                </CTAButton>
              </Link>
            </div>
          )}
        </div>
      </header>
    )
  }

  _onScroll = () => {
    if (!this._scrollRaf) {
      this._scrollRaf = raf(this._onScrollAF)
    }
  }

  _onScrollAF = () => {
    this._scrollRaf = null

    this.setState({
      attached: (isServer || window.scrollY > 0)
    })
  }
}
