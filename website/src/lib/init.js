import { bootstrap, ThemeManager } from 'react-saasify'
import theme from './theme'

bootstrap()

ThemeManager.registerTheme('clean', theme)
ThemeManager.setTheme('clean')
