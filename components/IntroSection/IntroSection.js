import React, { Component } from 'react'

import { SectionDivider } from '../SectionDivider'

import styles from './styles.module.css'

export class IntroSection extends Component {
  render() {
    return (
      <section className={styles.container}>
        <div className={styles.content}>
          <h2>
            TODO: Intro Section
          </h2>
        </div>

        <SectionDivider inverted />
      </section>
    )
  }
}
