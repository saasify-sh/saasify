import React, { Component } from 'react'

import { Section } from '../Section'
import { UndrawSVG } from '../UndrawSVG'

import features from './features.json'
import styles from './styles.module.css'

export class FeaturesSection extends Component {
  render() {
    return (
      <Section
        title='Features'
        stretch
        {...this.props}
      >
        <div className={styles.features}>
          {features.map((feature) => (
            <div
              className={styles.feature}
              key={feature.title}
            >
              <UndrawSVG
                name={feature.undrawSVG}
                className={styles.illustration}
              />

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>
    )
  }
}
