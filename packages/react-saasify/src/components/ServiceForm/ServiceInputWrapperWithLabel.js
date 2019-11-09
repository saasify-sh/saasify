import React from 'react'
import { ServiceInputWrapper } from './ServiceInputWrapper'
import theme from 'lib/theme'
import styles from './styles.module.css'

export const ServiceInputWrapperWithLabel = ({
  children,
  propKey,
  description
}) => (
  <ServiceInputWrapper>
    <label>
      <div className={theme(styles, 'service-form__input-label')}>
        <span className={theme(styles, 'service-form__input-name')}>
          {propKey} -{' '}
        </span>

        <span className={theme(styles, 'service-form__input-description')}>
          {description}
        </span>
      </div>
      {children}
    </label>
  </ServiceInputWrapper>
)
