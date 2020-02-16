import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'
import raf from 'raf'

import { observer, inject } from 'mobx-react'

import { CTAButton } from '../CTAButton'
import { Button } from 'lib/antd'
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
                  : 'transparent',
              paddingBottom: expanded ? 24 : undefined
            }}
          >
            <div className={theme(styles, 'content')}>
              <div className={theme(styles, 'primary')}>
                <Link to='/'>
                  <span className={theme(styles, 'logo-image')}>
                    <Logo className={theme(styles, 'logo')} />
                    <Logo
                      className={theme(
                        styles,
                        'logo',
                        theme(styles, 'logo--light')
                      )}
                      light
                    />
                  </span>

                  {config.logo &&
                    config?.header?.displayName !== false &&
                    config?.deployment?.saas?.sections?.navHeader
                      ?.displayName !== false && (
                      <span className={theme(styles, 'logo-text')}>
                        {config?.deployment?.saas?.headerName
                          ? config.deployment.saas.headerName
                          : config?.name}
                      </span>
                    )}
                </Link>

                <div className={theme(styles, 'burger')}>
                  <Button
                    type='secondary'
                    inline
                    onClick={this.handleToggleExpanded}
                    icon='menu'
                  />
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
                    {config.header?.login !== false && (
                      <Link to='/logout' className={theme(styles, 'login')}>
                        <CTAButton type='secondary' inline>
                          Log out
                        </CTAButton>
                      </Link>
                    )}

                    {config.header?.dashboard !== false && (
                      <Link to='/dashboard'>
                        <CTAButton type='primary' inline>
                          Dashboard
                        </CTAButton>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className={theme(styles, 'actions')}>
                    {config.header?.login !== false && (
                      <Link to='/login' className={theme(styles, 'login')}>
                        <CTAButton type='secondary' inline>
                          Log in
                        </CTAButton>
                      </Link>
                    )}

                    {config.header?.signup !== false &&
                      (config.ctaOnClick ? (
                        <CTAButton
                          type='primary'
                          inline
                          onClick={config.ctaOnClick}
                        >
                          {config.ctaTextInline || 'Get started'}
                        </CTAButton>
                      ) : (
                        <Link to='/signup'>
                          <CTAButton type='primary' inline>
                            {config.ctaTextInline || 'Get started'}
                          </CTAButton>
                        </Link>
                      ))}
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
