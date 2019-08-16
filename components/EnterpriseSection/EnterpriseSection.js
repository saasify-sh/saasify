import React, { Component } from 'react'

import { FinContext } from '../FinContext'
import { Section } from '../Section'
import { UndrawSVG } from '../UndrawSVG'

import styles from './styles.module.css'

export class EnterpriseSection extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {project => (
          <Section
            title='Enterprise'
            {...this.props}
          >
            <p>
              For questions regarding bulk pricing, dedicated support, customization, self-hosting, or other enterprise considerations, please <a href='mailto:info@functional-income.com'>contact us</a>.
            </p>

            <UndrawSVG
              name='business_plan'
              className={styles.illustration}
            />
          </Section>
        )}
      </FinContext.Consumer>
    )
  }
}
