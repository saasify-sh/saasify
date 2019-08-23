import styles from './okta.module.css'

export const okta = (opts = { }) => {
  // TODO: make more dynamic based on less variables
  return {
    ...styles,
    '@name': 'okta',
    '@section-fg-color': '#23303a',
    '@section-bg-color': '#1e3a54',
    ...opts
  }
}
