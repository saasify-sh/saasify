import styles from './waves.module.css'
import cv from 'css-var'

export const waves = ({
  backgroundImage,
  buttonStyle = 'normal',
  color = '#5061CB',
  ...opts
} = {}) => {
  // Define root CSS vars
  cv({
    'border-radius': buttonStyle === 'rounded' ? '100px' : '4px',
    'color-primary': color
  })

  // TODO: make styles more dynamic based on less variables
  // TODO: add fonts
  return {
    ...styles,
    '@name': 'waves',
    '@section-fg-color': '#FFFFFF',
    '@section-bg-color': '#FFFFFF',
    '@primary-color': color,
    ...opts
  }
}
