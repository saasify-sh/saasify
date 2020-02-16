import React, { Component } from 'react'

import { Section, theme } from 'react-saasify'
import { BenefitsBlob } from './BenefitsBlob/BenefitsBlob'

import arrowLeft from './images/arrow-left.svg'
import arrowRight from './images/arrow-right.svg'

import styles from './styles.module.css'

const ourBenefits = [
  '- Setting up subscription billing',
  '- User accounts (auth, emails, customer dashboard)',
  '- API gateway (rate limiting, usage tracking, global caching, etc)',
  '- Developer docs',
  '- Legal docs',
  '- Marketing site',
  '- Marketing campaigns'
]

const yourFocus = [
  '+ Building your product',
  '+ Building amazing features',
  '+ Making money'
]

export class BenefitsSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section id='benefits' title='Launching a SaaS Product' {...rest}>
        <svg className={theme(styles, 'defs')}>
          <defs>
            {/*
            <linearGradient
              id='g1'
              gradientUnits='userSpaceOnUse'
              x1='-9.15%'
              y1='15.85%'
              x2='109.15%'
              y2='84.15%'
            >
              <stop stopColor='#f093fb' />
              <stop offset='1' stopColor='#f5576c' />
            </linearGradient>
            */}

            <linearGradient id='g1'>
              <stop stopColor='#ed6ea0' />
              <stop offset='1' stopColor='#ec8c69' />
            </linearGradient>

            <linearGradient id='g2'>
              <stop stopColor='#ec8c69' />
              <stop offset='1' stopColor='#ed6ea0' />
            </linearGradient>

            {/* <linearGradient id='g1'>
              <stop stopColor='#ff758c' />
              <stop offset='1' stopColor='#ff7eb3' />
            </linearGradient> */}

            {/* <linearGradient
              id='g1'
              gradientUnits='userSpaceOnUse'
              x1='71.92%'
              y1='110.22%'
              x2='28.08%'
              y2='-10.22%'
            >
              <stop stopColor='#2b5876' />
              <stop offset='1' stopColor='#4e4376' />
            </linearGradient> */}

            {/* <linearGradient id='g1' x1='100%' y1='100%'>
              <stop stopColor='#a7a6cb' />
              <stop offset='.52' stopColor='#8989ba' />
              <stop offset='1' stopColor='#8989ba' />
            </linearGradient> */}

            {/* <linearGradient id='g1' x1='100%' y1='100%'>
              <stop stopColor='#1e3c72' />
              <stop offset='.01' stopColor='#1e3c72' />
              <stop offset='1' stopColor='#2a5298' />
            </linearGradient> */}
          </defs>
        </svg>

        <div className={theme(styles, 'benefits', className)}>
          <BenefitsBlob
            className={theme(styles, 'column')}
            items={ourBenefits}
            arrow={arrowLeft}
            fill='url(#g1)'
            title='Boring Stuff'
            footer='We handle all of this'
          />

          <BenefitsBlob
            className={theme(styles, 'column')}
            items={yourFocus}
            arrow={arrowRight}
            fill='url(#g2)'
            title='Fun Stuff'
            footer='So you can focus on this'
          />
        </div>
      </Section>
    )
  }
}
