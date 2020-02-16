import React, { Component } from 'react'
import BodyClassName from 'react-body-classname'

import { toJS } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import {
  AuthManager,
  ThemeManager,
  // AuthenticatedRoute,
  SaasifyContext,
  theme
} from 'react-saasify'

import { SignupDialog } from './components'

import {
  HomePage,
  HowItWorksPage,
  // LoginPage,
  // LogoutPage,
  // SignupPage,
  // AuthGitHubPage,
  EmailConfirmedPage,
  TermsPage,
  PrivacyPage,
  NotFoundPage
} from './routes'

import { DialogManager } from './lib/DialogManager'
import logo from './assets/logo-horiz-white@4x.png'

const saasifyContext = {
  name: 'Saasify',
  logo,
  ctaText: 'Request Early Access',
  ctaTextInline: 'Request Access',
  ctaOnClick: () => {
    DialogManager.isSignupDialogOpen = true
  },
  header: {
    displayName: false,
    login: false,
    dashboard: false,
    links: [
      {
        children: 'About',
        to: '/about'
      },
      {
        children: 'Docs',
        href: 'https://docs.saasify.sh/#/README'
      },
      {
        children: 'GitHub',
        href: 'https://github.com/saasify-sh/saasify',
        target: '_blank',
        rel: 'noopener'
      }
    ]
  },
  footer: {
    columns: [
      {
        label: 'Sitemap',
        links: [
          {
            label: 'Home',
            to: '/'
          },
          {
            children: 'About',
            to: '/about'
          },
          {
            label: 'Docs',
            href: 'https://docs.saasify.sh/#/README'
          },
          {
            label: 'Blog',
            href: 'https://blog.saasify.sh'
          }
        ]
      },
      {
        label: 'Legal',
        links: [
          {
            label: 'Terms',
            to: '/terms'
          },
          {
            label: 'Privacy',
            to: '/privacy'
          }
        ]
      },
      {
        label: 'Support',
        links: [
          {
            label: 'Slack',
            href:
              'https://join.slack.com/t/saasify/shared_invite/enQtODAxODA5MzU0NjczLTczOGU3NzNkYTJlMWIwZDkyNjJkOTk3MGEwZThlOWQyNTQxODZjZTExNjAzODJlZDQ3MWM5NWQwMGRiMDcyZTY'
          },
          {
            label: 'Email',
            href: 'mailto:support@saasify.sh'
          },
          {
            label: 'GitHub',
            href: 'https://github.com/saasify-sh/saasify',
            target: '_blank',
            rel: 'noopener'
          }
        ]
      }
    ]
  }
}

@observer
export default class App extends Component {
  render() {
    const { isSignupDialogOpen } = DialogManager
    const fonts = toJS(ThemeManager.theme.fonts)
    const themeClassName = `theme-${ThemeManager.theme['@name']}`

    return (
      <Router>
        <Provider auth={AuthManager}>
          <SaasifyContext.Provider value={saasifyContext}>
            <Helmet>
              {fonts &&
                fonts.map((font) => (
                  <link
                    key={font}
                    href={`https://fonts.googleapis.com/css?family=${font}&display=swap`}
                    rel='stylesheet'
                  />
                ))}
            </Helmet>

            <BodyClassName className={theme(null, themeClassName)}>
              <>
                <Switch>
                  <Route exact path='/' component={HomePage} />

                  <Route path='/about' component={HowItWorksPage} />

                  <Route path='/terms' component={TermsPage} />
                  <Route path='/privacy' component={PrivacyPage} />

                  <Route
                    path='/email-confirmed'
                    component={EmailConfirmedPage}
                  />

                  {/* <Route path='/login' component={LoginPage} />
                <Route path='/signup' component={SignupPage} />
                <Route path='/auth/github' component={AuthGitHubPage} />

                <AuthenticatedRoute path='/logout' component={LogoutPage} /> */}

                  <Route component={NotFoundPage} />
                </Switch>

                {isSignupDialogOpen && (
                  <SignupDialog
                    isOpen={isSignupDialogOpen}
                    onClose={this._onCloseSignupDialog}
                  />
                )}
              </>
            </BodyClassName>
          </SaasifyContext.Provider>
        </Provider>
      </Router>
    )
  }

  _onOpenSignupDialog = () => {
    DialogManager.isSignupDialogOpen = true
  }

  _onCloseSignupDialog = () => {
    DialogManager.isSignupDialogOpen = false
  }
}
