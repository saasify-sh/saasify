import React, { Component } from 'react'
import theme from 'lib/theme'

import { Section } from '../Section'
import { UndrawSVG } from '../UndrawSVG'

import styles from './styles.module.css'

export class EnterpriseSection extends Component {
  render() {
    return (
      <Section
        id='enterprise'
        title='Enterprise'
        {...this.props}
      >
        <p>
          For questions regarding bulk pricing, dedicated support, customization, self-hosting, or other enterprise considerations, please <a href='mailto:info@saasify.xyz'>contact us</a>.
        </p>

        <UndrawSVG
          name='business_plan'
          className={theme(styles, 'illustration')}
        />
      </Section>
    )
  }
}
