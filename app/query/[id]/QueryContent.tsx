"use client"

import dynamic from "next/dynamic"
import CopyToClipboardButton from "@/app/components/CopyToClipboardButton"

const SyntaxHighlighter = dynamic(() => import("./SyntaxHighlighter"), { ssr: false })

interface QueryContentProps {
  content: string
}

export default function QueryContent({ content }: QueryContentProps) {
  return (
    <div>
      <div className="flex justify-end mb-2">
        <CopyToClipboardButton text={content} />
      </div>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <SyntaxHighlighter code={content} />
      </div>
    </div>
  )
}

