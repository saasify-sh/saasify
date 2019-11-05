import styles from './waves.module.css'
import cv from 'css-var'
import waveSvg from './assets/wave.svg'
import waveShadowedSvg from './assets/wave-shadowed.svg'
import codeTheme from 'react-syntax-highlighter/dist/esm/styles/hljs/vs2015'

export const waves = ({
  backgroundImage,
  buttonStyle = 'normal',
  color = '#5061CB',
  gradient = true,
  gradientDark = false,
  wave = true,
  codeBlockDark = false,
  ...opts
} = {}) => {
  // Define root CSS vars

  const gradientTop = gradientDark
    ? 'rgba(0,0,0,0.35)'
    : 'rgba(158,143,143,0.50)'

  cv({
    'border-radius': buttonStyle === 'rounded' ? '100px' : '4px',
    'color-primary': color,

    // Adjust based on background image
    'background-image': backgroundImage
      ? `${
          gradient
            ? `linear-gradient(180deg, ${gradientTop} 0%, rgba(0,0,0,0.50) 100%), `
            : ''
        }url(${backgroundImage})`
      : 'linear-gradient(104deg, #fcfcfc 13%, #f5f7fb 91%)',
    'background-image-wave': wave
      ? backgroundImage
        ? `url(${waveSvg})`
        : `url(${waveShadowedSvg})`
      : '',
    'color-nav-secondary-cta': backgroundImage ? 'white' : color,
    'code-block-background': codeBlockDark
      ? '#1E1E1E'
      : 'linear-gradient(174deg, #6e60e1 0%, #1b3b87 93%)',
    'code-block-shadow-color': codeBlockDark ? '#1E1E1E95' : '#392ab195',
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
    codeTheme,
    ...opts
  }
}
