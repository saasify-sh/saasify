import React from 'react'
import { ServiceInputWrapper } from './ServiceInputWrapper'
import theme from 'lib/theme'
import styles from './styles.module.css'
import ReactMarkdown from 'react-markdown'

const allowedTypes = ['link', 'text']

export const ServiceInputWrapperWithLabel = ({
  children,
  propKey,
  description
}) => (
  <ServiceInputWrapper>
    <label>
      <div className={theme(styles, 'service-form__input-label')}>
        <span className={theme(styles, 'service-form__input-name')}>
          {propKey}
          {description && ' - '}
        </span>

        {description && (
          <span className={theme(styles, 'service-form__input-description')}>
            <ReactMarkdown
              source={description}
              allowedTypes={allowedTypes}
              unwrapDisallowed
            />
          </span>
        )}
      </div>
      {children}
    </label>
  </ServiceInputWrapper>
)
