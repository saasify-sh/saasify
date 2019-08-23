import { observable } from 'mobx'

import deployment from '../lib/deployment'

// TODO: dynamically import themes to reduce bundle size
// (low priority until / unless we have a lot more themes)
import * as themes from '../themes'

const DEFAULT_THEME = 'okta'

class ThemeManager {
  @observable
  theme

  constructor() {
    this.setTheme(deployment.project.saas.theme)
  }

  setTheme = (opts) => {
    const { name = DEFAULT_THEME } = opts

    const themeFactory = themes[name]
    this.theme = themeFactory(opts)

    // TODO: update antd less variables
  }
}

export default observable(new ThemeManager())
