import React, { useState, useCallback } from 'react'
import { ServiceInputWrapperWithLabel } from './ServiceInputWrapperWithLabel'
import { Checkbox } from 'lib/antd'

import { renderToString } from 'react-dom/server'

import Editor from 'react-simple-code-editor'

import codeTheme from 'react-syntax-highlighter/dist/esm/styles/hljs/vs2015'

import { SyntaxHighlighter } from 'lib/react-syntax-highlighter'

export const ServiceInputJSON = ({
  default: defaultValue,
  type,
  onChange,
  name,
  ...props
}) => {
  const [value, setValue] = useState(() =>
    JSON.stringify(defaultValue, null, 2)
  )

  const onValueChange = useCallback((value) => {
    setValue(value)

    try {
      onChange({
        target: { name: props.propKey, value: JSON.parse(value) }
      })
    } catch {}
  }, [])

  const highlight = useCallback(
    (code) => (
      <SyntaxHighlighter language='json' style={codeTheme}>
        {code}
      </SyntaxHighlighter>
    ),
    []
  )

  return (
    <ServiceInputWrapperWithLabel {...props}>
      <Editor
        value={value}
        onValueChange={onValueChange}
        highlight={highlight}
        style={{
          background: 'rgb(30, 30, 30)',
          borderRadius: 4,
          outline: 'none !important'
        }}
      />
    </ServiceInputWrapperWithLabel>
  )
}
