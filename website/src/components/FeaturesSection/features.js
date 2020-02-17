// delesign
import connectedWorld from './images/connected-world.svg'
import launch from './images/launch.svg'
import softwareEngineer from './images/software-engineer.svg'
import stripe from './images/stripe.svg'
import success from './images/success.svg'

// undraw
import business from './images/business.png'
import businessPlan from './images/business-plan.png'
import customizable from './images/customizable.png'
import help from './images/help.png'
import makeItRain from './images/make-it-rain.png'
import security from './images/security.png'
import versionControl from './images/version-control.png'

export const features = [
  {
    name: 'Focus on your product',
    desc: 'Focus on the things you love and let us handle the rest.',
    icon: success
  },
  {
    name: 'Start your own business',
    desc:
      'You retain full ownership of your API and SaaS business. Saasify is here to help you get to market as efficiently as possible and provide a quality user experience.',
    icon: business
  },
  {
    name: 'Launch in minutes',
    desc:
      'Saasifying your API couldn\'t be simpler. Just give us an <a target="_blank" rel="noopener" href="https://swagger.io/docs/specification/about/">OpenAPI</a> spec (Swagger) of your externally-hosted API and Saasify generates everything from there.',
    icon: launch
  },
  {
    name: 'Fully customizable',
    desc:
      'We provide sensible defaults for pricing, marketing text, docs, and branding, but every aspect of your product is fully customizable via a simple JSON config file.',
    icon: customizable
  },
  {
    name: 'Stripe subscription billing',
    desc:
      'Saasify integrates very closely with Stripe for industry standard subscription billing support.',
    icon: stripe
  },
  {
    name: 'Easy payouts',
    desc:
      'Link your personal Stripe account via <a target="_blank" rel="noopener" href="https://stripe.com/connect">Stripe Connect</a> and you\'ll have full control over your Stripe subscriptions and revenue. We also offer alternatives for countries where Stripe is not supported.',
    icon: makeItRain
  },
  {
    name: 'Global, robust & stable',
    desc:
      'Saasify powers dozens of SaaS products all over the world with a <a target="_blank" rel="noopener" href="http://status.saasify.sh">99.99% uptime</a>.',
    icon: connectedWorld
  },
  {
    name: 'Semantic versioning',
    desc:
      "We track every change you make to your product to give you full semver control over your product's versioning.",
    icon: versionControl
  },
  {
    name: 'Marketing automation',
    desc:
      "Our team has launched dozens of profitable SaaS products. We'll use our experience to help refine your marketing strategy and take advantage of our distribution channels to drive customers to your product.",
    icon: businessPlan
  },
  {
    name: 'World class engineering',
    desc:
      'Our engineering team has worked at some of the best tech companies in the world including Microsoft, Facebook, and Netflix.',
    icon: softwareEngineer
  },
  {
    name: 'Secure',
    desc:
      'We take security very seriously. Saasify is hosted on AWS and is regularly audited by an independent third-party for compliance and security concerns.',
    icon: security
  },
  {
    name: 'Need something extra?',
    desc:
      'For questions regarding dedicated support, advanced customization, self-hosting, or other considerations, please <a href="mailto:support@saasify.sh">get in touch</a>.',
    icon: help
  }
]
