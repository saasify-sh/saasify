import React, { Component } from 'react'

import { Section, Paper, theme } from 'react-saasify'

import styles from './styles.module.css'

export class MissionSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='mission'
        title='Mission'
        className={theme(styles, 'mission', className)}
        {...rest}
      >
        <Paper className={theme(styles, 'mission-body')}>
          <h5 className={theme(styles, 'mission-statement')}>
            Our mission is to help developers realize the full potential of
            their passion projects.
          </h5>

          <p>TODO</p>

          <p>
            Travis Fischer
            <br />
            Founder
          </p>
        </Paper>
      </Section>
    )
  }
}
