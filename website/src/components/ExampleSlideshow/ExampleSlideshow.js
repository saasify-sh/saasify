import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { HotKeys } from 'react-hotkeys'

import { SceneSlideshow } from './SceneSlideshow/SceneSlideshow'

import ogImpactHome from './images/ogimpact.webp'
import ogImpactPricing from './images/ogimpact-pricing.webp'
import ogImpactDocs from './images/ogimpact-docs.webp'
import ogImpactDashboard from './images/ogimpact-dashboard.webp'

import imageminHome from './images/imagemin.webp'
import imageminPricing from './images/imagemin-pricing.webp'
import imageminDocs from './images/imagemin-docs.webp'
// import imageminDashboard from './images/imagemin-dashboard.webp'

import puppetMasterHome from './images/puppet-master.webp'
// import puppetMasterPricing from './images/puppet-master-pricing.webp'
// import puppetMasterDocs from './images/puppet-master-docs.webp'
// import puppetMasterDashboard from './images/puppet-master-dashboard.webp'

import arrowLeft from './images/left-hand-drawn-arrow.svg'
import arrowRight from './images/right-hand-drawn-arrow.svg'

import styles from './styles.module.css'

const scenes = [
  // og impact
  {
    src: ogImpactHome,
    demo: 'ogimpact',
    key: 'ogimpact-home',
    label: 'OG Impact',
    notes: [
      {
        desc: 'This is a live product built with Saasify'
      },
      {
        desc: 'Launch your own SaaS product like this one in minutes 🚀'
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
        desc: 'We generate Stripe subscription plans for your product'
      },
      {
        desc: 'These pricing plans are fully configurable'
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
        desc: 'We also generate beautiful OpenAPI-powered developer docs'
      },
      {
        desc: 'These docs sync with your code and include example snippets 💪'
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
        desc: 'Users receive an API key when they sign up'
      },
      {
        desc:
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
        desc: "Here's another live product built with Saasify"
      },
      {
        desc: 'We ❤️ open source projects like imagemin'
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
        desc: 'You can configure custom rate limits for your product'
      },
      {
        desc: 'Or setup metered billing to charge per request'
      }
    ]
  },
  {
    src: imageminDocs,
    demo: 'imagemin',
    key: 'imagemin-docs',
    label: 'Imagemin API Docs',
    notes: [
      {
        desc: 'We strive for an amazing developer experience 💯'
      },
      {
        desc:
          'The rate limited public tier allows users to quickly test things out'
      }
    ]
  },
  // {
  //   src: imageminDashboard,
  //   demo: 'imagemin',
  //   key: 'imagemin-dashboard',
  //   label: 'Imagemin Dashboard',
  //   notes: [
  //     {
  //       desc: 'Simple customer dashboard'
  //     },
  //     {
  //       desc: 'Easy for customers to manage subscription and billing info'
  //     }
  //   ]
  // },

  // puppet master
  {
    src: puppetMasterHome,
    demo: 'puppet-master',
    key: 'puppet-master-home',
    label: 'Puppeteer',
    notes: [
      {
        desc: "Here's one last example built with Saasify"
      },
      {
        desc: 'It uses a fully custom theme ☺️'
      }
    ]
  }
  // {
  //   src: puppetMasterPricing,
  //   demo: 'puppet-master',
  //   key: 'puppet-master-pricing',
  //   label: 'Puppeteer Pricing',
  //   notes: [
  //     {
  //       desc: 'Another example of metered billing'
  //     },
  //     {
  //       desc: 'Custom rate limits'
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
  //       desc: 'Detailed API docs'
  //     },
  //     {
  //       desc: 'Developer-friendly docs that sync with your code'
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
  //       desc: 'Every theme comes with a customer dashboard.'
  //     },
  //     {
  //       desc: 'What will you be inspired to launch?'
  //     }
  //   ]
  // }
]

@observer
export class ExampleSlideshow extends Component {
  _scenes = scenes

  @observable
  _selectedSceneIndex = 0

  render() {
    const selectedScene = this._scenes[this._selectedSceneIndex]

    return (
      <HotKeys
        className={styles.container}
        handlers={{
          slideshowMoveSelectionLeft: this._onMoveSelectionLeft,
          slideshowMoveSelectionRight: this._onMoveSelectionRight
        }}
      >
        <div className={styles.slideshow}>
          <SceneSlideshow
            scenes={this._scenes}
            selectedSceneIndex={this._selectedSceneIndex}
            onSelectScene={this._onSelectScene}
          />
        </div>

        <div className={styles.notes}>
          {selectedScene.notes.map((note, index) => (
            <div className={styles.note} key={index}>
              <img
                className={
                  styles.arrow +
                  ' ' +
                  styles[`arrow${index === 0 ? 'Left' : 'Right'}`]
                }
                src={index === 0 ? arrowLeft : arrowRight}
              />

              {note.desc}
            </div>
          ))}
        </div>
      </HotKeys>
    )
  }

  _onSelectScene = (index) => {
    this._updateSelectedSceneIndex(index)
  }

  _onMoveSelectionLeft = () => {
    this._updateSelectedSceneIndex(this._selectedSceneIndex - 1)
  }

  _onMoveSelectionRight = () => {
    this._updateSelectedSceneIndex(this._selectedSceneIndex + 1)
  }

  _updateSelectedSceneIndex = (index = this._selectedSceneIndex) => {
    this._selectedSceneIndex = Math.max(
      0,
      Math.min(index, this._scenes.length - 1)
    )
  }
}
