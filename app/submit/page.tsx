"use client"

import { useState } from "react"
import { createQuery } from "../actions"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SubmitQuery() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      await createQuery(title, content, description, tags)
      router.push("/")
    } catch (error) {
      console.error("Failed to submit query:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-400 hover:underline mb-4 inline-block">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-6">Submit New Query</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white h-24"
              placeholder="Provide a brief description of what this query does..."
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block mb-2 font-medium">
              Query Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white h-40 font-mono"
              required
            />
          </div>

          <div>
            <label htmlFor="tags" className="block mb-2 font-medium">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              placeholder="Enter tags separated by commas (e.g., stream, search, logs)"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Submit Query
          </button>
        </form>
      </div>
    </div>
  )
}

