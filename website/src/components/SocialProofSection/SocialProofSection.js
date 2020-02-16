import React, { Component } from 'react'
import { Section, Button, theme } from 'react-saasify'
import { Swipeable } from 'react-swipeable'

import { SocialProofBlob } from './SocialProofBlob/SocialProofBlob'

import styles from './styles.module.css'

import photoChrisVilla from './images/chris-villa.jpeg'
import photoJustinBennett from './images/justin-bennett.jpeg'
import photoNikonRasumov from './images/nikon-rasumov.jpeg'
import photoScottSilvi from './images/scott-silvi.jpeg'
import photoZachLendon from './images/zach-lendon.jpeg'

const socialProofItems = [
  {
    quote:
      'I love it. The ability to quickly launch and experiment with different SaaS business ideas is a game changer for aspiring entrepreneurs.',
    photo: photoScottSilvi,
    name: 'Scott Silvi',
    title: 'Principal Architect, Lab49'
  },
  {
    quote:
      'I build a lot of indie products, and Saasify is a seismic shift in how I launch MVPs. My time to market has been cut by an order of magnitude.',
    photo: photoChrisVilla,
    name: 'Chris Villa',
    title: 'Indie Maker'
  },
  {
    quote:
      "I think it's amazing how Saasify's helping developers to get their business ideas off the ground.",
    photo: photoZachLendon,
    name: 'Zach Lendon',
    title: 'Director, AIM Consulting Group'
  },
  {
    quote:
      "The hardest part about getting something off the ground isn't the product itself... it's all the other stuff. That's why I love Saasify.",
    photo: photoJustinBennett,
    name: 'Justin Bennett',
    title: 'Senior Software Engineer, Artsy'
  },
  {
    quote:
      "We're partnering with Saasify as part of our mission to help machine learning researchers offer independent alternatives to large SaaS vendors.",
    photo: photoNikonRasumov,
    name: 'Nikon Rasumov',
    title: 'Founder & CEO, kindlyAnswer.me'
  }
]

// TODO: this whole longestQuote thing is used for layout purposes to ensure
// that the blobs don't resize regardless of the length of the currently
// selected quote. it's pretty hacky but it works...
const longestQuote = socialProofItems.reduce(
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

    const selectedItem = socialProofItems[selectedItemIndex]

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
      index += socialProofItems.length
    }

    if (index >= socialProofItems.length) {
      index %= socialProofItems.length
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
