"use client"

import type React from "react"
import { Highlight, themes } from "prism-react-renderer"

interface SyntaxHighlighterProps {
  code: string
}

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ code }) => {
  return (
    <Highlight theme={themes.vsDark} code={code} language="sql">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${className} p-4 overflow-auto`} style={style}>
          {tokens.map((line, i) => {
            const { key, ...restLineProps } = getLineProps({ line, key: i })
            return (
              <div key={key} {...restLineProps}>
                <span className="mr-4 text-gray-500">{i + 1}</span>
                {line.map((token, key) => {
                  const { key: tokenKey, ...restTokenProps } = getTokenProps({ token, key })
                  return <span key={tokenKey} {...restTokenProps} />
                })}
              </div>
            )
          })}
        </pre>
      )}
    </Highlight>
  )
}

export default SyntaxHighlighter

