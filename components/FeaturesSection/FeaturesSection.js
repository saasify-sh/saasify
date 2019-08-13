import React, { Component } from 'react'

import { FinContext } from '../FinContext'
import { Section } from '../Section'
import { UndrawSVG } from '../UndrawSVG'

import styles from './styles.module.css'

export class FeaturesSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <Section
            title='Features'
            stretch
            {...this.props}
          >
            <div className={styles.features}>
              {project.saas.features.map((feature) => (
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
        )}
      </FinContext.Consumer>
    )
  }
}
