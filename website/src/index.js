/**
 * React application entrypoint.
 */

// Note: the order of these imports is important mostly for CSS precedence
import 'styles/global.css'
import 'react-saasify'
import 'react-saasify/dist/index.css'
import './lib/init'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))
