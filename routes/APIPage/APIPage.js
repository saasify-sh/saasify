import React, { Component } from 'react'
import theme from 'lib/theme'

import { RedocStandalone } from 'redoc'

import {
  // NavHeader,
  FinContext,
  ScrollToTopOnMount,
  NavFooter
} from 'components'

import styles from './styles.module.css'

export class APIPage extends Component {
  render() {
    return (
      <FinContext.Consumer>
        {deployment => (
          <div className={theme(styles, 'api-page')}>
            {/*
            <NavHeader fixed={true} />
            */}

            <ScrollToTopOnMount />

            <RedocStandalone
              specUrl={deployment.openApiUrl}
              options={{
                suppressWarnings: (process.env.NODE_ENV === 'production'),
                hideLoading: true,
                theme: {
                  colors: {
                    primary: {
                      main: deployment.project.saas.theme['@primary-color']
                    }
                  }
                }
              }}
            />

            <NavFooter />
          </div>
        )}
      </FinContext.Consumer>
    )
  }
}
