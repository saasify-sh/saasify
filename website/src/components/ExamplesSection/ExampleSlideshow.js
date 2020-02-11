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
import imageminDashboard from './images/imagemin-dashboard.webp'

import puppetMasterHome from './images/puppet-master.webp'
import puppetMasterPricing from './images/puppet-master-pricing.webp'
import puppetMasterDocs from './images/puppet-master-docs.webp'
import puppetMasterDashboard from './images/puppet-master-dashboard.webp'

import styles from './styles.module.css'

const scenes = [
  // og impact
  {
    src: ogImpactHome,
    demo: 'ogimpact',
    key: 'ogimpact-home',
    label: 'OG Impact'
  },
  {
    src: ogImpactPricing,
    demo: 'ogimpact',
    key: 'ogimpact-pricing',
    label: 'OG Impact Pricing'
  },
  {
    src: ogImpactDocs,
    demo: 'ogimpact',
    key: 'ogimpact-docs',
    label: 'OG Impact API Docs'
  },
  {
    src: ogImpactDashboard,
    demo: 'ogimpact',
    key: 'ogimpact-dashboard',
    label: 'OG Impact Dashboard'
  },

  // imagemin
  {
    src: imageminHome,
    demo: 'imagemin',
    key: 'imagemin-home',
    label: 'Imagemin'
  },
  {
    src: imageminPricing,
    demo: 'imagemin',
    key: 'imagemin-pricing',
    label: 'Imagemin Pricing'
  },
  {
    src: imageminDocs,
    demo: 'imagemin',
    key: 'imagemin-docs',
    label: 'Imagemin API Docs'
  },
  {
    src: imageminDashboard,
    demo: 'imagemin',
    key: 'imagemin-dashboard',
    label: 'Imagemin Dashboard'
  },

  // puppet master
  {
    src: puppetMasterHome,
    demo: 'puppet-master',
    key: 'puppet-master-home',
    label: 'Puppeteer'
  },
  {
    src: puppetMasterPricing,
    demo: 'puppet-master',
    key: 'puppet-master-pricing',
    label: 'Puppeteer Pricing'
  },
  {
    src: puppetMasterDocs,
    demo: 'puppet-master',
    key: 'puppet-master-docs',
    label: 'Puppeteer API Docs'
  },
  {
    src: puppetMasterDashboard,
    demo: 'puppet-master',
    key: 'puppet-master-dashboard',
    label: 'Puppeteer Dashboard'
  }
]

@observer
export class ExampleSlideshow extends Component {
  _scenes = scenes

  @observable
  _selectedSceneIndex = 0

  render() {
    return (
      <HotKeys
        className={styles.container}
        handlers={{
          slideshowMoveSelectionLeft: this._onMoveSelectionLeft,
          slideshowMoveSelectionRight: this._onMoveSelectionRight
        }}
      >
        <SceneSlideshow
          scenes={this._scenes}
          selectedSceneIndex={this._selectedSceneIndex}
          onSelectScene={this._onSelectScene}
        />
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
