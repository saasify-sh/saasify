import styles from './okta.module.css'

export const okta = (opts = {}) => {
  // TODO: make styles more dynamic based on less variables
  // TODO: add fonts
  return {
    ...styles,
    '@name': 'okta',
    '@section-fg-color': '#23303a',
    '@section-bg-color': '#1e3a54',
    '@primary-color': '#d23d67',
    ...opts
  }
}
