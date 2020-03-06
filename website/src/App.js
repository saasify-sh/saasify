import React, { Component } from 'react'
import BodyClassName from 'react-body-classname'

import { toJS } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import {
  AuthManager,
  ThemeManager,
  AuthenticatedRoute,
  theme
} from 'react-saasify'

import { SignupDialog } from './components'

import {
  // marketing site
  HomePage,
  AboutPage,
  PricingPage,
  TermsPage,
  PrivacyPage,
  OnboardingPage,
  NotFoundPage,

  // auth flow
  LoginPage,
  LogoutPage,
  SignupPage,
  EmailConfirmedPage,

  // third-party auth flow
  AuthGitHubPage,
  AuthGooglePage,
  AuthSpotifyPage,
  AuthTwitterPage,
  AuthStripePage,

  // maker webapp
  DashboardPage,
  ProjectAdminPage
} from './routes'

import { DialogManager } from './lib/DialogManager'
import logo from './assets/logo-horiz-white@4x.png'

import styles from './styles.module.css'

const saasifyConfig = {
  name: 'Saasify',
  logo,
  ctaText: 'Request Access',
  ctaTextInline: 'Request Access',
  ctaOnClick: () => {
    DialogManager.isSignupDialogOpen = true
  },
  header: {
    displayName: false,
    dashboard: true,
    login: true,
    links: [
      {
        children: 'About',
        to: '/about'
      },
      {
        children: 'Pricing',
        to: '/pricing'
      },
      // {
      //   children: 'Docs',
      //   href: 'https://docs.saasify.sh/#/README'
      // },
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
        label: 'Product',
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
            children: 'Pricing',
            to: '/pricing'
          },
          // {
          //   label: 'Docs',
          //   href: 'https://docs.saasify.sh/#/README'
          // },
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
            href: 'https://slack.saasify.sh'
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
        <Provider auth={AuthManager} config={saasifyConfig}>
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

          <BodyClassName className={theme(styles, themeClassName, styles.body)}>
            <>
              <Switch>
                <Route exact path='/' component={HomePage} />
                <Route path='/about' component={AboutPage} />
                <Route path='/pricing' component={PricingPage} />

                <Route path='/terms' component={TermsPage} />
                <Route path='/privacy' component={PrivacyPage} />

                <Route path='/email-confirmed' component={EmailConfirmedPage} />
                <Route path='/login' component={LoginPage} />
                <Route path='/signup' component={SignupPage} />
                <AuthenticatedRoute path='/logout' component={LogoutPage} />

                <Route path='/auth/github' component={AuthGitHubPage} />
                <Route path='/auth/google' component={AuthGooglePage} />
                <Route path='/auth/spotify' component={AuthSpotifyPage} />
                <Route path='/auth/twitter' component={AuthTwitterPage} />
                <Route path='/auth/stripe' component={AuthStripePage} />

                <Route path='/onboarding' component={OnboardingPage} />

                <AuthenticatedRoute
                  exact
                  path='/dashboard'
                  component={DashboardPage}
                />

                <AuthenticatedRoute
                  path='/maker/projects/:namespace/:projectName'
                  component={ProjectAdminPage}
                />

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
