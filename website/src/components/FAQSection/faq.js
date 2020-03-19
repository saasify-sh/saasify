import React from 'react'

import { DialogManager } from '../../lib/DialogManager'

const onClickBetaCTA = (event) => {
  event.preventDefault()
  DialogManager.isSignupDialogOpen = true
}

export const faq = [
  {
    section: 'Launching your SaaS',
    faqItems: [
      {
        question: 'Why would I use Saasify instead of building things myself?',
        answer: (
          <>
            <p>
              The most important factor in the success or failure of an
              early-stage SaaS is{' '}
              <b>
                how quickly and efficiently you're able to start validating your
                product
              </b>
              .
            </p>

            <p>
              So many aspiring SaaS founders, especially software developers,
              waste months building out products that nobody ends up paying for.
            </p>

            <p>
              Talking with potential customers is a great way to get early
              feedback and to get a feeling for whether or not you're solving a
              real problem.
            </p>

            <p>
              But{' '}
              <b>
                the only way to validate your SaaS product is to ship an MVP
              </b>{' '}
              and get real customers paying for it.
            </p>

            <p>
              Even for the most talented developers, it still takes weeks or
              months to wire everything together and launch an MVP of a SaaS
              product, and only then can they start validating their product
              with real customers.
            </p>

            <p>
              In comparison,{' '}
              <b>Saasify cuts your time to market by an order of magnitude</b>.
              You get to focus on your product's unique value and forget about
              all the boring boilerplate glue around setting up billing, user
              accounts, analytics, admin dashboards, transactional emails, etc.
            </p>

            <p>
              Saasify enables you to{' '}
              <b>
                launch an MVP and begin validating product / market fit in
                minutes instead of weeks or months
              </b>
              .
            </p>

            <p>
              This distinction may not seem like much, but momentum is very
              important for early-stage businesses and so many founders waste
              time and energy building out SaaS boilerplate before they even
              know if their product will resonate with paying customers.
            </p>

            <p>
              This is the real key to Saasify's power, and it's why some of the
              smartest &amp; most successful serial SaaS founders are choosing
              to launch their MVPs on top of Saasify instead of rolling their
              own SaaS over and over.
            </p>
          </>
        )
      },
      {
        question: 'What if my product starts to outgrow Saasify?',
        answer: (
          <>
            <p>
              First off,{' '}
              <b>congratulations -- this is a great problem to have!</b>
            </p>

            <p>
              Once you're at this point, you'll have more money and resources to
              decide how you want to proceed now that your product is generating
              some non-trivial revenue, and you were able to get to this point
              quickly and efficiently by using Saasify.
            </p>

            <p>You have a few options from here.</p>

            <p>
              The first option is to invest some time and resources in replacing
              the parts of your product that Saasify handles (billing, auth, API
              gateway, etc). Saasify provides a very{' '}
              <b>clean separation of concerns</b> between your product's unique
              value (an externally hosted API) and the SaaS base that Saasify
              provides, with the express intent of having{' '}
              <b>zero vendor lock-in</b>. If you want to migrate your SaaS
              product off of Saasify, you can do so incrementally.
            </p>

            <p>
              Your other option is to continue focusing on the differentiating
              features of your product and <b>partner with Saasify</b> to build
              out any missing features specific to your use case.
            </p>

            <p>
              <b>We have a world-class engineering team</b> including developers
              who've previously worked at Facebook, Microsoft, and Netflix. We
              can confidently say that there isn't a SaaS product in the world
              that we wouldn't be able to add value to.
            </p>
          </>
        )
      }
    ]
  },
  {
    section: 'Monetization',
    faqItems: [
      {
        question: 'What billing models does Saasify support?',
        answer: (
          <>
            <p>
              We're very proud to say that{' '}
              <b>Saasify supports any billing model that Stripe supports.</b>
            </p>

            <p>
              Here are some examples of common billing features you can use with
              Saasify:
            </p>

            <ul>
              <li>General Subscription billing</li>
              <li>Support for any number of pricing plans</li>
              <li>Support for metered pricing plans</li>
              <li>Support for licensed usage pricing plans</li>
              <li>Support for tiered pricing</li>
              <li>Support for coupons and discounts</li>
              <li>Custom features on a per-plan basis</li>
              <li>Custom rate limits and service config on a per-plan basis</li>
              <li>
                Your API is aware of the plan users are calling with (so you
                can, for instance, have a free plan that includes watermarks on
                image results)
              </li>
            </ul>
          </>
        )
      },
      {
        question: 'How do I get paid?',
        answer: (
          <>
            <p>
              Link your personal Stripe account via{' '}
              <b>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://stripe.com/connect'
                >
                  Stripe Connect
                </a>
              </b>{' '}
              and you'll have full control over your Stripe subscriptions and
              revenue. We also offer alternatives for countries where Stripe
              Connect is not supported.
            </p>

            <p>
              By using Stripe Connect,{' '}
              <b>your product's revenue never touches Saasify's bank account</b>{' '}
              and is directly deposited into your Stripe balance.
            </p>

            <p>
              Stripe supports a wide variety of{' '}
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://stripe.com/docs/payouts'
              >
                payout methods and options
              </a>
              .
            </p>
          </>
        )
      },
      {
        question: 'What are the tax implications of using Saasify?',
        answer: (
          <>
            <p>
              Since Saasify uses{' '}
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://stripe.com/connect'
              >
                Stripe Connect
              </a>
              , your tax handling is no different than if you were using Stripe
              directly.
            </p>

            <p>
              For more information on handling taxes with Stripe, see{' '}
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://support.stripe.com/questions/charging-sales-tax-gst-or-vat-on-payments'
              >
                Stripe's docs
              </a>
              .
            </p>
          </>
        )
      }
    ]
  },
  {
    section: 'Product',
    faqItems: [
      {
        question: 'How can I be sure my SaaS product will be stable?',
        answer: (
          <>
            <p>
              Saasify powers dozens of SaaS products around the world with a{' '}
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='http://status.saasify.sh'
              >
                99.99% uptime
              </a>
              .
            </p>

            <p>
              If you have deeper questions about our infrastructure, robustness,
              or would prefer a custom SLA, feel free to{' '}
              <a href='mailto:support@saasify.sh'>get in touch</a>.
            </p>
          </>
        )
      },
      {
        question:
          'If I make changes to my SaaS product, how does versioning work?',
        answer: (
          <>
            <p>
              We track every change you make to your product to give you full{' '}
              <b>semver</b> control over your product's versioning.
            </p>

            <p>
              We recommend that all product pricing changes are accompanied by a
              major semver version update.
            </p>

            <p>
              Your customers will automatically be upgraded to the latest
              version except for major version updates. For example, if you
              update your product from v1.1.0 to v2.0.0, and a customer was
              previously subscribed to v1.1.0, their subscription will not
              automatically update.
            </p>

            <p>
              You have full control over the active versions of your product's
              API. If you want to deprecate old versions and only support the
              newest version of your API, you can do this from the admin
              dashboard, but keep in mind that this may require existing users
              to update their integration.
            </p>
          </>
        )
      },
      {
        question: "What is Saasify's tech stack?",
        answer: (
          <>
            <p>
              Large parts of Saasify are{' '}
              <a
                href='https://github.com/saasify-sh/saasify'
                rel='noopener noreferrer'
                target='_blank'
              >
                open source
              </a>{' '}
              on GitHub which should give you an idea of our engineering
              standards.
            </p>

            <p>
              Saasify itself is built using Node.js and a combination of JS +
              TS. On the frontend, we use React and MobX.
            </p>

            <p>
              We make heavy use of AWS for hosting our main backend APIs and use
              AWS Lambda via{' '}
              <a
                href='https://zeit.co/docs/v2/serverless-functions/introduction'
                rel='noopener noreferrer'
                target='_blank'
              >
                ZEIT now
              </a>{' '}
              for targeted cases where serverless functions make sense.
            </p>

            <p>
              We use MongoDB as a primary data store and Redis to hold temporary
              rate-limiting information.
            </p>

            <p>
              Our API gateway / proxy handles all of the authentication, service
              resolution, rate-limiting, caching, and usage tracking with as
              minimal overhead as possible. The p99 overhead of this API proxy
              is ~40ms, and we're able to achieve this low latency with the
              following approaches:
            </p>

            <ul>
              <li>
                Moving most of this logic to be asynchronous &amp; non-blocking.
              </li>

              <li>
                Caching our core data models which are mostly immutable via{' '}
                <a
                  href='https://blog.saasify.sh/content-based-addressing/'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  content-based addressing
                </a>
                .
              </li>

              <li>KISS</li>
            </ul>

            <p>
              Saasify uses Cloudfront's global edge CDN to cache API responses
              according to standard cache-control semantics.
            </p>
          </>
        )
      },
      {
        question: 'When will Saasify launch publicly?',
        answer: (
          <>
            <p>
              <b>Saasify is currently in private beta</b> as we refine our
              offering.
            </p>

            <p>
              We've already helped launch dozens of SaaS products built on top
              of Saasify, and the core product is very stable and mature.
            </p>

            <p>
              We are aiming to launch Saasify's self-serve product publicly in
              late Spring, 2020.
            </p>

            <p>
              Until then, the best way to stay in touch is to{' '}
              <b>
                <a onClick={onClickBetaCTA}>
                  request access to join the private beta
                </a>
              </b>
              .
            </p>
          </>
        )
      }
    ]
  },

  {
    section: 'Strategy',
    faqItems: [
      {
        question: 'Where can I find SaaS ideas to build?',
        answer: (
          <>
            <p>
              We recommend checking out{' '}
              <a
                href='https://www.indiehackers.com/'
                rel='noopener noreferrer'
                target='_blank'
              >
                Indie Hackers
              </a>{' '}
              for now and will be providing more resources for SaaS idea
              generation and validation in the near future.
            </p>
          </>
        )
      }
    ]
  }
]
