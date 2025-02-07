"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface SearchFormProps {
  initialSearchTerm: string
}

export default function SearchForm({ initialSearchTerm }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setSearchTerm(initialSearchTerm)
  }, [initialSearchTerm])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const currentParams = new URLSearchParams(searchParams.toString())

    if (searchTerm) {
      currentParams.set("q", searchTerm)
    } else {
      currentParams.delete("q")
    }

    // Reset to the first page when searching
    currentParams.delete("page")

    router.push(`/?${currentParams.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search queries by title, description, or content..."
          className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded-l text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  )
}

