import React, { Component } from 'react'

import { FinContext } from '../FinContext'
import { LiveServiceDemo } from '../LiveServiceDemo'
import { Markdown } from '../Markdown'

import styles from './styles.module.css'

export class IntroSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <section className={styles.container}>
            <div className={styles.content}>
              <h1 className={styles.title}>
                Demo
              </h1>

              <p>
                Feel free to play around with the the API... rate limit public shit free shit
              </p>

              <LiveServiceDemo
                project={project}
                deployment={project.deployment}
                service={project.deployment.services[0]}
              />
              {/*
              <Markdown
                source={project.deployment.readme}
              />
              */}
            </div>
          </section>
        )}
      </FinContext.Consumer>
    )
  }
}
