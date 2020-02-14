import React, { Component } from 'react'
import { Section, Button, theme } from 'react-saasify'

import { SocialProofBlob } from './SocialProofBlob/SocialProofBlob'

import styles from './styles.module.css'

import scottSilviPhoto from './images/scott-silvi.jpeg'

const socialProofItems = [
  {
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    photo: scottSilviPhoto,
    name: 'Scott Silvi',
    title: 'Principal Architect, Lab49'
  },
  {
    quote: 'Nala is a fat kitty and i love her to death <3',
    photo: scottSilviPhoto,
    name: 'Scott Silvi',
    title: 'Principal Architect, Lab49'
  }
]

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
          <Button shape='circle' icon='left' onClick={this._onSelectPrevItem} />

          <SocialProofBlob
            {...selectedItem}
            longestQuote={longestQuote}
            className={theme(styles, 'blob', className)}
            ref={this._blobRef}
          />

          <Button
            shape='circle'
            icon='right'
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
}
