import React, { Component } from 'react'
import theme from 'lib/theme'

import { SaasifyContext } from '../SaasifyContext'

import styles from './styles.module.css'

export class Logo extends Component {
  render() {
    const { className, style = {}, light, ...rest } = this.props

    return (
      <SaasifyContext.Consumer>
        {(config) =>
          config.logo ? (
            <img
              className={theme(styles, 'logo', className)}
              src={(light && config.deployment?.saas?.logoLight) || config.logo}
              alt={`${config.name} Logo`}
              style={style}
              {...rest}
            />
          ) : (
            <div
              className={theme(styles, 'logo', className)}
              style={style}
              {...rest}
            >
              {config.name}
            </div>
          )
        }
      </SaasifyContext.Consumer>
    )
  }
}
