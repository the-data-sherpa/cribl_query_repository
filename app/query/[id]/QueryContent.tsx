"use client"

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface QueryContentProps {
  content: string
}

export default function QueryContent({ content }: QueryContentProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 bg-opacity-50 hover:bg-opacity-75 text-gray-300 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
        title={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
            />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
            <path
              d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm4.707 5.707a1 1 0 00-1.414-1.414L4 11.586V16h4.414l-2.293-2.293a1 1 0 010-1.414zm4.586-4.586a1 1 0 00-1.414 1.414L13.586 10l-2.293 2.293a1 1 0 001.414 1.414L15 11.414V7.586l-2.707-2.707z"
            />
          </svg>
        )}
      </button>
      <SyntaxHighlighter
        language="sql"
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0.375rem',
          padding: '1rem',
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  )
}

