import React, { Component } from 'react'
import { HotKeys } from 'react-hotkeys'

import { Section, theme } from 'react-saasify'

import { ExampleSlideshow } from '../ExampleSlideshow'

import styles from './styles.module.css'

const hotKeyMap = {
  slideshowMoveSelectionLeft: 'left',
  slideshowMoveSelectionRight: 'right'
}

export class ExamplesSection extends Component {
  render() {
    const { className, ...rest } = this.props

    return (
      <Section
        id='examples'
        title='Examples'
        className={theme(styles, 'examples', className)}
        {...rest}
      >
        <HotKeys className={styles.section} keyMap={hotKeyMap}>
          <ExampleSlideshow />
        </HotKeys>
      </Section>
    )
  }
}
