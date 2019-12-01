import React, { useState, useCallback } from 'react'
import { ServiceInputWrapperWithLabel } from './ServiceInputWrapperWithLabel'

import codeTheme from 'react-syntax-highlighter/dist/esm/styles/hljs/vs2015'

import Editor from 'lib/react-simple-code-editor'
import { SyntaxHighlighter } from 'lib/react-syntax-highlighter'

import prettier from 'prettier/standalone'
import prettierBabylon from 'prettier/parser-babylon'

export const ServiceInputJSON = ({
  default: defaultValue,
  type,
  onChange,
  name,
  ...props
}) => {
  const [value, setValue] = useState(() =>
    prettier.format(JSON.stringify(defaultValue), {
      parser: 'json',
      plugins: [prettierBabylon]
    })
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
        useInlineStyles={false}
        style={{
          background: 'rgb(30, 30, 30)',
          borderRadius: 4,
          outline: 'none !important',
          zIndex: 10
        }}
      />
    </ServiceInputWrapperWithLabel>
  )
}
