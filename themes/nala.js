import styles from './nala.module.css'

export const nala = (opts = { }) => {
  return {
    ...styles,
    '@name': 'nala',
    '@section-fg-color': '#222',
    '@section-bg-color': '#363636',
    '@primary-color': '#ff5252',
    ...opts,
    fonts: [ 'Oxygen' ]
  }
}
