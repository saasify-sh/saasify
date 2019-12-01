import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/light'

// tomorrow, a11y-light
import theme from 'react-syntax-highlighter/dist/esm/styles/hljs/tomorrow'

import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python'
import ruby from 'react-syntax-highlighter/dist/esm/languages/hljs/ruby'
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash'

SyntaxHighlighter.registerLanguage('js', js)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('ruby', ruby)
SyntaxHighlighter.registerLanguage('bash', bash)

export { SyntaxHighlighter, theme }
