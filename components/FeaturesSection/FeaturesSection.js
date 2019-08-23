import React, { Component } from 'react'
import theme from 'lib/theme'

import { Section } from '../Section'
import { UndrawSVG } from '../UndrawSVG'

import features from './features.json'
import styles from './styles.module.css'

export class FeaturesSection extends Component {
  render() {
    return (
      <Section
        id='features'
        title='Features'
        stretch
        {...this.props}
      >
        <div className={theme(styles, 'features')}>
          {features.map((feature) => (
            <div
              className={theme(styles, 'feature')}
              key={feature.title}
            >
              <UndrawSVG
                name={feature.undrawSVG}
                className={theme(styles, 'illustration')}
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
