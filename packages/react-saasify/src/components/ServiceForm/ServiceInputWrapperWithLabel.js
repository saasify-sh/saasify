import React from 'react'
import { ServiceInputWrapper } from './ServiceInputWrapper'
import theme from 'lib/theme'
import styles from './styles.module.css'
import ReactMarkdown from 'react-markdown'

const allowedTypes = ['strong', 'emphasis', 'link', 'text']

export const ServiceInputWrapperWithLabel = ({
  children,
  propKey,
  description
}) => {
  let desc = description?.length > 80 ? description.split('\n')[0] : description
  if (desc?.length > 80) {
    desc = desc.split('.')[0]
  }

  return (
    <ServiceInputWrapper>
      <label>
        <div className={theme(styles, 'service-form__input-label')}>
          <span className={theme(styles, 'service-form__input-name')}>
            {propKey}
            {desc && ' - '}
          </span>

          {desc && (
            <span className={theme(styles, 'service-form__input-description')}>
              <ReactMarkdown
                source={desc}
                allowedTypes={allowedTypes}
                escapeHtml={false}
                linkTarget='_blank'
                unwrapDisallowed
              />
            </span>
          )}
        </div>

        {children}
      </label>
    </ServiceInputWrapper>
  )
}
