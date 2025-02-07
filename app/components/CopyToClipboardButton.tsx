"use client"

import { useState } from "react"

interface CopyToClipboardButtonProps {
  text: string
}

export default function CopyToClipboardButton({ text }: CopyToClipboardButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <button
      onClick={copyToClipboard}
      className={`px-4 py-2 rounded transition-colors ${
        isCopied ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {isCopied ? "Copied!" : "Copy to Clipboard"}
    </button>
  )
}

