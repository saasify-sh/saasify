import { autorun, observable, toJS, trace } from 'mobx'

import * as themes from '../themes'

class ThemeManagerClass {
  @observable
  theme = {}

  _themes = {}

  registerTheme = (name, themeFactory) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('register theme', name)
    }

    this._themes[name] = themeFactory
  }

  setTheme = (opts) => {
    let name

    if (typeof opts === 'object') {
      name = opts.name
    } else {
      name = opts
      opts = {}
    }

    const themeFactory = name && this._themes[name]
    if (themeFactory) {
      this.theme = themeFactory(opts)
    } else {
      console.error()
      console.error(`ThemeManager.setTheme(${name}) theme not found`)
      console.error('Must call ThemeManager.registerTheme first')
      console.error()
    }
  }
}

export const ThemeManager = observable(new ThemeManagerClass())
window.ThemeManager = ThemeManager

for (const [k, v] of Object.entries(themes)) {
  ThemeManager.registerTheme(k, v)
}

if (process.env.NODE_ENV === 'development') {
  autorun(
    () => {
      trace()
      console.log('theme', toJS(ThemeManager.theme))

      // window.less.modifyVars(ThemeManager.theme)
    },
    {
      name: 'Theme change (development)'
    }
  )
}

export default ThemeManager
