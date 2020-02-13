import React, { Component } from 'react'

import { Section, theme } from 'react-saasify'
import { BenefitsBlob } from './BenefitsBlob/BenefitsBlob'

import arrowLeft from './images/arrow-left.svg'
import arrowRight from './images/arrow-right.svg'

import styles from './styles.module.css'

const ourBenefits = [
  '- Setting up subscription billing',
  '- User accounts (auth, emails, customer dashboard)',
  '- API gateway (global CDN, rate limiting, usage tracking, etc)',
  '- Developer docs',
  '- Polished marketing site',
  '- Marketing campaigns'
]

const yourFocus = [
  '+ Building your product',
  '+ Building product features',
  '+ Making money'
]

export class BenefitsSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section id='benefits' title='Superpowers' {...rest}>
        <div className={theme(styles, 'benefits', className)}>
          <BenefitsBlob
            className={theme(styles, 'column')}
            items={ourBenefits}
            arrow={arrowLeft}
            title='Things That Suck'
            footer='We do all of this'
          />

          <BenefitsBlob
            className={theme(styles, 'column')}
            items={yourFocus}
            arrow={arrowRight}
            title='Things That Are Fun'
            footer='So you can focus on this'
          />
        </div>
      </Section>
    )
  }
}
