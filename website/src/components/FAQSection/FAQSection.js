import React, { Component } from 'react'
import { Section, theme } from 'react-saasify'

import { faq } from './faq'

import styles from './styles.module.css'

export class FAQSection extends Component {
  state = {
    expanded: {}
  }

  render() {
    const { className, ...rest } = this.props
    const { expanded } = this.state

    return (
      <Section
        id='faq'
        title='FAQ'
        className={theme(styles, 'faq', className)}
        {...rest}
      >
        <div className={theme(styles, 'faq-body')}>
          {faq.map((faqSection) => (
            <div className={theme(styles, 'faq-row')} key={faqSection.section}>
              <h3 className={theme(styles, 'faq-section-title')}>
                {faqSection.section}
              </h3>

              {faqSection.faqItems.map((faqItem, index) => (
                <div
                  key={faqItem.question}
                  className={theme(
                    styles,
                    'faq-item',
                    expanded[faqItem.question] && styles.expanded
                  )}
                >
                  <h5
                    className={theme(styles, 'question')}
                    onClick={() => this._toggleExpanded(faqItem)}
                  >
                    {faqItem.question}
                  </h5>

                  <div className={theme(styles, 'answer')}>
                    <div className={theme(styles, 'answer-body')}>
                      {faqItem.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>
    )
  }

  _toggleExpanded = (faqItem) => {
    this.setState({
      expanded: {
        ...this.state.expanded,
        [faqItem.question]: !this.state.expanded[faqItem.question]
      }
    })
  }
}
