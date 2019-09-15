import React, { Component } from 'react'
import theme from 'lib/theme'

import { SaasifyContext } from '../SaasifyContext'

import styles from './styles.module.css'

export class Logo extends Component {
  render() {
    const {
      className,
      style = { },
      ...rest
    } = this.props

    return (
      <SaasifyContext.Consumer>
        {deployment => (
          deployment.saas.logo ? (
            <img
              className={theme(styles, 'logo', className)}
              src={deployment.saas.logo}
              alt={`${deployment.saas.name} Logo`}
              style={{
                maxWidth: '3em',
                minHeight: 64,
                ...style
              }}
              {...rest}
            />
          ) : (
            <div
              className={theme(styles, 'logo', className)}
              style={style}
              {...rest}
            >
              {deployment.saas.name}
            </div>
          )
        )}
      </SaasifyContext.Consumer>
    )
  }
}
