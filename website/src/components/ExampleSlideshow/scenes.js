import ogImpactHome from './images/ogimpact.jpg'
import ogImpactPricing from './images/ogimpact-pricing.jpg'
import ogImpactDocs from './images/ogimpact-docs.jpg'
import ogImpactDashboard from './images/ogimpact-dashboard.jpg'

import imageminHome from './images/imagemin.jpg'
import imageminPricing from './images/imagemin-pricing.jpg'
// import imageminDocs from './images/imagemin-docs.jpg'
// import imageminDashboard from './images/imagemin-dashboard.jpg'

// import puppetMasterHome from './images/puppet-master.jpg'
// import puppetMasterPricing from './images/puppet-master-pricing.jpg'
// import puppetMasterDocs from './images/puppet-master-docs.jpg'
// import puppetMasterDashboard from './images/puppet-master-dashboard.jpg'

export const scenes = [
  // og impact
  {
    src: ogImpactHome,
    demo: 'ogimpact',
    key: 'ogimpact-home',
    label: 'OG Impact',
    notes: [
      {
        __html:
          'This is a <a target="_blank" rel="noopener" href="https://ogimpact.sh">live product</a> built with Saasify'
      },
      {
        __html: 'Create your own SaaS product like this one in minutes 🚀'
      }
    ]
  },
  {
    src: ogImpactPricing,
    demo: 'ogimpact',
    key: 'ogimpact-pricing',
    label: 'OG Impact Pricing',
    notes: [
      {
        __html: 'We generate Stripe subscription plans for your product'
      },
      {
        __html: 'These pricing plans are fully configurable'
      }
    ]
  },
  {
    src: ogImpactDocs,
    demo: 'ogimpact',
    key: 'ogimpact-docs',
    label: 'OG Impact API Docs',
    notes: [
      {
        __html: 'We also generate beautiful OpenAPI-powered developer docs'
      },
      {
        __html: 'These docs sync with your code and include example snippets 💪'
      }
    ]
  },
  {
    src: ogImpactDashboard,
    demo: 'ogimpact',
    key: 'ogimpact-dashboard',
    label: 'OG Impact Dashboard',
    notes: [
      {
        __html: 'Users receive an API key when they sign up'
      },
      {
        __html:
          'They can track usage and manage account info from their dashboard'
      }
    ]
  },

  // imagemin
  {
    src: imageminHome,
    demo: 'imagemin',
    key: 'imagemin-home',
    label: 'Imagemin',
    notes: [
      {
        __html:
          'Here\'s another <a target="_blank" rel="noopener" href="https://imagemin.saasify.sh">live product</a> built with Saasify'
      },
      {
        __html: 'We ❤️ open source projects like imagemin'
      }
    ]
  },
  {
    src: imageminPricing,
    demo: 'imagemin',
    key: 'imagemin-pricing',
    label: 'Imagemin Pricing',
    notes: [
      {
        __html: 'You can configure custom rate limits for your product'
      },
      {
        __html: 'Or setup metered billing to charge per request'
      }
    ]
  }
  // {
  //   src: imageminDocs,
  //   demo: 'imagemin',
  //   key: 'imagemin-docs',
  //   label: 'Imagemin API Docs',
  //   notes: [
  //     {
  //       __html: 'We strive for an amazing developer experience 💯'
  //     },
  //     {
  //       __html:
  //         'The rate limited public tier allows users to quickly test things out'
  //     }
  //   ]
  // },
  // {
  //   src: imageminDashboard,
  //   demo: 'imagemin',
  //   key: 'imagemin-dashboard',
  //   label: 'Imagemin Dashboard',
  //   notes: [
  //     {
  //       __html: 'Simple customer dashboard'
  //     },
  //     {
  //       __html: 'Easy for customers to manage subscription and billing info'
  //     }
  //   ]
  // },

  // puppet master
  // {
  //   src: puppetMasterHome,
  //   demo: 'puppet-master',
  //   key: 'puppet-master-home',
  //   label: 'Puppeteer',
  //   notes: [
  //     {
  //       __html: "Here's one last example built with Saasify"
  //     },
  //     {
  //       __html: 'It uses a fully custom theme ☺️'
  //     }
  //   ]
  // }
  // {
  //   src: puppetMasterPricing,
  //   demo: 'puppet-master',
  //   key: 'puppet-master-pricing',
  //   label: 'Puppeteer Pricing',
  //   notes: [
  //     {
  //       __html: 'Another example of metered billing'
  //     },
  //     {
  //       __html: 'Custom rate limits'
  //     }
  //   ]
  // },
  // {
  //   src: puppetMasterDocs,
  //   demo: 'puppet-master',
  //   key: 'puppet-master-docs',
  //   label: 'Puppeteer API Docs',
  //   notes: [
  //     {
  //       __html: 'Detailed API docs'
  //     },
  //     {
  //       __html: 'Developer-friendly docs that sync with your code'
  //     }
  //   ]
  // },
  // {
  //   src: puppetMasterDashboard,
  //   demo: 'puppet-master',
  //   key: 'puppet-master-dashboard',
  //   label: 'Puppeteer Dashboard',
  //   notes: [
  //     {
  //       __html: 'Every theme comes with a customer dashboard.'
  //     },
  //     {
  //       __html: 'What will you be inspired to launch?'
  //     }
  //   ]
  // }
]
