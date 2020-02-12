import React, { Component } from 'react'
import PropTypes from 'prop-types'
import sizeMe from 'react-sizeme'
import BlockImage from 'react-block-image'

import { observer } from 'mobx-react'
import { Motion, spring } from 'react-motion'

import styles from './styles.module.css'

// NOTE (travis): the order of these decorators is important... (hic draconis)
@sizeMe({ monitorWidth: true, monitorHeight: true })
@observer
export class SceneSlideshow extends Component {
  static propTypes = {
    scenes: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedSceneIndex: PropTypes.number.isRequired,
    onSelectScene: PropTypes.func.isRequired,
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    })
  }

  render() {
    const { scenes, selectedSceneIndex, onSelectScene, size } = this.props

    const baseWidth = size.width ? size.width : window.innerWidth
    const baseHeight = size.height ? size.height : window.innerHeight * 0.4

    const verticalSpaceUsage = 0.95
    const marginRight = Math.min(48, Math.max(16, baseWidth / 40))

    const widthC = size.width * verticalSpaceUsage
    const heightC = baseHeight * verticalSpaceUsage

    const aspectRatio = 1920 / 1510

    const heightR = widthC / aspectRatio
    const widthR = heightC * aspectRatio

    const width = Math.min(widthC, widthR)
    const height = Math.min(heightC, heightR)

    const center = {
      x: size.width / 2,
      y: baseHeight / 2
    }

    const selectedScenePos = {
      x: center.x - width / 2,
      y: center.y - height / 2
    }

    const x = selectedScenePos.x - (width + marginRight) * selectedSceneIndex
    const y = selectedScenePos.y

    return (
      <div className={styles.container}>
        <Motion
          defaultStyle={{
            x,
            y,
            width,
            height
          }}
          style={{
            x: spring(x),
            y: spring(y),
            width: spring(width),
            height: spring(height)
          }}
        >
          {({ x, y, width, height }) => (
            <>
              <div className={styles.track} style={{ left: x, top: y }}>
                {scenes.map((scene, index) => {
                  const isSelected = selectedSceneIndex === index
                  const className = `${styles.scene} ${
                    isSelected ? styles.activeScene : ''
                  }`

                  return (
                    <div
                      className={className}
                      key={scene.src}
                      style={{
                        width,
                        height,
                        marginRight
                      }}
                    >
                      <BlockImage
                        src={scene.src}
                        style={{ width, height }}
                        className={styles.image}
                        onClick={() => onSelectScene(index)}
                      />
                    </div>
                  )
                })}
              </div>
              <div className={styles.overlay} />
            </>
          )}
        </Motion>
      </div>
    )
  }
}
