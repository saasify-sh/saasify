import styles from './sadie.module.css'

// https://colorhunt.co/palette/105443

export const sadie = (opts = { }) => {
  return {
    ...styles,
    '@name': 'sadie',
    '@section-fg-color': '#ffe2e2',
    '@section-bg-color': '#f6f6f6',
    // '@primary-color': '#8785a2',
    ...opts,
    fonts: [ 'Manjari' ]
  }
}
