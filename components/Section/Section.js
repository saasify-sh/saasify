import React, { Component } from 'react'
import PropTypes from 'prop-types'
import theme from 'lib/theme'
import slugify from '@sindresorhus/slugify'

import styles from './styles.module.css'

export class Section extends Component {
  static propTypes = {
    inverted: PropTypes.bool,
    stretch: PropTypes.bool,
    title: PropTypes.node,
    subtitle: PropTypes.node,
    desc: PropTypes.node,
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node
  }

  static defaultProps = {
    inverted: false,
    stretch: false
  }

  render() {
    const {
      inverted,
      stretch,
      title,
      subtitle,
      desc,
      id,
      className,
      children
    } = this.props

    const sectionProps = { }

    if (id || title) {
      sectionProps.id = id || slugify(title.toLowerCase())
    }

    const themeArgs = [
      styles,
      'section',
      theme(styles, `${sectionProps.id}-section`),
      inverted && theme(styles, 'inverted'),
      className
    ]

    return (
      <section
        className={theme(...themeArgs)}
        {...sectionProps}
      >
        <div className={theme(styles, 'content', stretch && theme(styles, 'stretch'))}>
          {title && (
            <h1 className={theme(styles, 'title')}>
              {title}
            </h1>
          )}

          {subtitle && (
            <h5 className={theme(styles, 'subtitle')}>
              {subtitle}
            </h5>
          )}

          {desc && (
            <p className={theme(styles, 'desc')}>
              {desc}
            </p>
          )}

          {children}
        </div>
      </section>
    )
  }
}
