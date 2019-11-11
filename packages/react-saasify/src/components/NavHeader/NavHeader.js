import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'
import raf from 'raf'

import { observer, inject } from 'mobx-react'

import { CTAButton } from '../CTAButton'
import { Logo } from '../Logo'
import { SaasifyContext } from '../SaasifyContext'

import Link from './Link'
import styles from './styles.module.css'

const isServer = typeof window === 'undefined'

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
    attached: isServer || window.scrollY > 0,
    expanded: false
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

  handleToggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    const { auth, fixed } = this.props
    const { attached, expanded } = this.state

    return (
      <SaasifyContext.Consumer>
        {(config) => (
          <header
            className={theme(
              styles,
              'container',
              attached || fixed ? theme(styles, 'attached') : null,
              expanded ? theme(styles, 'expanded') : null
            )}
            style={{
              background:
                attached || fixed || expanded
                  ? theme['@section-fg-color']
                  : 'transparent'
            }}
          >
            <div className={theme(styles, 'content')}>
              <div className={theme(styles, 'primary')}>
                <Link to='/'>
                  <Logo className={theme(styles, 'logo')} />

                  {config.logo && (
                    <span className={theme(styles, 'logo-text')}>
                      {config.name}
                    </span>
                  )}
                </Link>

                <div className={theme(styles, 'burger')}>
                  <CTAButton
                    type='secondary'
                    inline
                    onClick={this.handleToggleExpanded}
                  >
                    Menu
                  </CTAButton>
                </div>
              </div>

              <div className={theme(styles, 'content-body')}>
                <div className={theme(styles, 'links')}>
                  {config.header.links.map((link) => {
                    if (typeof link === 'function') {
                      link = link({ config, auth, fixed, attached })
                      if (!link) return null
                    }

                    return <Link key={link.to || link.href} {...link} />
                  })}
                </div>

                {auth.isAuthenticated ? (
                  <div className={theme(styles, 'actions')}>
                    <Link to='/logout' className={theme(styles, 'login')}>
                      <CTAButton type='secondary' inline>
                        Log Out
                      </CTAButton>
                    </Link>

                    <Link to='/dashboard'>
                      <CTAButton type='primary' inline>
                        Dashboard
                      </CTAButton>
                    </Link>
                  </div>
                ) : (
                  <div className={theme(styles, 'actions')}>
                    <Link to='/login' className={theme(styles, 'login')}>
                      <CTAButton type='secondary' inline>
                        Log In
                      </CTAButton>
                    </Link>

                    <Link to='/signup'>
                      <CTAButton type='primary' inline>
                        Get Started
                      </CTAButton>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </header>
        )}
      </SaasifyContext.Consumer>
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
      attached: isServer || window.scrollY > 0
    })
  }
}
