<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# react-saasify

> React components for [Saasify](https://saasify.sh) web clients.

[![NPM](https://img.shields.io/npm/v/react-saasify.svg)](https://www.npmjs.com/package/react-saasify) [![Build Status](https://travis-ci.com/saasify-sh/saasify.svg?branch=master)](https://travis-ci.com/saasify-sh/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-saasify
```

## Usage

`react-saasify` exposes lots of useful components that are used across Saasify web clients, but the most important one is the `Section` component.

Every web client is broken up into Sections that encapsulate a single message, action, or purpose. Example Sections include `HeroSection`, `DocsSection`, `FeaturesSection`, etc.

Here's an example implementation of the `HeroSection` on Saasify's [homepage](https://saasify.sh).

```js
import {
  CTAButton,
  Section,
  theme
} from 'react-saasify'

import styles from './styles.module.css'

export class HeroSection extends Component {
  render() {
    return (
      <Section
        id='hero'
        title='Monetize Your OSS Projects'
        subtitle='The platform for monetizable serverless functions that empower the open source authors you love.'
        className={theme(styles, 'hero')}
      >
        <CTAButton>
          Get started
        </CTAButton>
      </Section>
    )
  }
}
```

#### Components

```
import {
  AuthenticatedRoute,

  LoginForm,
  SignupForm,
  CheckoutForm,

  SaasifyContext,

  NavHeader,
  NavFooter,

  ProfileSection,
  DashboardSection,
  InvoicingSection,
  BillingSourcesSection,
  BillingUsageSection,
  NotFoundSection,
  BlankSection,

  Section,
  SectionDivider,

  CodeBlock,
  LiveServiceDemo,
  PricingPlan,
  CTAButton,

  Markdown,
  UndrawSVG,
  Logo,
  BackgroundSlideshow,
  ScrollToTopOnMount,
  Paper,
  Loading
} from 'react-saasify'
```

#### Themes

`react-saasify` provides support for dynamically changing the theme. Note that themes can only apply custom styles They aren't currently capable of modifying content aside from loading additional fonts.

See the list of themes in `src/themes/` for examples.

## Related

- [saasify](https://saasify.sh) - Saasify is the easiest way to monetize your OSS projects!

## License

MIT © [Saasify](https://saasify.sh)
