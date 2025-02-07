"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

interface TagFilterProps {
  allTags: string[]
}

export default function TagFilter({ allTags }: TagFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    const tags = searchParams.get("tags")
    if (tags) {
      setSelectedTags(tags.split(","))
    } else {
      setSelectedTags([])
    }
  }, [searchParams])

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]

    setSelectedTags(newTags)

    const currentParams = new URLSearchParams(searchParams.toString())
    if (newTags.length > 0) {
      currentParams.set("tags", newTags.join(","))
    } else {
      currentParams.delete("tags")
    }

    // Preserve the current page if it exists
    if (!currentParams.has("page") && searchParams.has("page")) {
      currentParams.set("page", searchParams.get("page")!)
    }

    router.push(`/?${currentParams.toString()}`)
  }

  if (!allTags.length) return null

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-gray-400">Filter by tags:</h2>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTags.includes(tag) ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

