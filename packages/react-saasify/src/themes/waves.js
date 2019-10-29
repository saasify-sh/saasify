import styles from './waves.module.css'

export const waves = (opts = {}) => {
  // TODO: make styles more dynamic based on less variables
  // TODO: add fonts
  return {
    ...styles,
    '@name': 'waves',
    '@section-fg-color': '#FFFFFF',
    '@section-bg-color': '#FFFFFF',
    '@primary-color': '#5061CB',
    ...opts
  }
}
