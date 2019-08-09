import React, { Component } from 'react'

import { FinContext } from '../FinContext'
import { UndrawSVG } from '../UndrawSVG'

import styles from './styles.module.css'

export class FeaturesSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <section className={styles.container}>
            <div className={styles.content}>
              <h1 className={styles.title}>
                Features
              </h1>

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
            </div>
          </section>
        )}
      </FinContext.Consumer>
    )
  }
}
