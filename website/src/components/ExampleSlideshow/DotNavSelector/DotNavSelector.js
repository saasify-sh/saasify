import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'

import { observer } from 'mobx-react'

import styles from './styles.module.css'

@observer
export class DotNavSelector extends Component {
  static propTypes = {
    scenes: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedSceneIndex: PropTypes.number.isRequired,
    onSelectScene: PropTypes.func.isRequired
  }

  render() {
    const { scenes, selectedSceneIndex, onSelectScene, className } = this.props

    return (
      <div className={cs(styles.dotNavSelector, className)}>
        <ul>
          {scenes.map((scene, index) => {
            const isSelected = selectedSceneIndex === index
            const className = isSelected ? styles.current : ''

            return (
              <li className={className} key={scene.src}>
                <a onClick={() => onSelectScene(index)} />
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
