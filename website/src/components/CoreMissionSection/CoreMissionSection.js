import React, { Component } from 'react'

import { Section, Paper, theme } from 'react-saasify'

import styles from './styles.module.css'

export class CoreMissionSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='mission'
        title='Mission'
        className={theme(styles, 'mission', className)}
        {...rest}
      >
        <Paper className={theme(styles, 'mission-wrapper')}>
          <div className={theme(styles, 'mission-statement')}>
            Our mission is to provide sustainable funding for open source.
          </div>

          <p className={theme(styles, 'mission-body')}>
            If you've ever struggled to make a living working on open source, we
            hear you.
          </p>

          <p className={theme(styles, 'mission-body')}>
            OSS can be extremely powerful and rewarding, but there is a huge
            problem that exists in the market between how valuable open source
            is to every business in existence versus how difficult it is for OSS
            developers to capture any of that value.
          </p>

          <p className={theme(styles, 'mission-body')}>
            Patreon and donations help with a very small percentage of this
            problem because the business model of voluntarily giving back to OSS
            is inherently weak.
          </p>

          <p className={theme(styles, 'mission-body')}>
            Contrast this with the standard SaaS API business model of paying
            based on usage that aligns much more naturally with how businesses
            actually pay for software critical to their core business needs.
          </p>

          <p className={theme(styles, 'mission-body')}>
            Saasify is aiming to bridge the gap between this disparity by
            reducing the barrier to entry for developers who are interested in
            earning passive income via SaaS.
          </p>

          <p className={theme(styles, 'mission-body')}>
            Travis Fischer
            <br />
            Founder
          </p>
        </Paper>
      </Section>
    )
  }
}
