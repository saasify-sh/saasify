import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'

import { observer, inject } from 'mobx-react'

import Link from './Link'
import { SaasifyContext } from '../SaasifyContext'
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
      <SaasifyContext.Consumer>
        {(config) => (
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

                <div className={theme(styles, 'detail')}>Brooklyn, NY</div>
              </div>

              {config.footer.columns.map((column) => (
                <div key={column.label}>
                  <h3 className={theme(styles, 'header')}>{column.label}</h3>

                  <ul>
                    {column.links.map((link) => {
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
        )}
      </SaasifyContext.Consumer>
    )
  }
}
