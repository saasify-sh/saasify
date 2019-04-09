import React, { Component } from 'react'
import cs from 'classnames'

import { FinContext } from '../FinContext'

import styles from './styles.module.css'

export class Logo extends Component {
  render() {
    const {
      className,
      style = { },
      ...rest
    } = this.props

    return (
      <FinContext.Consumer>
        {project => (
          project.saas.logo ? (
            <img
              className={cs(styles.logo, className)}
              src={project.saas.logo}
              alt={`${project.saas.name} Logo`}
              style={{
                maxWidth: '3em',
                ...style
              }}
              {...rest}
            />
          ) : (
            <div
              className={cs(styles.logo, className)}
              style={style}
              {...rest}
            >
              {project.saas.name}
            </div>
          )
        )}
      </FinContext.Consumer>
    )
  }
}
