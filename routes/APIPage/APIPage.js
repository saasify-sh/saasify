import React, { Component, Suspense } from 'react'
import theme from 'lib/theme'

import {
  // NavHeader,
  Loading,
  SaasifyContext,
  ScrollToTopOnMount,
  NavFooter
} from 'components'

import styles from './styles.module.css'

const LazyRedoc = React.lazy(() => import('lib/redoc'))

export class APIPage extends Component {
  render() {
    return (
      <SaasifyContext.Consumer>
        {deployment => (
          <div className={theme(styles, 'api-page')}>
            {/*
            <NavHeader fixed={true} />
            */}

            <ScrollToTopOnMount />

            <Suspense
              fallback={(
                <Loading
                  title='Loading API Docs'
                />
              )}
            >
              <LazyRedoc
                specUrl={deployment.openApiUrl}
                options={{
                  suppressWarnings: (process.env.NODE_ENV === 'production'),
                  hideLoading: true
                }}
              />
            </Suspense>

            <NavFooter />
          </div>
        )}
      </SaasifyContext.Consumer>
    )
  }
}
