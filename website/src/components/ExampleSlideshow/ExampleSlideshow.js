import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { HotKeys } from 'react-hotkeys'
import { Swipeable } from 'react-swipeable'

import { SceneSlideshow } from './SceneSlideshow/SceneSlideshow'
import { DotNavSelector } from './DotNavSelector/DotNavSelector'
import { scenes } from './scenes'

import arrowLeft from './images/left-hand-drawn-arrow.svg'
import arrowRight from './images/right-hand-drawn-arrow.svg'

import styles from './styles.module.css'

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
        <DotNavSelector
          className={styles.dotNavSelector}
          scenes={this._scenes}
          selectedSceneIndex={this._selectedSceneIndex}
          onSelectScene={this._onSelectScene}
        />

        <Swipeable
          onSwipedLeft={this._onSwipeLeft}
          onSwipedRight={this._onSwipeRight}
          className={styles.slideshow}
        >
          <SceneSlideshow
            scenes={this._scenes}
            selectedSceneIndex={this._selectedSceneIndex}
            onSelectScene={this._onSelectScene}
          />
        </Swipeable>

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
                alt='Arrow'
              />

              <div dangerouslySetInnerHTML={note} />
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

  _onSwipeLeft = () => {
    this._onMoveSelectionRight()
  }

  _onSwipeRight = () => {
    this._onMoveSelectionLeft()
  }
}
