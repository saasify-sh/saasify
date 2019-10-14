import React, { Component } from 'react'

import {
  Section,
  theme
} from 'react-saasify'

import styles from './styles.module.css'

export class CoreMissionSection extends Component {
  render() {
    const {
      className,
      ...rest
    } = this.props

    return (
      <Section
        id='mission'
        title='Mission'
        className={theme(styles, 'mission', className)}
        {...rest}
      >
        <div className={theme(styles, 'mission-statement')}>
          Saasify's mission is to make it easier for open source authors to fund their passion.
        </div>

        <p className={theme(styles, 'mission-body')}>
          OSS is an extremely powerful and rewarding outlet for developers to innovate outside of traditional academic and corporate careers. The problem, however, is the huge disparity that exists in the market between how passionate many developers are about OSS and how valuable it is to almost every business in existence versus how practical it is to make even a basic living off of it.
        </p>

        <p className={theme(styles, 'mission-body')}>
          Patreon &amp; Open Collective help with a very small percentage of this problem because the business model of voluntarily giving back to OSS projects &amp; authors is inherently weak.
        </p>

        <p className={theme(styles, 'mission-body')}>
          Contrast this with the standard SaaS API business model of paying based on usage that aligns much more naturally with how businesses actually pay for software critical to their core business needs.
        </p>

        <p className={theme(styles, 'mission-body')}>
          Saasify is aiming to bridge the gap between this discrepancy by reducing the barrier to entry for developers who are interested in earning passive income via SaaS.
        </p>
      </Section>
    )
  }
}
