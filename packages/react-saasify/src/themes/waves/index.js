import styles from './waves.module.css'
import cv from 'css-var'
import waveSvg from './assets/wave.svg'
import waveShadowedSvg from './assets/wave-shadowed.svg'

export const waves = ({
  backgroundImage,
  buttonStyle = 'normal',
  color = '#5061CB',
  ...opts
} = {}) => {
  // Define root CSS vars
  cv({
    'border-radius': buttonStyle === 'rounded' ? '100px' : '4px',
    'color-primary': color,

    // Adjust based on background image
    'background-image': backgroundImage
      ? `linear-gradient(180deg, rgba(158,143,143,0.50) 0%, rgba(0,0,0,0.50) 100%), url(${backgroundImage})`
      : 'linear-gradient(104deg, #fcfcfc 13%, #f5f7fb 91%)',
    'background-image-wave': backgroundImage
      ? `url(${waveSvg})`
      : `url(${waveShadowedSvg})`,
    'color-nav-secondary-cta': backgroundImage ? 'white' : color,
    'hero-color': backgroundImage ? 'white' : '#3a3a3a',
    'nav-border-width': backgroundImage ? '0px' : '1px'
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
