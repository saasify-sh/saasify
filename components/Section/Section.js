import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

import styles from './styles.module.css'

export class Section extends Component {
  static propTypes = {
    inverted: PropTypes.bool,
    stretch: PropTypes.bool,
    title: PropTypes.node,
    subtitle: PropTypes.node,
    desc: PropTypes.node,
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
      children
    } = this.props

    return (
      <section className={cs(styles.section, inverted && styles.inverted)}>
        <div className={cs(styles.content, stretch && styles.stretch)}>
          {title && (
            <h1 className={styles.title}>
              {title}
            </h1>
          )}

          {subtitle && (
            <h5 className={styles.subtitle}>
              {subtitle}
            </h5>
          )}

          {desc && (
            <p className={styles.desc}>
              {desc}
            </p>
          )}

          {children}
        </div>
      </section>
    )
  }
}
