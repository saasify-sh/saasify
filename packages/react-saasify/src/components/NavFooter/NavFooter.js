import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

import { observer, inject } from 'mobx-react'

import { Logo } from '../Logo'
import Link from './Link'

import styles from './styles.module.css'

@inject('auth')
@inject('config')
@observer
export class NavFooter extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    inverted: PropTypes.bool
  }

  static defaultProps = {
    inverted: false
  }

  render() {
    const { auth, className, inverted, style, config } = this.props

    return (
      <footer
        className={theme(styles, 'nav-footer', className)}
        style={{
          background: inverted
            ? theme['@section-bg-color']
            : theme['@section-fg-color'],
          ...style
        }}
      >
        <div className={theme(styles, 'content')}>
          <div className={theme(styles, 'detailColumn')}>
            <Link to='/'>
              <Logo className={theme(styles, 'logo')} />
            </Link>

            <div className={theme(styles, 'detail')}>Brooklyn, NY</div>
          </div>

          {config.footer?.columns?.map((column) => (
            <div key={column.label}>
              <h3 className={theme(styles, 'header')}>{column.label}</h3>

              <ul>
                {column?.links?.map((link) => {
                  if (typeof link === 'function') {
                    link = link({ config, auth })
                    if (!link) return null
                  }

                  return (
                    <li
                      key={link.to || link.href}
                      className={theme(styles, 'listItem')}
                    >
                      <Link {...link} />
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    )
  }
}
