import React, { Component } from 'react'
import { Section, Button, theme } from 'react-saasify'
import { Swipeable } from 'react-swipeable'

import { SocialProofBlob } from './SocialProofBlob/SocialProofBlob'
import { testimonials } from './testimonials'

import styles from './styles.module.css'

// TODO: this whole longestQuote thing is used for layout purposes to ensure
// that the blobs don't resize regardless of the length of the currently
// selected quote. it's pretty hacky but it works...
const longestQuote = testimonials.reduce(
  (acc, item) => (acc.length < item.quote.length ? item.quote : acc),
  ''
)

// TODO: have title change between Developers / Indie Hackers / Makers

export class SocialProofSection extends Component {
  _blobRef = React.createRef()

  state = {
    selectedItemIndex: 0
  }

  render() {
    const { className, ...rest } = this.props
    const { selectedItemIndex } = this.state

    const selectedItem = testimonials[selectedItemIndex]

    return (
      <Section
        id='testimonials'
        title='We ❤️ Developers'
        className={theme(styles, 'testimonials', className)}
        {...rest}
      >
        <div className={theme(styles, 'gallery', className)}>
          <Button
            className={styles.button}
            shape='circle'
            icon='left'
            size='large'
            onClick={this._onSelectPrevItem}
          />

          <Swipeable
            onSwipedLeft={this._onSwipeLeft}
            onSwipedRight={this._onSwipeRight}
          >
            <SocialProofBlob
              {...selectedItem}
              longestQuote={longestQuote}
              className={theme(styles, 'blob', className)}
              ref={this._blobRef}
            />
          </Swipeable>

          <Button
            className={styles.button}
            shape='circle'
            icon='right'
            size='large'
            onClick={this._onSelectNextItem}
          />
        </div>
      </Section>
    )
  }

  _onSelectPrevItem = () => {
    this._blobRef.current.reset()
    this._updateSelectedItemIndex(this.state.selectedItemIndex - 1)
  }

  _onSelectNextItem = () => {
    this._blobRef.current.reset()
    this._updateSelectedItemIndex(this.state.selectedItemIndex + 1)
  }

  _updateSelectedItemIndex = (index = this.state.selectedItemIndex) => {
    while (index < 0) {
      index += testimonials.length
    }

    if (index >= testimonials.length) {
      index %= testimonials.length
    }

    this.setState({
      selectedItemIndex: index
    })
  }

  _onSwipeLeft = () => {
    this._onSelectNextItem()
  }

  _onSwipeRight = () => {
    this._onSelectPrevItem()
  }
}
