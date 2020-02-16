import React, { Component } from 'react'

import { Section, theme } from 'react-saasify'

import { features } from './features'
import styles from './styles.module.css'

export class FeaturesSection extends Component {
  render() {
    return (
      <Section
        id='features'
        title='All features at a glance'
        stretch
        {...this.props}
      >
        <div className={theme(styles, 'features')}>
          {features.map((feature) => (
            <div className={theme(styles, 'feature')} key={feature.name}>
              <img
                src={feature.icon}
                alt={feature.name}
                className={theme(styles, 'illustration')}
              />

              <h3>{feature.name}</h3>

              <p dangerouslySetInnerHTML={{ __html: feature.desc }} />
            </div>
          ))}
        </div>
      </Section>
    )
  }
}
