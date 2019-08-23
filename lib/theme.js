import { computed } from 'mobx'
import cs from 'classnames'

import ThemeManager from 'store/ThemeManager'

const themeUtil = (styles, id, ...args) => {
  const { theme } = ThemeManager
  return cs(styles[id], theme[id], ...args)
}

// TODO: add access to more dynamic variables here
themeUtil['@primary-color'] = computed(() => ThemeManager.theme['@primary-color'])

export default themeUtil
