import React from 'react'

export const faq = [
  {
    section: 'Launching a SaaS',
    faqItems: [
      {
        question:
          'Why would I use Saasify instead of building everything myself?',
        answer: (
          <>
            <p>
              The most important factor in finding product / market fit is{' '}
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
                the only way to validate your SaaS product's solution is to ship
                an MVP
              </b>{' '}
              and get real customers paying for it .
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
              Saasify enables you{' '}
              <b>
                launch an MVP and begin validating product / market fit in
                minutes instead of weeks or months
              </b>
              .
            </p>

            <p>
              This distinction may not seem like much, but momentum is important
              for early-stage businesses and so many founders waste time and
              energy building out SaaS boilerplate before they even know if
              their product will resonate with paying customers.
            </p>

            <p>
              This is the real kep to Saasify's power, and it's why some of the
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
              If your product makes it to this point,{' '}
              <b>congratulations -- this is a great problem to have!</b>
            </p>

            <p>
              You'll have more money and resources to decide how you want to
              proceed now that your product is generating some non-trivial
              revenue, and you were able to get to this point quickly and
              efficiently by using Saasify.
            </p>

            <p>At this point, you have a few options.</p>

            <p>
              Either invest the time and resources in replacing the parts of
              your product that Saasify handles (billing, auth, API gateway,
              etc). Saasify provides a very <b>clean separation of concerns</b>{' '}
              between your product's unique value (an externally hosted API) and
              the SaaS base that Saasify provides, with the express intent of
              having <b>zero vendor lock-in</b>. If you want to migrate your
              SaaS product off of Saasify, you can do so incrementally.
            </p>

            <p>
              Your other option is to continue focusing on the differentiating
              features of your product and <b>partner with Saasify</b> to build
              out any missing features specific to your use case.
            </p>

            <p>
              <b>We have a world-class development team</b> including engineers
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
    section: 'Pricing',
    faqItems: [
      {
        question: "Does Saasify support my product's billing model?",
        answer: (
          <>
            <p>
              <b>
                Saasify supports any combination of billing models and pricing
                plans that Stripe supports.
              </b>
            </p>

            <p>
              Here are some examples of the billing models that Saasify
              supports:
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
      }
    ]
  },
  {
    section: 'Strategy',
    faqItems: [
      {
        question: 'Where can I find SaaS ideas to build?',
        answer: 'TODO: blog post'
      }
    ]
  }
]
